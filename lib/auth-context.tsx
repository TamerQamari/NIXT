'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ===================== Types =====================

export type UserRole = 'owner' | 'admin' | 'user' | 'guest';

export interface SubscriptionInfo {
    hasActiveSubscription: boolean;
    planName: string | null;
    status: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    billingInterval: string | null;
    amount: number | null;
    currency: string | null;
    stripeSubscriptionId: string | null;
}

export interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
    auth_provider: 'local' | 'google';
    created_at?: string;
    updated_at?: string;
}

export interface AuthUser extends User {
    role: UserRole;
    permissions: string[];
    subscriptions: SubscriptionInfo[];
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isOwner: boolean;
    isAdmin: boolean;
    hasActiveSubscription: boolean;
    subscriptions: SubscriptionInfo[];
    hasPermission: (permission: string) => boolean;
    hasSubscription: (planName: string) => boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
}

interface TokenValidationResponse {
    message: string;
    userID: string;
    role?: UserRole;
    permissions?: string[];
    subscriptions?: SubscriptionInfo[];
}

// ===================== Context =====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===================== API Base URL =====================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';

// ===================== Provider =====================

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load token from localStorage on app start
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            
            if (storedToken) {
                setToken(storedToken);
                await fetchUserData(storedToken);
            } else {
                setIsLoading(false);
            }
        };
        
        initAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch role, permissions, and subscriptions
    const fetchRoleAndPermissions = async (authToken: string): Promise<{ role: UserRole; permissions: string[]; subscriptions: SubscriptionInfo[] }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/validate?token=${authToken}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const data: TokenValidationResponse = await response.json();
                return {
                    role: data.role || 'user',
                    permissions: data.permissions || [],
                    subscriptions: data.subscriptions || []
                };
            }
            return { role: 'user', permissions: [], subscriptions: [] };
        } catch {
            return { role: 'user', permissions: [], subscriptions: [] };
        }
    };

    // Fetch user data
    const fetchUserData = async (authToken: string): Promise<boolean> => {
        try {
            const [userResponse, roleData] = await Promise.all([
                fetch(`${API_BASE_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }),
                fetchRoleAndPermissions(authToken)
            ]);

            if (userResponse.ok) {
                const data = await userResponse.json();
                setUser({
                    ...data.user,
                    role: roleData.role,
                    permissions: roleData.permissions,
                    subscriptions: roleData.subscriptions
                });
                return true;
            } else if (userResponse.status === 401) {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const refreshed = await refreshAccessToken(refreshToken);
                    return refreshed;
                } else {
                    logout();
                    return false;
                }
            } else if (userResponse.status === 404) {
                logout();
                return false;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh token
    const refreshAccessToken = async (refreshToken: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                localStorage.setItem('token', data.token);
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
                const [userResponse, roleData] = await Promise.all([
                    fetch(`${API_BASE_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${data.token}`
                        }
                    }),
                    fetchRoleAndPermissions(data.token)
                ]);
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser({
                        ...userData.user,
                        role: roleData.role,
                        permissions: roleData.permissions,
                        subscriptions: roleData.subscriptions
                    });
                    return true;
                }
                return false;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
            return false;
        }
    };

    // Login with email and password
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                
                const roleData = await fetchRoleAndPermissions(data.token);
                
                setToken(data.token);
                setUser({
                    ...data.user,
                    role: roleData.role,
                    permissions: roleData.permissions,
                    subscriptions: roleData.subscriptions
                });
                
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }
        } catch(error) {
            console.error('Login error:', error);
            return { success: false, error: 'Server connection error' + (error instanceof Error ? `: ${error.message}` : '') };
        }
    };

    // Register
    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                setUser({
                    ...result.user,
                    role: 'user' as UserRole,
                    permissions: [],
                    subscriptions: []
                });
                setToken(result.token);
                localStorage.setItem('token', result.token);
                localStorage.setItem('refreshToken', result.refreshToken);
                return { success: true };
            } else {
                return { success: false, error: result.error || 'Registration failed' };
            }
        } catch {
            return { success: false, error: 'Server connection error' };
        }
    };

    // Login with Google
    const loginWithGoogle = async (credential: string): Promise<{ success: boolean; error?: string; user?: User }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credential })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
                
                const roleData = await fetchRoleAndPermissions(data.token);
                
                setToken(data.token);
                setUser({
                    ...data.user,
                    role: roleData.role,
                    permissions: roleData.permissions,
                    subscriptions: roleData.subscriptions
                });
                
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error || 'Google login failed' };
            }
        } catch (error) {
            console.error('Google login error:', error);
            return { success: false, error: 'Server connection error' };
        }
    };

    // Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    // Refresh user data
    const refreshUser = async () => {
        if (token) {
            await fetchUserData(token);
        }
    };

    // Check permissions
    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        if (user.role === 'owner') return true;
        return user.permissions.includes(permission);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user,
                isOwner: user?.role === 'owner',
                isAdmin: user?.role === 'admin' || user?.role === 'owner',
                hasActiveSubscription: (user?.subscriptions?.length ?? 0) > 0 && user?.subscriptions?.some(sub => sub.hasActiveSubscription) || false,
                subscriptions: user?.subscriptions || [],
                hasSubscription: (planName: string) => user?.subscriptions?.some(sub => sub.hasActiveSubscription && sub.planName === planName) || false,
                hasPermission,
                login,
                register,
                loginWithGoogle,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ===================== Hook =====================

export function useGlobalAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useGlobalAuth must be used within an AuthProvider');
    }
    return context;
}
