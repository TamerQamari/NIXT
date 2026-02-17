'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'

// Types
export interface AllowedUser {
  email: string
  name: string
  role: 'client' | 'manager' | 'viewer'
  addedAt: string
  addedBy: string
  dashboardSections: string[] // which sections they can see
  isActive: boolean
}

export interface DashboardSession {
  email: string
  name: string
  role: string
  loginAt: string
  dashboardSections: string[]
}

interface AuthContextType {
  // Admin functions (controllers page)
  allowedUsers: AllowedUser[]
  addAllowedUser: (user: Omit<AllowedUser, 'addedAt'>) => void
  removeAllowedUser: (email: string) => void
  updateAllowedUser: (email: string, updates: Partial<AllowedUser>) => void
  isEmailAllowed: (email: string) => boolean
  getAllowedUser: (email: string) => AllowedUser | undefined
  getUserRoles: (email: string) => AllowedUser[]

  // Dashboard session functions
  dashboardSession: DashboardSession | null
  loginToDashboard: (email: string) => { success: boolean; message: string; roles?: AllowedUser[] }
  loginToDashboardWithRole: (email: string, role: string) => { success: boolean; message: string }
  logoutFromDashboard: () => void
  isLoggedIn: boolean

  // Shared data from controllers
  sharedData: SharedControllerData
  updateSharedData: (data: Partial<SharedControllerData>) => void
}

export interface SharedControllerData {
  clients: any[]
  projects: any[]
  transactions: any[]
  activities: any[]
  users: any[]
  lastUpdated: string
}

const STORAGE_KEYS = {
  ALLOWED_USERS: 'nixt-allowed-users',
  DASHBOARD_SESSION: 'nixt-dashboard-session',
  SHARED_DATA: 'nixt-shared-controller-data',
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([])
  const [dashboardSession, setDashboardSession] = useState<DashboardSession | null>(null)
  const [sharedData, setSharedData] = useState<SharedControllerData>({
    clients: [],
    projects: [],
    transactions: [],
    activities: [],
    users: [],
    lastUpdated: '',
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.ALLOWED_USERS)
      if (savedUsers) {
        setAllowedUsers(JSON.parse(savedUsers))
      }

      const savedSession = localStorage.getItem(STORAGE_KEYS.DASHBOARD_SESSION)
      if (savedSession) {
        const session = JSON.parse(savedSession)
        // Check if session is still valid (24h expiry)
        const loginTime = new Date(session.loginAt).getTime()
        const now = Date.now()
        if (now - loginTime < 24 * 60 * 60 * 1000) {
          setDashboardSession(session)
        } else {
          localStorage.removeItem(STORAGE_KEYS.DASHBOARD_SESSION)
        }
      }

      const savedData = localStorage.getItem(STORAGE_KEYS.SHARED_DATA)
      if (savedData) {
        setSharedData(JSON.parse(savedData))
      }
    } catch (e) {
      console.error('Error loading auth data:', e)
    }
  }, [])

  // Save allowed users to localStorage
  const saveAllowedUsers = useCallback((users: AllowedUser[]) => {
    setAllowedUsers(users)
    localStorage.setItem(STORAGE_KEYS.ALLOWED_USERS, JSON.stringify(users))
  }, [])

  // Add allowed user (allow same email with different roles)
  const addAllowedUser = useCallback((user: Omit<AllowedUser, 'addedAt'>) => {
    const newUser: AllowedUser = {
      ...user,
      addedAt: new Date().toISOString(),
    }
    // Remove existing entry with same email AND same role, but keep other roles
    const updated = [...allowedUsers.filter(u => !(u.email.toLowerCase() === user.email.toLowerCase() && u.role === user.role)), newUser]
    saveAllowedUsers(updated)
  }, [allowedUsers, saveAllowedUsers])

  // Remove allowed user (remove specific role for email)
  const removeAllowedUser = useCallback((email: string, role?: string) => {
    const updated = role 
      ? allowedUsers.filter(u => !(u.email.toLowerCase() === email.toLowerCase() && u.role === role))
      : allowedUsers.filter(u => u.email.toLowerCase() !== email.toLowerCase())
    saveAllowedUsers(updated)
    // If current session is this user, log them out
    if (dashboardSession?.email.toLowerCase() === email.toLowerCase()) {
      setDashboardSession(null)
      localStorage.removeItem(STORAGE_KEYS.DASHBOARD_SESSION)
    }
  }, [allowedUsers, dashboardSession, saveAllowedUsers])

  // Update allowed user
  const updateAllowedUser = useCallback((email: string, updates: Partial<AllowedUser>) => {
    const updated = allowedUsers.map(u => 
      u.email === email ? { ...u, ...updates } : u
    )
    saveAllowedUsers(updated)
  }, [allowedUsers, saveAllowedUsers])

  // Check if email is allowed
  const isEmailAllowed = useCallback((email: string) => {
    return allowedUsers.some(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive)
  }, [allowedUsers])

  // Get allowed user by email
  const getAllowedUser = useCallback((email: string) => {
    return allowedUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  }, [allowedUsers])

  // Get all roles for an email
  const getUserRoles = useCallback((email: string): AllowedUser[] => {
    return allowedUsers.filter(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive)
  }, [allowedUsers])

  // Login to dashboard
  const loginToDashboard = useCallback((email: string): { success: boolean; message: string; roles?: AllowedUser[] } => {
    const userEntries = allowedUsers.filter(
      u => u.email.toLowerCase() === email.toLowerCase()
    )

    if (userEntries.length === 0) {
      return {
        success: false,
        message: 'EMAIL_NOT_FOUND',
      }
    }

    const activeEntries = userEntries.filter(u => u.isActive)
    if (activeEntries.length === 0) {
      return {
        success: false,
        message: 'ACCOUNT_DISABLED',
      }
    }

    // If user has multiple active roles, ask them to choose
    if (activeEntries.length > 1) {
      return {
        success: false,
        message: 'MULTIPLE_ROLES',
        roles: activeEntries,
      }
    }

    // Single role - login directly
    const user = activeEntries[0]
    const session: DashboardSession = {
      email: user.email,
      name: user.name,
      role: user.role,
      loginAt: new Date().toISOString(),
      dashboardSections: user.dashboardSections,
    }

    setDashboardSession(session)
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_SESSION, JSON.stringify(session))

    return {
      success: true,
      message: 'LOGIN_SUCCESS',
    }
  }, [allowedUsers])

  // Login to dashboard with a specific role
  const loginToDashboardWithRole = useCallback((email: string, role: string): { success: boolean; message: string } => {
    const user = allowedUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.role === role && u.isActive
    )

    if (!user) {
      return { success: false, message: 'EMAIL_NOT_FOUND' }
    }

    const session: DashboardSession = {
      email: user.email,
      name: user.name,
      role: user.role,
      loginAt: new Date().toISOString(),
      dashboardSections: user.dashboardSections,
    }

    setDashboardSession(session)
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_SESSION, JSON.stringify(session))

    return { success: true, message: 'LOGIN_SUCCESS' }
  }, [allowedUsers])

  // Logout from dashboard
  const logoutFromDashboard = useCallback(() => {
    setDashboardSession(null)
    localStorage.removeItem(STORAGE_KEYS.DASHBOARD_SESSION)
  }, [])

  // Update shared data (from controllers)
  const updateSharedData = useCallback((data: Partial<SharedControllerData>) => {
    setSharedData(prev => {
      const updated = { ...prev, ...data, lastUpdated: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEYS.SHARED_DATA, JSON.stringify(updated))
      return updated
    })
  }, [])

  const value: AuthContextType = {
    allowedUsers,
    addAllowedUser,
    removeAllowedUser,
    updateAllowedUser,
    isEmailAllowed,
    getAllowedUser,
    getUserRoles,
    dashboardSession,
    loginToDashboard,
    loginToDashboardWithRole,
    logoutFromDashboard,
    isLoggedIn: !!dashboardSession,
    sharedData,
    updateSharedData,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
