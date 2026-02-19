'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGlobalAuth } from '@/lib/auth-context';

interface Subscription {
    id: string;
    user_id: string;
    stripe_subscription_id?: string;
    stripe_customer_id?: string;
    plan_name: string;
    status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid' | 'paused';
    billing_interval: 'day' | 'week' | 'month' | 'year';
    amount: number;
    currency?: string;
    current_period_start?: string;
    current_period_end?: string;
    canceled_at?: string;
    created_at?: string;
}

interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
    auth_provider: 'local' | 'google';
    email_verified?: boolean;
    created_at?: string;
    updated_at?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';

export default function UsersPage() {
    const router = useRouter();
    const { token, isAuthenticated, isLoading: authLoading, isOwner } = useGlobalAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    
    // Subscription states
    const [userSubscriptions, setUserSubscriptions] = useState<Record<string, Subscription[]>>({});
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [loadingSubscription, setLoadingSubscription] = useState<string | null>(null);
    
    // Pagination states
    const [totalCount, setTotalCount] = useState(0);
    const [nextOffset, setNextOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProvider, setFilterProvider] = useState<'all' | 'local' | 'google'>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Check authentication
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch users
    const fetchUsers = useCallback(async (offset: number = 0, append: boolean = false, search?: string, authProvider?: string) => {
        if (!token) return;

        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }
        setError('');

        try {
            const params = new URLSearchParams();
            params.append('limit', LIMIT.toString());
            params.append('offset', offset.toString());
            if (search) params.append('search', search);
            if (authProvider && authProvider !== 'all') params.append('auth_provider', authProvider);

            const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const newUsers = data.data || [];
                
                if (append) {
                    setUsers(prev => [...prev, ...newUsers]);
                } else {
                    setUsers(newUsers);
                }
                
                setTotalCount(data.count || 0);
                setNextOffset(data.nextOffset || 0);
                setHasMore(data.left > 0);
                setHasAccess(true);
            } else if (response.status === 401 || response.status === 403) {
                setHasAccess(false);
                router.push('/account');
                return;
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to fetch users');
            }
        } catch {
            setError('Error connecting to server');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [token, router]);

    // Load more
    const loadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchUsers(nextOffset, true, searchTerm, filterProvider);
        }
    };

    // Search
    const handleSearch = () => {
        setUsers([]);
        fetchUsers(0, false, searchTerm, filterProvider);
    };

    // When filter changes
    useEffect(() => {
        if (token && hasAccess !== false) {
            setUsers([]);
            fetchUsers(0, false, searchTerm, filterProvider);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterProvider]);

    // Initial load
    useEffect(() => {
        if (token) {
            fetchUsers(0, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Fetch user subscriptions
    const fetchUserSubscriptions = async (userId: string) => {
        if (!token) return;
        
        setLoadingSubscription(userId);
        try {
            const response = await fetch(`${API_BASE_URL}/subscriptions/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const subscriptions = data.data || [];
                setUserSubscriptions(prev => ({
                    ...prev,
                    [userId]: subscriptions
                }));
            }
        } catch {
            console.error('Error fetching subscriptions');
        } finally {
            setLoadingSubscription(null);
        }
    };

    // Open subscription modal
    const openSubscriptionModal = async (user: User) => {
        setSelectedUser(user);
        setShowSubscriptionModal(true);
        if (!userSubscriptions[user.id]) {
            await fetchUserSubscriptions(user.id);
        }
    };

    // Format subscription status
    const getSubscriptionStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; color: string }> = {
            active: { label: 'Active', color: 'bg-green-500/20 text-green-400' },
            trialing: { label: 'Trial', color: 'bg-blue-500/20 text-blue-400' },
            canceled: { label: 'Canceled', color: 'bg-red-500/20 text-red-400' },
            past_due: { label: 'Past Due', color: 'bg-yellow-500/20 text-yellow-400' },
            unpaid: { label: 'Unpaid', color: 'bg-orange-500/20 text-orange-400' },
            incomplete: { label: 'Incomplete', color: 'bg-gray-500/20 text-gray-400' },
            incomplete_expired: { label: 'Expired', color: 'bg-gray-500/20 text-gray-400' },
            paused: { label: 'Paused', color: 'bg-purple-500/20 text-purple-400' }
        };
        const config = statusConfig[status] || { label: status, color: 'bg-gray-500/20 text-gray-400' };
        return (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    };

    // Format billing interval
    const getBillingInterval = (interval: string) => {
        const intervals: Record<string, string> = {
            day: 'Daily',
            week: 'Weekly',
            month: 'Monthly',
            year: 'Yearly'
        };
        return intervals[interval] || interval;
    };

    // Format currency
    const formatAmount = (amount: number, currency: string = 'usd') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount / 100);
    };

    // Cancel subscription
    const cancelSubscription = async (subscriptionId: string) => {
        if (!token || !selectedUser) return;
        if (!confirm('Do you want to cancel the subscription immediately?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                await fetchUserSubscriptions(selectedUser.id);
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to cancel subscription');
            }
        } catch {
            alert('Error connecting to server');
        }
    };

    if (authLoading || hasAccess === null) {
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
                            ← Back to Account
                        </Link>
                        <h1 className="text-3xl font-bold text-white mt-2">User Management</h1>
                        <p className="text-gray-400 mt-1">View and manage all registered users</p>
                    </div>
                    <div className="text-left">
                        <span className="text-sm text-gray-400">Total Users</span>
                        <p className="text-2xl font-bold text-white">{totalCount}</p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 mb-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by name or email..."
                                className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                dir="ltr"
                            />
                            <button
                                onClick={handleSearch}
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
                                    <label className="block text-sm text-gray-400 mb-2">Authentication Type</label>
                                    <select
                                        value={filterProvider}
                                        onChange={(e) => setFilterProvider(e.target.value as 'all' | 'local' | 'google')}
                                        className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All</option>
                                        <option value="local">Local Account</option>
                                        <option value="google">Google Account</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
                        {error}
                    </div>
                )}

                {/* Users List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-lg">No users found</p>
                        {searchTerm && <p className="text-sm mt-2">Try searching with different keywords</p>}
                    </div>
                ) : (
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-700/50">
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Account Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Subscriptions</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Registration Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {u.avatar_url ? (
                                                        <img src={u.avatar_url} alt={u.display_name || u.email} className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                            {u.display_name?.charAt(0) || u.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-white font-medium">
                                                            {u.display_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'User'}
                                                        </p>
                                                        <p className="text-gray-400 text-xs font-mono" dir="ltr">{u.id.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-300" dir="ltr">{u.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                                    u.auth_provider === 'google' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                                }`}>
                                                    {u.auth_provider === 'google' ? 'Google' : 'Local'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => openSubscriptionModal(u)}
                                                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                                                >
                                                    {loadingSubscription === u.id ? (
                                                        <div className="animate-spin rounded-full h-3 w-3 border-t border-b border-blue-400 inline-block"></div>
                                                    ) : 'View'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {formatDate(u.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Load More */}
                {hasMore && !isLoading && users.length > 0 && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                            {isLoadingMore ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                    Loading...
                                </div>
                            ) : 'Load More'}
                        </button>
                    </div>
                )}

                {/* Results Count */}
                {!isLoading && users.length > 0 && (
                    <div className="mt-4 text-sm text-gray-400 text-center">
                        Showing {users.length} of {totalCount} users
                    </div>
                )}
            </div>

            {/* Subscription Modal */}
            {showSubscriptionModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-gray-700 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                Subscriptions - {selectedUser.display_name || selectedUser.email}
                            </h2>
                            <button
                                onClick={() => { setShowSubscriptionModal(false); setSelectedUser(null); }}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {loadingSubscription === selectedUser.id ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (userSubscriptions[selectedUser.id] || []).length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p>No subscriptions found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(userSubscriptions[selectedUser.id] || []).map((sub) => (
                                    <div key={sub.id} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-white font-medium">{sub.plan_name}</h3>
                                            {getSubscriptionStatusBadge(sub.status)}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-gray-400">Amount:</span>
                                                <span className="text-white ml-2">{formatAmount(sub.amount, sub.currency)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Interval:</span>
                                                <span className="text-white ml-2">{getBillingInterval(sub.billing_interval)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Period End:</span>
                                                <span className="text-white ml-2">{formatDate(sub.current_period_end)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Created:</span>
                                                <span className="text-white ml-2">{formatDate(sub.created_at)}</span>
                                            </div>
                                        </div>
                                        {isOwner && (sub.status === 'active' || sub.status === 'trialing') && (
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => cancelSubscription(sub.id)}
                                                    className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
