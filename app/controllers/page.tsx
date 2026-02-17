'use client'

import { useState, useMemo, useEffect } from 'react'
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import DashboardLogin from '@/components/Dashboard/DashboardLogin'
import {
  UsersIcon,
  BarChartIcon,
  WalletIcon,
  TrendingUpIcon,
  UserPlusIcon,
  FolderPlusIcon,
  FileTextIcon,
  SaveIcon,
  PinIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  LockIcon,
  UserIcon
} from '@/components/UI/ControllerIcons'
import styles from './Controllers.module.css'

// Define interfaces for type safety
interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  projects: number
  totalSpent: number
  joined: string
  lastActivity: string
}

interface Project {
  id: string
  name: string
  client: string
  clientEmail: string
  progress: number
  budget: number
  spent: number
  status: 'active' | 'completed' | 'pending' | 'on-hold'
  deadline: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  team: number
}

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  descriptionEn: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  client?: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'client' | 'developer'
  status: 'active' | 'inactive'
  lastLogin: string
}

interface Activity {
  id: string
  user: string
  action: string
  actionEn: string
  time: string
  details: string
  detailsEn: string
}

function ControllersContent() {
  const { t, language, setLanguage, dir } = useLanguage()
  const { allowedUsers, addAllowedUser, removeAllowedUser, updateAllowedUser, updateSharedData, dashboardSession, isLoggedIn, logoutFromDashboard } = useAuth()
  const isRTL = language === 'ar'

  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'projects' | 'finances' | 'users' | 'tickets' | 'analytics' | 'activity'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Client add form state
  const [showAddClientForm, setShowAddClientForm] = useState(false)
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientName, setNewClientName] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')

  // Manager add form state
  const [showAddManagerForm, setShowAddManagerForm] = useState(false)
  const [newManagerEmail, setNewManagerEmail] = useState('')
  const [newManagerName, setNewManagerName] = useState('')

  // Project edit form state
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editProjectName, setEditProjectName] = useState('')
  const [editProjectClient, setEditProjectClient] = useState('')
  const [editProjectProgress, setEditProjectProgress] = useState(0)
  const [editProjectBudget, setEditProjectBudget] = useState(0)
  const [editProjectSpent, setEditProjectSpent] = useState(0)
  const [editProjectStatus, setEditProjectStatus] = useState<Project['status']>('active')
  const [editProjectDeadline, setEditProjectDeadline] = useState('')
  const [editProjectPriority, setEditProjectPriority] = useState<Project['priority']>('medium')
  const [editProjectTeam, setEditProjectTeam] = useState(0)

  // Add project form state
  const [showAddProjectForm, setShowAddProjectForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectClient, setNewProjectClient] = useState('')
  const [newProjectBudget, setNewProjectBudget] = useState('')
  const [newProjectDeadline, setNewProjectDeadline] = useState('')
  const [newProjectPriority, setNewProjectPriority] = useState<Project['priority']>('medium')

  // Mock data - في التطبيق الحقيقي، ستأتي هذه البيانات من API
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'شركة الرياض التقنية',
      email: 'info@riyadhtech.sa',
      phone: '+966501234567',
      status: 'active',
      projects: 5,
      totalSpent: 450000,
      joined: '2025-01-15',
      lastActivity: '2026-02-16T10:30:00Z'
    },
    {
      id: '2',
      name: 'مؤسسة النور للتطوير',
      email: 'contact@alnoor.com',
      phone: '+966502345678',
      status: 'active',
      projects: 3,
      totalSpent: 280000,
      joined: '2025-03-20',
      lastActivity: '2026-02-15T14:20:00Z'
    },
    {
      id: '3',
      name: 'Omega Digital Solutions',
      email: 'info@omega.com',
      phone: '+966503456789',
      status: 'pending',
      projects: 1,
      totalSpent: 75000,
      joined: '2026-01-10',
      lastActivity: '2026-02-14T09:15:00Z'
    },
    {
      id: '4',
      name: 'شركة الابتكار الذكي',
      email: 'hello@smartinnovate.sa',
      phone: '+966504567890',
      status: 'active',
      projects: 8,
      totalSpent: 820000,
      joined: '2024-11-05',
      lastActivity: '2026-02-17T08:00:00Z'
    },
    {
      id: '5',
      name: 'TechVision International',
      email: 'contact@techvision.com',
      phone: '+966505678901',
      status: 'inactive',
      projects: 2,
      totalSpent: 150000,
      joined: '2025-06-12',
      lastActivity: '2026-01-20T16:45:00Z'
    },
  ])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'منصة التجارة الإلكترونية - NIXT Store',
      client: 'شركة الرياض التقنية',
      clientEmail: 'info@riyadhtech.sa',
      progress: 75,
      budget: 150000,
      spent: 112500,
      status: 'active',
      deadline: '2026-04-15',
      priority: 'high',
      team: 6
    },
    {
      id: '2',
      name: 'تطبيق إدارة المشاريع',
      client: 'مؤسسة النور للتطوير',
      clientEmail: 'contact@alnoor.com',
      progress: 45,
      budget: 95000,
      spent: 42750,
      status: 'active',
      deadline: '2026-05-20',
      priority: 'medium',
      team: 4
    },
    {
      id: '3',
      name: 'نظام إدارة المحتوى CMS',
      client: 'شركة الابتكار الذكي',
      clientEmail: 'hello@smartinnovate.sa',
      progress: 100,
      budget: 120000,
      spent: 118000,
      status: 'completed',
      deadline: '2026-01-30',
      priority: 'low',
      team: 5
    },
    {
      id: '4',
      name: 'Enterprise Dashboard System',
      client: 'Omega Digital Solutions',
      clientEmail: 'info@omega.com',
      progress: 20,
      budget: 85000,
      spent: 17000,
      status: 'active',
      deadline: '2026-06-10',
      priority: 'urgent',
      team: 7
    },
  ])

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 45000,
      description: 'دفعة مشروع التجارة الإلكترونية',
      descriptionEn: 'E-commerce project payment',
      date: '2026-02-15',
      status: 'completed',
      client: 'شركة الرياض التقنية'
    },
    {
      id: '2',
      type: 'expense',
      amount: 8500,
      description: 'رواتب الموظفين',
      descriptionEn: 'Employee salaries',
      date: '2026-02-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'income',
      amount: 25000,
      description: 'دفعة مقدمة لمشروع جديد',
      descriptionEn: 'Advance payment for new project',
      date: '2026-02-16',
      status: 'pending',
      client: 'مؤسسة النور للتطوير'
    },
  ]

  const users: User[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@nixt.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2026-02-17T08:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@nixt.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2026-02-16T15:20:00Z'
    },
    {
      id: '3',
      name: 'خالد العتيبي',
      email: 'khaled@nixt.com',
      role: 'developer',
      status: 'active',
      lastLogin: '2026-02-17T09:00:00Z'
    },
  ]

  const activities: Activity[] = [
    {
      id: '1',
      user: 'أحمد محمد',
      action: 'أضاف عميل جديد',
      actionEn: 'Added new client',
      time: '2026-02-17T10:30:00Z',
      details: 'شركة الابتكار الذكي',
      detailsEn: 'Smart Innovation Company'
    },
    {
      id: '2',
      user: 'Sarah Johnson',
      action: 'حدّث حالة المشروع',
      actionEn: 'Updated project status',
      time: '2026-02-17T09:15:00Z',
      details: 'منصة التجارة الإلكترونية - 75%',
      detailsEn: 'E-commerce Platform - 75%'
    },
    {
      id: '3',
      user: 'خالد العتيبي',
      action: 'أتم مهمة',
      actionEn: 'Completed task',
      time: '2026-02-16T16:45:00Z',
      details: 'تطوير واجهة الداشبورد',
      detailsEn: 'Dashboard UI Development'
    },
  ]

  // Sync data to shared storage for dashboard
  useEffect(() => {
    updateSharedData({
      clients,
      projects,
      transactions,
      activities,
      users,
    })
  }, [clients, projects]) // eslint-disable-line react-hooks/exhaustive-deps

  // Open edit modal for a project
  const openEditProject = (project: Project) => {
    setEditingProject(project)
    setEditProjectName(project.name)
    setEditProjectClient(project.clientEmail)
    setEditProjectProgress(project.progress)
    setEditProjectBudget(project.budget)
    setEditProjectSpent(project.spent)
    setEditProjectStatus(project.status)
    setEditProjectDeadline(project.deadline)
    setEditProjectPriority(project.priority)
    setEditProjectTeam(project.team)
  }

  // Save edited project
  const saveEditedProject = () => {
    if (!editingProject) return
    const selectedClient = clients.find(c => c.email === editProjectClient)
    const updatedProject: Project = {
      ...editingProject,
      name: editProjectName,
      client: selectedClient?.name || editingProject.client,
      clientEmail: editProjectClient,
      progress: editProjectProgress,
      budget: editProjectBudget,
      spent: editProjectSpent,
      status: editProjectStatus,
      deadline: editProjectDeadline,
      priority: editProjectPriority,
      team: editProjectTeam,
    }
    setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p))
    setEditingProject(null)
  }

  // Add new project
  const addNewProject = () => {
    const selectedClient = clients.find(c => c.email === newProjectClient)
    if (!newProjectName || !selectedClient) return
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      client: selectedClient.name,
      clientEmail: selectedClient.email,
      progress: 0,
      budget: parseFloat(newProjectBudget) || 0,
      spent: 0,
      status: 'pending',
      deadline: newProjectDeadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: newProjectPriority,
      team: 1,
    }
    setProjects(prev => [...prev, newProject])
    setShowAddProjectForm(false)
    setNewProjectName('')
    setNewProjectClient('')
    setNewProjectBudget('')
    setNewProjectDeadline('')
    setNewProjectPriority('medium')
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalClients = clients.length
    const activeClients = clients.filter(c => c.status === 'active').length
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'active').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    
    const totalRevenue = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const pendingRevenue = transactions
      .filter(t => t.type === 'income' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      totalClients,
      activeClients,
      totalProjects,
      activeProjects,
      completedProjects,
      totalRevenue,
      pendingRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses
    }
  }, [clients, projects, transactions])

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    )
  }, [clients, searchTerm])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: '#00C781',
      inactive: '#FF4444',
      pending: '#FF8C00',
      completed: '#00C781',
      'on-hold': '#666',
      failed: '#FF4444'
    }
    return colors[status] || '#666'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: '#FF4444',
      high: '#FF8C00',
      medium: '#0070F3',
      low: '#00C781'
    }
    return colors[priority] || '#666'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isRTL 
      ? date.toLocaleDateString('ar-SA') 
      : date.toLocaleDateString('en-US')
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return isRTL ? `منذ ${diffMins} دقيقة` : `${diffMins} mins ago`
    } else if (diffHours < 24) {
      return isRTL ? `منذ ${diffHours} ساعة` : `${diffHours} hours ago`
    } else if (diffDays < 7) {
      return isRTL ? `منذ ${diffDays} يوم` : `${diffDays} days ago`
    } else {
      return formatDate(dateString)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Login guard - require manager role
  const userIsLoggedIn = isLoggedIn && dashboardSession
  const isManager = dashboardSession?.role === 'manager'

  if (!userIsLoggedIn && !isAuthenticated) {
    return <DashboardLogin onLoginSuccess={() => setIsAuthenticated(true)} context="controllers" />
  }

  // If logged in but not a manager, show access denied
  if (userIsLoggedIn && !isManager && !isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030014',
        flexDirection: 'column',
        gap: '1.5rem',
        color: '#fff',
        direction: dir,
        fontFamily: 'inherit',
      }}>
        <div style={{ fontSize: '4rem', opacity: 0.5 }}>🔒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {isRTL ? 'لا تملك صلاحية الوصول' : 'Access Denied'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', textAlign: 'center', maxWidth: '400px' }}>
          {isRTL 
            ? 'هذه الصفحة متاحة فقط للمسؤولين. يرجى تسجيل الدخول بحساب مسؤول.'
            : 'This page is only available for managers. Please log in with a manager account.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => {
              logoutFromDashboard()
              setIsAuthenticated(false)
            }}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'rgba(112, 66, 248, 0.15)',
              border: '1px solid rgba(112, 66, 248, 0.3)',
              color: '#b4a0f8',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
            }}
          >
            {isRTL ? 'تسجيل دخول بحساب آخر' : 'Login with different account'}
          </button>
          <a 
            href="/"
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.95rem',
              textDecoration: 'none',
              fontFamily: 'inherit',
            }}
          >
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.controllersPage} style={{ direction: dir }}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.controllers.title}</h1>
          <p className={styles.subtitle}>{t.controllers.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          {/* User Info */}
          {dashboardSession && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: '#94a3b8'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#00C781',
                display: 'inline-block'
              }} />
              <span style={{ color: '#fff', fontWeight: 600 }}>{dashboardSession.name}</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ color: '#0070F3', fontWeight: 600 }}>{isRTL ? 'مسؤول' : 'Manager'}</span>
            </div>
          )}
          <button 
            className={styles.languageBtn}
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          >
            {language === 'ar' ? 'EN' : 'ع'}
          </button>
          <button
            className={styles.languageBtn}
            onClick={() => {
              logoutFromDashboard()
              setIsAuthenticated(false)
            }}
            style={{ 
              background: 'rgba(255, 68, 68, 0.1)', 
              borderColor: 'rgba(255, 68, 68, 0.2)',
              color: '#ff6b6b'
            }}
          >
            {isRTL ? 'خروج' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          {isRTL ? 'نظرة عامة' : 'Overview'}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'clients' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          {t.controllers.clients.title}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'projects' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          {t.controllers.projects.title}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'finances' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('finances')}
        >
          {t.controllers.finances.title}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('users')}
        >
          {t.controllers.users.title}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'activity' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          {t.controllers.activity.title}
        </button>

      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.overview}>
            {/* Statistics Cards */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #0070F3, #00C781)' }}>
                  <UsersIcon size={28} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{stats.totalClients}</h3>
                  <p>{t.controllers.clients.total}</p>
                  <span className={styles.statChange}>
                    +{stats.activeClients} {t.controllers.clients.active}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #00C781, #0070F3)' }}>
                  <BarChartIcon size={28} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{stats.totalProjects}</h3>
                  <p>{t.controllers.projects.total}</p>
                  <span className={styles.statChange}>
                    {stats.activeProjects} {t.controllers.projects.active}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #FF8C00, #FF0080)' }}>
                  <WalletIcon size={28} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{formatCurrency(stats.totalRevenue)}</h3>
                  <p>{t.controllers.finances.totalRevenue}</p>
                  <span className={styles.statChange}>
                    {formatCurrency(stats.pendingRevenue)} {t.controllers.finances.pending}
                  </span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #9B59B6, #7042F8)' }}>
                  <TrendingUpIcon size={28} />
                </div>
                <div className={styles.statInfo}>
                  <h3>{formatCurrency(stats.netProfit)}</h3>
                  <p>{t.controllers.finances.profit}</p>
                  <span className={styles.statChange}>
                    ↑ 12.5%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{t.controllers.quickActions.title}</h2>
              <div className={styles.quickActions}>
                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>
                    <UserPlusIcon size={40} />
                  </span>
                  <span>{t.controllers.quickActions.addClient}</span>
                </button>
                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>
                    <FolderPlusIcon size={40} />
                  </span>
                  <span>{t.controllers.quickActions.createProject}</span>
                </button>
                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>
                    <FileTextIcon size={40} />
                  </span>
                  <span>{t.controllers.quickActions.sendInvoice}</span>
                </button>
                <button className={styles.actionBtn}>
                  <span className={styles.actionIcon}>
                    <SaveIcon size={40} />
                  </span>
                  <span>{t.controllers.quickActions.backupData}</span>
                </button>

              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{t.controllers.activity.recent}</h2>
              <div className={styles.activityList}>
                {activities.map(activity => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <PinIcon size={20} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>
                        <strong>{activity.user}</strong> {isRTL ? activity.action : activity.actionEn}
                      </p>
                      <p className={styles.activityDetails}>
                        {isRTL ? activity.details : activity.detailsEn}
                      </p>
                      <span className={styles.activityTime}>{formatDateTime(activity.time)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className={styles.clientsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t.controllers.clients.title}</h2>
              <div className={styles.sectionActions}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder={t.controllers.clients.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className={styles.primaryBtn}
                  onClick={() => setShowAddClientForm(!showAddClientForm)}
                >
                  {showAddClientForm ? (isRTL ? 'إلغاء' : 'Cancel') : t.controllers.clients.add}
                </button>
              </div>
            </div>

            {/* Add Client Form */}
            {showAddClientForm && (
              <div style={{
                background: 'rgba(112, 66, 248, 0.05)',
                border: '1px solid rgba(112, 66, 248, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '2rem',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#fff', fontSize: '1.2rem' }}>
                  {isRTL ? 'إضافة عميل جديد' : 'Add New Client'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {t.controllers.clients.name}
                    </label>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder={isRTL ? 'اسم العميل...' : 'Client name...'}
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      style={{ width: '100%', minWidth: 'unset' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {t.controllers.clients.email}
                    </label>
                    <input
                      type="email"
                      className={styles.searchInput}
                      placeholder={isRTL ? 'email@example.com' : 'email@example.com'}
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      dir="ltr"
                      style={{ width: '100%', minWidth: 'unset' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {t.controllers.clients.phone}
                    </label>
                    <input
                      type="tel"
                      className={styles.searchInput}
                      placeholder={isRTL ? '+966XXXXXXXXX' : '+966XXXXXXXXX'}
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      dir="ltr"
                      style={{ width: '100%', minWidth: 'unset' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    className={styles.primaryBtn}
                    onClick={() => {
                      if (newClientEmail && newClientName) {
                        const newClient: Client = {
                          id: String(Date.now()),
                          name: newClientName.trim(),
                          email: newClientEmail.trim(),
                          phone: newClientPhone.trim() || '-',
                          status: 'active',
                          projects: 0,
                          totalSpent: 0,
                          joined: new Date().toISOString().split('T')[0],
                          lastActivity: new Date().toISOString(),
                        }
                        setClients(prev => [...prev, newClient])
                        addAllowedUser({
                          email: newClientEmail.trim(),
                          name: newClientName.trim(),
                          role: 'client',
                          addedBy: 'Admin',
                          dashboardSections: ['project', 'analytics', 'financial', 'support'],
                          isActive: true,
                        })
                        setNewClientEmail('')
                        setNewClientName('')
                        setNewClientPhone('')
                        setShowAddClientForm(false)
                      }
                    }}
                    disabled={!newClientEmail || !newClientName}
                    style={{ opacity: (!newClientEmail || !newClientName) ? 0.5 : 1 }}
                  >
                    {t.controllers.dashboardAccess.save}
                  </button>
                  <button
                    className={styles.secondaryBtn}
                    onClick={() => {
                      setShowAddClientForm(false)
                      setNewClientEmail('')
                      setNewClientName('')
                      setNewClientPhone('')
                    }}
                  >
                    {t.controllers.dashboardAccess.cancel}
                  </button>
                </div>
              </div>
            )}

            {/* Existing Clients Table */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t.controllers.clients.name}</th>
                    <th>{t.controllers.clients.email}</th>
                    <th>{t.controllers.clients.phone}</th>
                    <th>{t.controllers.clients.status}</th>
                    <th>{t.controllers.clients.projects}</th>
                    <th>{t.controllers.clients.totalSpent}</th>
                    <th>{t.controllers.clients.lastActivity}</th>
                    <th>{isRTL ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(client => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>
                        <span 
                          className={styles.badge}
                          style={{ backgroundColor: getStatusColor(client.status) }}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td>{client.projects}</td>
                      <td>{formatCurrency(client.totalSpent)}</td>
                      <td>{formatDateTime(client.lastActivity)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button className={styles.iconBtn} title={t.controllers.clients.view}><EyeIcon size={18} /></button>
                          <button className={styles.iconBtn} title={t.controllers.clients.edit}><EditIcon size={18} /></button>
                          <button className={styles.iconBtn} title={t.controllers.clients.delete}><TrashIcon size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className={styles.projectsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t.controllers.projects.title}</h2>
              <button className={styles.primaryBtn} onClick={() => setShowAddProjectForm(true)}>{t.controllers.projects.add}</button>
            </div>

            {/* Add New Project Form */}
            {showAddProjectForm && (
              <div className={styles.addForm} style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '15px', color: 'var(--text-white)' }}>
                  {t.controllers.projects.add}
                </h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>{t.controllers.projects.name}</label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder={isRTL ? 'اسم المشروع...' : 'Project name...'}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>{t.controllers.projects.client}</label>
                    <select
                      value={newProjectClient}
                      onChange={(e) => setNewProjectClient(e.target.value)}
                      className={styles.formInput}
                    >
                      <option value="">{isRTL ? 'اختر عميل...' : 'Select client...'}</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.email}>{c.name} ({c.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>{t.controllers.projects.budget}</label>
                    <input
                      type="number"
                      value={newProjectBudget}
                      onChange={(e) => setNewProjectBudget(e.target.value)}
                      placeholder="0"
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>{t.controllers.projects.deadline}</label>
                    <input
                      type="date"
                      value={newProjectDeadline}
                      onChange={(e) => setNewProjectDeadline(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>{t.controllers.projects.priority}</label>
                    <select
                      value={newProjectPriority}
                      onChange={(e) => setNewProjectPriority(e.target.value as Project['priority'])}
                      className={styles.formInput}
                    >
                      <option value="low">{isRTL ? 'منخفضة' : 'Low'}</option>
                      <option value="medium">{isRTL ? 'متوسطة' : 'Medium'}</option>
                      <option value="high">{isRTL ? 'عالية' : 'High'}</option>
                      <option value="urgent">{isRTL ? 'عاجلة' : 'Urgent'}</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button className={styles.primaryBtn} onClick={addNewProject}>
                    <SaveIcon size={16} /> {t.controllers.projects.add}
                  </button>
                  <button className={styles.secondaryBtn} onClick={() => setShowAddProjectForm(false)}>
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            {/* Edit Project Modal */}
            {editingProject && (
              <div className={styles.modalOverlay} onClick={() => setEditingProject(null)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{ marginBottom: '20px', color: 'var(--text-white)' }}>
                    {t.controllers.projects.edit}: {editingProject.name}
                  </h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>{t.controllers.projects.name}</label>
                      <input
                        type="text"
                        value={editProjectName}
                        onChange={(e) => setEditProjectName(e.target.value)}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.controllers.projects.client}</label>
                      <select
                        value={editProjectClient}
                        onChange={(e) => setEditProjectClient(e.target.value)}
                        className={styles.formInput}
                      >
                        {clients.map(c => (
                          <option key={c.id} value={c.email}>{c.name} ({c.email})</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.controllers.projects.progress}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editProjectProgress}
                          onChange={(e) => setEditProjectProgress(parseInt(e.target.value))}
                          style={{ flex: 1 }}
                        />
                        <span style={{ color: 'var(--text-white)', fontWeight: 600, minWidth: '45px' }}>{editProjectProgress}%</span>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.controllers.projects.budget}</label>
                      <input
                        type="number"
                        value={editProjectBudget}
                        onChange={(e) => setEditProjectBudget(parseFloat(e.target.value) || 0)}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{isRTL ? 'المصروف' : 'Spent'}</label>
                      <input
                        type="number"
                        value={editProjectSpent}
                        onChange={(e) => setEditProjectSpent(parseFloat(e.target.value) || 0)}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{isRTL ? 'الحالة' : 'Status'}</label>
                      <select
                        value={editProjectStatus}
                        onChange={(e) => setEditProjectStatus(e.target.value as Project['status'])}
                        className={styles.formInput}
                      >
                        <option value="active">{isRTL ? 'نشط' : 'Active'}</option>
                        <option value="completed">{isRTL ? 'مكتمل' : 'Completed'}</option>
                        <option value="pending">{isRTL ? 'قيد الانتظار' : 'Pending'}</option>
                        <option value="on-hold">{isRTL ? 'متوقف' : 'On Hold'}</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.controllers.projects.deadline}</label>
                      <input
                        type="date"
                        value={editProjectDeadline}
                        onChange={(e) => setEditProjectDeadline(e.target.value)}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.controllers.projects.priority}</label>
                      <select
                        value={editProjectPriority}
                        onChange={(e) => setEditProjectPriority(e.target.value as Project['priority'])}
                        className={styles.formInput}
                      >
                        <option value="low">{isRTL ? 'منخفضة' : 'Low'}</option>
                        <option value="medium">{isRTL ? 'متوسطة' : 'Medium'}</option>
                        <option value="high">{isRTL ? 'عالية' : 'High'}</option>
                        <option value="urgent">{isRTL ? 'عاجلة' : 'Urgent'}</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.controllers.projects.team}</label>
                      <input
                        type="number"
                        min="1"
                        value={editProjectTeam}
                        onChange={(e) => setEditProjectTeam(parseInt(e.target.value) || 1)}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginTop: '20px',
                    padding: '15px 0 0',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <button className={styles.primaryBtn} onClick={saveEditedProject}>
                      <SaveIcon size={16} /> {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                    </button>
                    <button className={styles.secondaryBtn} onClick={() => setEditingProject(null)}>
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                  <p style={{ 
                    marginTop: '12px', 
                    fontSize: '0.8rem', 
                    color: 'var(--text-dim)',
                    opacity: 0.7
                  }}>
                    {isRTL 
                      ? '* التغييرات ستظهر تلقائياً في لوحة تحكم العميل (Dashboard)' 
                      : '* Changes will automatically appear in the client\'s Dashboard'}
                  </p>
                </div>
              </div>
            )}

            <div className={styles.projectsGrid}>
              {projects.map(project => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectCardHeader}>
                    <h3>{project.name}</h3>
                    <span 
                      className={styles.badge}
                      style={{ backgroundColor: getPriorityColor(project.priority) }}
                    >
                      {project.priority}
                    </span>
                  </div>
                  
                  <p className={styles.projectClient}><UserIcon size={16} /> {project.client}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px', opacity: 0.6 }}>{project.clientEmail}</p>
                  
                  <div className={styles.projectProgress}>
                    <div className={styles.progressInfo}>
                      <span>{t.controllers.projects.progress}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className={styles.projectStats}>
                    <div className={styles.projectStat}>
                      <span>{t.controllers.projects.budget}</span>
                      <strong>{formatCurrency(project.budget)}</strong>
                    </div>
                    <div className={styles.projectStat}>
                      <span>{t.controllers.projects.deadline}</span>
                      <strong>{formatDate(project.deadline)}</strong>
                    </div>
                  </div>

                  <div className={styles.projectFooter}>
                    <span className={styles.teamInfo}><UsersIcon size={16} /> {project.team} {isRTL ? 'أعضاء' : 'members'}</span>
                    <div className={styles.actionButtons}>
                      <button className={styles.iconBtn}><EyeIcon size={18} /></button>
                      <button className={styles.iconBtn} onClick={() => openEditProject(project)}><EditIcon size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finances Tab */}
        {activeTab === 'finances' && (
          <div className={styles.financesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t.controllers.finances.title}</h2>
              <div className={styles.sectionActions}>
                <button className={styles.secondaryBtn}>{t.controllers.finances.export}</button>
                <button className={styles.primaryBtn}>{t.controllers.finances.add}</button>
              </div>
            </div>

            <div className={styles.financeCards}>
              <div className={styles.financeCard}>
                <h4>{t.controllers.finances.totalRevenue}</h4>
                <p className={styles.financeAmount} style={{ color: '#00C781' }}>
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className={styles.financeCard}>
                <h4>{t.controllers.finances.expenses}</h4>
                <p className={styles.financeAmount} style={{ color: '#FF4444' }}>
                  {formatCurrency(stats.totalExpenses)}
                </p>
              </div>
              <div className={styles.financeCard}>
                <h4>{t.controllers.finances.profit}</h4>
                <p className={styles.financeAmount} style={{ color: '#0070F3' }}>
                  {formatCurrency(stats.netProfit)}
                </p>
              </div>
              <div className={styles.financeCard}>
                <h4>{t.controllers.finances.pending}</h4>
                <p className={styles.financeAmount} style={{ color: '#FF8C00' }}>
                  {formatCurrency(stats.pendingRevenue)}
                </p>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <h3 className={styles.subsectionTitle}>{t.controllers.finances.transactions}</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{isRTL ? 'النوع' : 'Type'}</th>
                    <th>{t.financial.description}</th>
                    <th>{t.financial.amount}</th>
                    <th>{t.financial.date}</th>
                    <th>{t.financial.status}</th>
                    <th>{isRTL ? 'العميل' : 'Client'}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>
                        <span 
                          className={styles.badge}
                          style={{ 
                            backgroundColor: transaction.type === 'income' ? '#00C781' : '#FF4444' 
                          }}
                        >
                          {transaction.type === 'income' ? (isRTL ? 'دخل' : 'Income') : (isRTL ? 'مصروف' : 'Expense')}
                        </span>
                      </td>
                      <td>{isRTL ? transaction.description : transaction.descriptionEn}</td>
                      <td style={{ 
                        color: transaction.type === 'income' ? '#00C781' : '#FF4444',
                        fontWeight: 'bold'
                      }}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                      <td>{formatDate(transaction.date)}</td>
                      <td>
                        <span 
                          className={styles.badge}
                          style={{ backgroundColor: getStatusColor(transaction.status) }}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td>{transaction.client || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className={styles.usersSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t.controllers.users.title}</h2>
              <button 
                className={styles.primaryBtn}
                onClick={() => setShowAddManagerForm(!showAddManagerForm)}
              >
                {showAddManagerForm ? (isRTL ? 'إلغاء' : 'Cancel') : t.controllers.users.add}
              </button>
            </div>

            {/* Add Manager Form */}
            {showAddManagerForm && (
              <div style={{
                background: 'rgba(0, 112, 243, 0.05)',
                border: '1px solid rgba(0, 112, 243, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '2rem',
                animation: 'fadeIn 0.3s ease'
              }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#fff', fontSize: '1.2rem' }}>
                  {isRTL ? 'إضافة مسؤول جديد (صلاحية Dashboard)' : 'Add New Manager (Dashboard Access)'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {t.controllers.dashboardAccess.name}
                    </label>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder={t.controllers.dashboardAccess.namePlaceholder}
                      value={newManagerName}
                      onChange={(e) => setNewManagerName(e.target.value)}
                      style={{ width: '100%', minWidth: 'unset' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {t.controllers.dashboardAccess.email}
                    </label>
                    <input
                      type="email"
                      className={styles.searchInput}
                      placeholder={t.controllers.dashboardAccess.emailPlaceholder}
                      value={newManagerEmail}
                      onChange={(e) => setNewManagerEmail(e.target.value)}
                      dir="ltr"
                      style={{ width: '100%', minWidth: 'unset' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    className={styles.primaryBtn}
                    onClick={() => {
                      if (newManagerEmail && newManagerName) {
                        addAllowedUser({
                          email: newManagerEmail.trim(),
                          name: newManagerName.trim(),
                          role: 'manager',
                          addedBy: 'Admin',
                          dashboardSections: ['project', 'analytics', 'financial', 'support'],
                          isActive: true,
                        })
                        setNewManagerEmail('')
                        setNewManagerName('')
                        setShowAddManagerForm(false)
                      }
                    }}
                    disabled={!newManagerEmail || !newManagerName}
                    style={{ opacity: (!newManagerEmail || !newManagerName) ? 0.5 : 1 }}
                  >
                    {t.controllers.dashboardAccess.save}
                  </button>
                  <button
                    className={styles.secondaryBtn}
                    onClick={() => {
                      setShowAddManagerForm(false)
                      setNewManagerEmail('')
                      setNewManagerName('')
                    }}
                  >
                    {t.controllers.dashboardAccess.cancel}
                  </button>
                </div>
              </div>
            )}

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t.controllers.clients.name}</th>
                    <th>{t.controllers.clients.email}</th>
                    <th>{t.controllers.users.role}</th>
                    <th>{t.controllers.clients.status}</th>
                    <th>{t.controllers.users.lastLogin}</th>
                    <th>{t.controllers.users.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span 
                          className={styles.badge}
                          style={{ 
                            backgroundColor: 
                              user.role === 'admin' ? '#FF4444' : 
                              user.role === 'manager' ? '#0070F3' : 
                              '#00C781' 
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={styles.badge}
                          style={{ backgroundColor: getStatusColor(user.status) }}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>{formatDateTime(user.lastLogin)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button className={styles.iconBtn}><EyeIcon size={18} /></button>
                          <button className={styles.iconBtn}><EditIcon size={18} /></button>
                          <button className={styles.iconBtn}><LockIcon size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dashboard Managers */}
            {allowedUsers.filter(u => u.role === 'manager').length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 className={styles.subsectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔐 {isRTL ? 'مسؤولين لديهم صلاحية Dashboard' : 'Managers with Dashboard Access'}
                </h3>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{t.controllers.dashboardAccess.name}</th>
                        <th>{t.controllers.dashboardAccess.email}</th>
                        <th>{t.controllers.dashboardAccess.role}</th>
                        <th>{t.controllers.dashboardAccess.status}</th>
                        <th>{t.controllers.dashboardAccess.addedAt}</th>
                        <th>{t.controllers.dashboardAccess.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allowedUsers.filter(u => u.role === 'manager').map(user => (
                        <tr key={user.email}>
                          <td style={{ fontWeight: 600 }}>{user.name}</td>
                          <td style={{ direction: 'ltr' }}>{user.email}</td>
                          <td>
                            <span 
                              className={styles.badge}
                              style={{ backgroundColor: '#0070F3' }}
                            >
                              {t.controllers.dashboardAccess.manager}
                            </span>
                          </td>
                          <td>
                            <span 
                              className={styles.badge}
                              style={{ backgroundColor: user.isActive ? '#00C781' : '#FF4444' }}
                            >
                              {user.isActive ? t.controllers.dashboardAccess.active : t.controllers.dashboardAccess.inactive}
                            </span>
                          </td>
                          <td>{formatDate(user.addedAt)}</td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.iconBtn}
                                title={user.isActive ? t.controllers.dashboardAccess.deactivate : t.controllers.dashboardAccess.activate}
                                onClick={() => updateAllowedUser(user.email, { isActive: !user.isActive })}
                                style={{ color: user.isActive ? '#FF8C00' : '#00C781' }}
                              >
                                {user.isActive ? <EyeIcon size={18} /> : <LockIcon size={18} />}
                              </button>
                              <button
                                className={styles.iconBtn}
                                title={t.controllers.dashboardAccess.remove}
                                onClick={() => {
                                  if (confirm(t.controllers.dashboardAccess.confirmRemove)) {
                                    removeAllowedUser(user.email)
                                  }
                                }}
                                style={{ color: '#FF4444' }}
                              >
                                <TrashIcon size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className={styles.activitySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t.controllers.activity.title}</h2>
              <button className={styles.secondaryBtn}>{t.controllers.activity.filter}</button>
            </div>

            <div className={styles.activityTimeline}>
              {activities.map(activity => (
                <div key={activity.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <strong>{activity.user}</strong>
                      <span className={styles.timelineTime}>{formatDateTime(activity.time)}</span>
                    </div>
                    <p className={styles.timelineAction}>{isRTL ? activity.action : activity.actionEn}</p>
                    <p className={styles.timelineDetails}>{isRTL ? activity.details : activity.detailsEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function ControllersPage() {
  return (
    <LanguageProvider>
      <ControllersContent />
    </LanguageProvider>
  )
}
