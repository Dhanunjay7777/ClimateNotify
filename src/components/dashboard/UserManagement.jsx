import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = ({ darkMode }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  // Add User Form State
  const [newUserData, setNewUserData] = useState({
    fullname: '',
    email: '',
    password: '',
    role: 'user',
    approvedStatus: 'true',
    agreeTerms: true
  });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/consumers', {
        headers: {
          'Authorization': `Bearer ${user?.id || 'admin-token'}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (response.status === 401) {
        setError('Unauthorized access. Admin privileges required.');
      } else if (data.status === 'success') {
        // Add avatar initials for each user
        const usersWithAvatars = data.data.map(user => ({
          ...user,
          avatar: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
          alerts: 0, // Default values since we don't track these yet
          reports: 0
        }));
        setUsers(usersWithAvatars);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Update user status/role
  const updateUser = async (userId, updates) => {
    try {
      const response = await fetch(`http://localhost:5000/api/consumers/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.id || 'admin-token'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      
      if (response.status === 401) {
        setError('Unauthorized access. Admin privileges required.');
        return false;
      } else if (data.status === 'success') {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, ...data.data, avatar: user.avatar, alerts: user.alerts, reports: user.reports }
            : user
        ));
        return true;
      } else {
        setError(data.message || 'Failed to update user');
        return false;
      }
    } catch (err) {
      setError('Unable to connect to server');
      return false;
    }
  };

  // Handle add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id || 'admin-token'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData)
      });

      // Check for 409 error first (before parsing JSON)
      if (response.status === 409) {
        const data = await response.json();
        setAddUserError(data.message || 'User already exists with this email or consumer ID');
        return;
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Reset form
        setNewUserData({
          fullname: '',
          email: '',
          password: '',
          role: 'user',
          approvedStatus: 'true',
          agreeTerms: true
        });
        setShowAddUser(false);
        
        // Refresh users list
        await fetchUsers();
      } else {
        setAddUserError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setAddUserError('Unable to connect to server');
    } finally {
      setAddUserLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUserId(editingUserId === user.id ? null : user.id);
  };

  // Handle approve user
  const handleApproveUser = async (user) => {
    const success = await updateUser(user.id, { approvedStatus: 'true' });
    if (success) {
      setError(null);
    }
  };

  // Handle reject/suspend user
  const handleRejectUser = async (user) => {
    const success = await updateUser(user.id, { approvedStatus: 'false' });
    if (success) {
      setError(null);
    }
  };

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'analyst', label: 'Climate Analyst' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'operator', label: 'System Operator' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Approved' },
    { value: 'pending', label: 'Pending Approval' }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'analyst': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'researcher': return 'bg-green-100 text-green-800 border-green-200';
      case 'operator': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastActive = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    inactive: users.filter(u => u.status === 'inactive').length
  };

  // Check admin access
  if (!user || (user.role !== 'admin' && user.accessLevel !== 'admin')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-center p-8 rounded-2xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Access Denied
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            You need administrator privileges to access User Management.
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Current role: {user?.role || user?.accessLevel || 'Unknown'}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {showAddUser && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Add New User
              </h3>
              <button 
                onClick={() => {
                  setShowAddUser(false);
                  setAddUserError(null);
                  setNewUserData({
                    fullname: '',
                    email: '',
                    password: '',
                    role: 'user',
                    approvedStatus: 'true',
                    agreeTerms: true
                  });
                }}
                className={`text-gray-400 hover:text-gray-600 ${darkMode ? 'hover:text-gray-200' : ''}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Add User Error Alert */}
            {addUserError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm mb-4">
                {addUserError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUserData.fullname}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, fullname: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Password
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter password (min 6 characters)"
                  minLength={6}
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Role
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                  <option value="analyst">Climate Analyst</option>
                  <option value="researcher">Researcher</option>
                  <option value="operator">System Operator</option>
                </select>
              </div>

              {/* Approval Status */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Approval Status
                </label>
                <select
                  value={newUserData.approvedStatus}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, approvedStatus: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="true">Approved</option>
                  <option value="false">Pending Approval</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUser(false);
                    setAddUserError(null);
                    setNewUserData({
                      fullname: '',
                      email: '',
                      password: '',
                      role: 'user',
                      approvedStatus: 'true',
                      agreeTerms: true
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={addUserLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={addUserLoading}
                >
                  {addUserLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Management</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage team members and access controls</p>
        </div>
        <button 
          onClick={() => setShowAddUser(true)}
          className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-2xl p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.total}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
        </div>

        <div className={`rounded-2xl p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-green-50 border-green-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.active}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</p>
        </div>

        <div className={`rounded-2xl p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-yellow-50 border-yellow-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.pending}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending Approval</p>
        </div>

        <div className={`rounded-2xl p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userStats.inactive}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Inactive Users</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button className={`px-4 py-2 transition-colors ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
              Export
            </button>
            <button className={`px-4 py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <tr>
                <th className={`text-left py-4 px-6 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User</th>
                <th className={`text-left py-4 px-6 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Role</th>
                <th className={`text-left py-4 px-6 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Status</th>
                <th className={`text-left py-4 px-6 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activity</th>
                <th className={`text-left py-4 px-6 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Last Active</th>
                <th className={`text-left py-4 px-6 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'divide-gray-700' : 'divide-gray-100'} divide-y`}>
              {filteredUsers.map(user => (
                <React.Fragment key={user.id}>
                  {/* Regular User Row */}
                  <tr className={`transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.avatar}
                        </div>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`flex items-center space-x-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span>{user.alerts} alerts</span>
                        <span>{user.reports} reports</span>
                      </div>
                    </td>
                    <td className={`py-4 px-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatLastActive(user.lastActive)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {/* Edit Button */}
                        <button 
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                          className={`p-1 transition-colors ${
                            editingUserId === user.id 
                              ? 'text-blue-600' 
                              : darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'
                          }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* Approve/Reject Buttons */}
                        {user.status === 'pending' ? (
                          <button 
                            onClick={() => handleApproveUser(user)}
                            title="Approve User"
                            className={`p-1 transition-colors ${
                              darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-400 hover:text-green-600'
                            }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRejectUser(user)}
                            title="Suspend User"
                            className={`p-1 transition-colors ${
                              darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-400 hover:text-yellow-600'
                            }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            </svg>
                          </button>
                        )}

                        {/* View Details Button */}
                        <button 
                          title="View Details"
                          className={`p-1 transition-colors ${
                            darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-400 hover:text-purple-600'
                          }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Inline Edit Row */}
                  {editingUserId === user.id && (
                    <tr className={`${
                      darkMode ? 'bg-gray-700/50' : 'bg-blue-50'
                    } border-l-4 border-blue-500`}>
                      <td colSpan="6" className="px-6 py-4">
                        <InlineEditForm 
                          user={user}
                          onSave={async (updates) => {
                            const success = await updateUser(user.id, updates);
                            if (success) {
                              setEditingUserId(null);
                              setError(null);
                            }
                          }}
                          onCancel={() => setEditingUserId(null)}
                          darkMode={darkMode}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex items-center space-x-2">
          <button className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            Previous
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            1
          </button>
          <button className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            2
          </button>
          <button className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            Next
          </button>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className={`rounded-2xl p-6 border ${
        darkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-800 border-gray-700'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Bulk Invite</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Send multiple invitations</p>
            </div>
          </button>
          
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Permissions</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage user access</p>
            </div>
          </button>
          
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activity Report</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>User engagement data</p>
            </div>
          </button>
        </div>
      </div>


    </div>
  );
};

// Inline Edit Form Component
const InlineEditForm = ({ user, onSave, onCancel, darkMode }) => {
  const [formData, setFormData] = useState({
    accessLevel: user.role || 'user',
    approvedStatus: user.status === 'active' ? 'true' : 'false'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Edit User: {user.name}
        </h3>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User Info */}
        <div className="md:col-span-1">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border`}>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
          </div>
        </div>

        {/* Access Level */}
        <div className="md:col-span-1">
          <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Access Level
          </label>
          <select
            value={formData.accessLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value }))}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="user">User</option>
            <option value="admin">Administrator</option>
            <option value="analyst">Climate Analyst</option>
            <option value="researcher">Researcher</option>
            <option value="operator">System Operator</option>
          </select>
        </div>

        {/* Approval Status */}
        <div className="md:col-span-1">
          <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Approval Status
          </label>
          <div className="flex space-x-2">
            <select
              value={formData.approvedStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, approvedStatus: e.target.value }))}
              className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
            
            {/* Action Buttons */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserManagement;