'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGlobalAuth } from '@/lib/auth-context';

interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
    auth_provider: 'local' | 'google';
}

interface ProjectAdmin {
    id: string;
    user_id: string;
    permissions: string[];
    created_at?: string;
    updated_at?: string;
    user?: User;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';

// Available permissions list
const AVAILABLE_PERMISSIONS = [
    { key: 'view_users', label: 'View Users', description: 'Allow viewing user list' },
    { key: 'view_cars', label: 'View Cars', description: 'Allow viewing car list' },
    { key: 'create_cars', label: 'Add Cars', description: 'Allow adding new cars' },
    { key: 'update_cars', label: 'Edit Cars', description: 'Allow editing car data' },
    { key: 'delete_cars', label: 'Delete Cars', description: 'Allow deleting cars' }
];

export default function AdminsPage() {
    const router = useRouter();
    const { token, isAuthenticated, isLoading: authLoading, isOwner } = useGlobalAuth();

    const [admins, setAdmins] = useState<ProjectAdmin[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredAdmins, setFilteredAdmins] = useState<ProjectAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPermission, setFilterPermission] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<ProjectAdmin | null>(null);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [searchUserTerm, setSearchUserTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Check permissions - must be owner only
    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }
            if (!isOwner) {
                router.push('/account');
            }
        }
    }, [authLoading, isAuthenticated, isOwner, router]);

    // Fetch admins
    const fetchAdmins = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/project-admins`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const adminsData = data.data || [];
                
                // Fetch user data for each admin
                const adminsWithUsers = await Promise.all(
                    adminsData.map(async (admin: ProjectAdmin) => {
                        try {
                            const userResponse = await fetch(`${API_BASE_URL}/users/${admin.user_id}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            if (userResponse.ok) {
                                const userData = await userResponse.json();
                                return { ...admin, user: userData.data };
                            }
                        } catch {
                            // Ignore error
                        }
                        return admin;
                    })
                );
                
                setAdmins(adminsWithUsers);
            } else if (response.status === 403) {
                setError('You do not have permission to access this page');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to fetch admins');
            }
        } catch {
            setError('Error connecting to server');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    // Fetch users (for adding) - with limit and search
    const fetchUsers = useCallback(async (search?: string) => {
        if (!token) return;

        setIsLoadingUsers(true);
        try {
            const params = new URLSearchParams();
            params.append('limit', '10');
            if (search) params.append('search', search);
            
            const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.data || []);
            }
        } catch {
            // Ignore error
        } finally {
            setIsLoadingUsers(false);
        }
    }, [token]);

    useEffect(() => {
        if (token && isOwner) {
            fetchAdmins();
            fetchUsers();
        }
    }, [token, isOwner, fetchAdmins, fetchUsers]);

    // Search for users when typing
    const handleSearchUsers = () => {
        fetchUsers(searchUserTerm);
    };

    // Filter admins
    useEffect(() => {
        let result = [...admins];

        // Search
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(admin =>
                admin.user?.email?.toLowerCase().includes(search) ||
                admin.user?.display_name?.toLowerCase().includes(search) ||
                admin.user?.first_name?.toLowerCase().includes(search) ||
                admin.user?.last_name?.toLowerCase().includes(search) ||
                admin.user_id.toLowerCase().includes(search)
            );
        }

        // Filter by permission
        if (filterPermission !== 'all') {
            result = result.filter(admin => admin.permissions.includes(filterPermission));
        }

        setFilteredAdmins(result);
    }, [admins, searchTerm, filterPermission]);

    // Add new admin
    const handleAddAdmin = async () => {
        if (!selectedUserId || !token) return;

        // Check if user is already an admin
        if (admins.some(admin => admin.user_id === selectedUserId)) {
            setError('This user is already an admin');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/project-admins`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: selectedUserId,
                    permissions: []
                })
            });

            if (response.ok) {
                setSuccessMessage('Admin added successfully');
                setShowAddModal(false);
                setSelectedUserId('');
                setSearchUserTerm('');
                fetchAdmins();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to add admin');
            }
        } catch {
            setError('Error connecting to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete admin
    const handleDeleteAdmin = async (adminId: string) => {
        if (!token || !confirm('Are you sure you want to delete this admin?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/project-admins/${adminId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setSuccessMessage('Admin deleted successfully');
                fetchAdmins();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to delete admin');
            }
        } catch {
            setError('Error connecting to server');
        }
    };

    // Update admin permissions
    const handleUpdatePermissions = async (permissions: string[]) => {
        if (!token || !selectedAdmin) return;

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/project-admins/${selectedAdmin.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ permissions })
            });

            if (response.ok) {
                setSuccessMessage('Permissions updated successfully');
                setShowPermissionsModal(false);
                setSelectedAdmin(null);
                fetchAdmins();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to update permissions');
            }
        } catch {
            setError('Error connecting to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter users for adding (exclude current admins)
    const availableUsers = users.filter(u =>
        !admins.some(admin => admin.user_id === u.id)
    );

    if (authLoading || !isOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/account" className="text-gray-400 hover:text-white transition-colors text-sm">
                            &larr; Back to Account
                        </Link>
                        <h1 className="text-3xl font-bold text-white mt-2">Admin Management</h1>
                        <p className="text-gray-400 mt-1">Add and manage project admins and their permissions</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Admin
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
                        {error}
                        <button onClick={() => setError('')} className="mr-4 underline">Close</button>
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 mb-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or email..."
                                className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                dir="ltr"
                            />
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </button>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Filter by Permission</label>
                                    <select
                                        value={filterPermission}
                                        onChange={(e) => setFilterPermission(e.target.value)}
                                        className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Permissions</option>
                                        {AVAILABLE_PERMISSIONS.map(perm => (
                                            <option key={perm.key} value={perm.key}>{perm.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Admins List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredAdmins.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-lg">No admins found</p>
                        <p className="text-sm mt-2">Click &quot;Add Admin&quot; to add a new admin</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredAdmins.map((admin) => (
                            <div key={admin.id} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {admin.user?.avatar_url ? (
                                            <img
                                                src={admin.user.avatar_url}
                                                alt={admin.user.display_name || admin.user.email}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold border-2 border-purple-500">
                                                {admin.user?.display_name?.charAt(0) || admin.user?.email?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {admin.user?.display_name || `${admin.user?.first_name || ''} ${admin.user?.last_name || ''}`.trim() || 'Admin'}
                                            </h3>
                                            <p className="text-gray-400 text-sm" dir="ltr">{admin.user?.email || admin.user_id}</p>
                                            <p className="text-gray-500 text-xs mt-1">Added on: {formatDate(admin.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Permissions Badge */}
                                        <div className="flex flex-wrap gap-2 max-w-md">
                                            {admin.permissions.length === 0 ? (
                                                <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full">No permissions</span>
                                            ) : (
                                                admin.permissions.map(perm => {
                                                    const permInfo = AVAILABLE_PERMISSIONS.find(p => p.key === perm);
                                                    return (
                                                        <span key={perm} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                                                            {permInfo?.label || perm}
                                                        </span>
                                                    );
                                                })
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedAdmin(admin);
                                                    setShowPermissionsModal(true);
                                                }}
                                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                title="Edit Permissions"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                title="Delete Admin"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {!isLoading && filteredAdmins.length > 0 && (
                    <div className="mt-4 text-sm text-gray-400 text-center">
                        Showing {filteredAdmins.length} of {admins.length} admins
                    </div>
                )}
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Add New Admin</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedUserId('');
                                    setSearchUserTerm('');
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Search for User</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchUserTerm}
                                        onChange={(e) => setSearchUserTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                                        placeholder="Search by name or email..."
                                        className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        dir="ltr"
                                    />
                                    <button
                                        onClick={handleSearchUsers}
                                        disabled={isLoadingUsers}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {isLoadingUsers ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        )}
                                        Search
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Select User</label>
                                <div className="max-h-60 overflow-y-auto space-y-2 bg-gray-700/30 rounded-lg p-2">
                                    {isLoadingUsers ? (
                                        <div className="flex items-center justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : availableUsers.length === 0 ? (
                                        <p className="text-gray-400 text-center py-4">
                                            {searchUserTerm ? 'No matching users found - try different keywords' : 'No available users'}
                                        </p>
                                    ) : (
                                        availableUsers.map(u => (
                                            <button
                                                key={u.id}
                                                onClick={() => setSelectedUserId(u.id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedUserId === u.id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                                    }`}
                                            >
                                                {u.avatar_url ? (
                                                    <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {u.display_name?.charAt(0) || u.email?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="text-left flex-1">
                                                    <p className="font-medium">{u.display_name || u.email}</p>
                                                    <p className="text-sm opacity-70" dir="ltr">{u.email}</p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAddAdmin}
                                disabled={!selectedUserId || isSubmitting}
                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                {isSubmitting ? 'Adding...' : 'Add'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedUserId('');
                                    setSearchUserTerm('');
                                }}
                                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Permissions Modal */}
            {showPermissionsModal && selectedAdmin && (
                <PermissionsModal
                    admin={selectedAdmin}
                    onClose={() => {
                        setShowPermissionsModal(false);
                        setSelectedAdmin(null);
                    }}
                    onSave={handleUpdatePermissions}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}

// Permissions Modal Component
function PermissionsModal({
    admin,
    onClose,
    onSave,
    isSubmitting
}: {
    admin: ProjectAdmin;
    onClose: () => void;
    onSave: (permissions: string[]) => void;
    isSubmitting: boolean;
}) {
    const [permissions, setPermissions] = useState<string[]>(admin.permissions || []);

    const togglePermission = (key: string) => {
        setPermissions(prev =>
            prev.includes(key)
                ? prev.filter(p => p !== key)
                : [...prev, key]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Manage Permissions</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-400 text-sm">
                        Admin: <span className="text-white">{admin.user?.display_name || admin.user?.email || admin.user_id}</span>
                    </p>
                </div>

                <div className="space-y-3">
                    {AVAILABLE_PERMISSIONS.map(perm => (
                        <label
                            key={perm.key}
                            className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${permissions.includes(perm.key)
                                    ? 'bg-blue-600/20 border border-blue-500/50'
                                    : 'bg-gray-700/50 border border-gray-600 hover:border-gray-500'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={permissions.includes(perm.key)}
                                onChange={() => togglePermission(perm.key)}
                                className="w-5 h-5 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 bg-gray-700"
                            />
                            <div>
                                <p className="text-white font-medium">{perm.label}</p>
                                <p className="text-gray-400 text-sm">{perm.description}</p>
                            </div>
                        </label>
                    ))}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => onSave(permissions)}
                        disabled={isSubmitting}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
