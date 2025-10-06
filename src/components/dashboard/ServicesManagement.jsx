import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ServicesManagement = ({ darkMode }) => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Check if user has admin access - block everything if not admin
  if (!user || user.accessLevel !== 'admin') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-sm rounded-2xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-8`}>
            <div className="text-center">
              {/* Animated Lock Icon */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl rotate-6 opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-5 shadow-lg">
                  <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                Access Restricted
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 leading-relaxed`}>
                You don't have permission to access this feature. Administrator privileges are required to manage services.
              </p>
              
              <div className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium ${
                darkMode 
                  ? 'bg-gradient-to-r from-red-900/30 to-pink-900/30 text-red-300 border border-red-700/50' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Contact your administrator to request access
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getAuthToken = () => {
    return user?.consumerID || 'admin-token';
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Double check admin access before making API calls
      if (!user || user.accessLevel !== 'admin') {
        throw new Error('Unauthorized access. Admin privileges required.');
      }
      
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const apiURL = `${baseURL}/api/admin/render/services?limit=20`;
      
      const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const htmlText = await response.text();
        throw new Error(`Server returned HTML instead of JSON`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Perform service actions (start, stop, restart, etc.)
  const performServiceAction = async (serviceId, action) => {
    try {
      // Double check admin access before performing actions
      if (!user || user.accessLevel !== 'admin') {
        throw new Error('Unauthorized access. Admin privileges required.');
      }
      
      setActionLoading(prev => ({ ...prev, [`${serviceId}_${action}`]: true }));
      
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseURL}/api/admin/render/services/${serviceId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} service`);
      }

      const result = await response.json();
      
      // Refresh services list
      await fetchServices();
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [`${serviceId}_${action}`]: false }));
    }
  };



  useEffect(() => {
    // Only fetch services if user has admin access
    if (user && user.accessLevel === 'admin') {
      fetchServices();
    }
  }, [user?.accessLevel]);

  // Additional security check - monitor user access level changes
  useEffect(() => {
    if (user && user.accessLevel !== 'admin') {
      setError('Access denied. Administrator privileges are required to view this content.');
      setServices([]);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className={`mb-8 ${darkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-sm rounded-2xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl opacity-20 blur-lg"></div>
              <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-600 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a5 5 0 01-5-5 5 5 0 015-5h14a5 5 0 015 5 5 5 0 01-5 5M5 12a5 5 0 00-5 5 5 5 0 005 5h14a5 5 0 005-5 5 5 0 00-5-5" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className={`text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent`}>
                Render Services Management
              </h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Manage and monitor your Render.com services in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 ${darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-300'} border-2 rounded-2xl p-5 shadow-lg animate-shake`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`${darkMode ? 'bg-red-900/40' : 'bg-red-100'} p-3 rounded-xl`}>
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Error Occurred</h3>
                <pre className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-red-300' : 'text-red-600'} font-mono`}>{error}</pre>
              </div>
              <button 
                onClick={() => setError('')}
                className={`flex-shrink-0 ${darkMode ? 'bg-red-900/40 hover:bg-red-900/60 text-red-400' : 'bg-red-200 hover:bg-red-300 text-red-700'} p-2 rounded-lg transition-colors`}
                title="Dismiss error"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats and Refresh Bar */}
        <div className={`mb-6 flex flex-wrap gap-4 justify-between items-center ${darkMode ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-sm rounded-2xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-5`}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`${darkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'} p-3 rounded-xl`}>
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a5 5 0 01-5-5 5 5 0 015-5h14a5 5 0 015 5 5 5 0 01-5 5M5 12a5 5 0 00-5 5 5 5 0 005 5h14a5 5 0 005-5 5 5 0 00-5-5" />
                </svg>
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{services.length}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Services</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`${darkMode ? 'bg-green-900/40' : 'bg-green-100'} p-3 rounded-xl`}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {services.filter(s => s.status === 'running').length}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Running</p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchServices}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Services
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`group relative overflow-hidden border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${
                darkMode 
                  ? 'border-gray-700 bg-gradient-to-br from-gray-800 to-gray-800/50 hover:border-emerald-500/50' 
                  : 'border-gray-200 bg-white hover:border-emerald-400/50'
              }`}
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Service Icon */}
                    <div className="relative">
                      <div className={`absolute inset-0 ${
                        service.status === 'running' 
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      } rounded-xl opacity-20 blur-lg`}></div>
                      <div className={`relative p-3 rounded-xl ${
                        service.status === 'running' 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50' 
                          : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <svg className={`w-7 h-7 ${
                          service.status === 'running' ? 'text-white' : darkMode ? 'text-gray-500' : 'text-gray-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a5 5 0 01-5-5 5 5 0 015-5h14a5 5 0 015 5 5 5 0 01-5 5M5 12a5 5 0 00-5 5 5 5 0 005 5h14a5 5 0 005-5 5 5 0 00-5-5" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.name}
                        </h3>
                        {service.url && (
                          <a
                            href={service.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-emerald-600 hover:text-emerald-700 transition-colors"
                            title="Open service URL"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {service.type}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                          {service.env}
                        </span>
                      </div>
                      
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-mono flex items-center gap-1.5`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        {service.id}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex-shrink-0 ml-4">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                      service.status === 'running'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : service.status === 'suspended'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        : service.status === 'stopped'
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                    }`}>
                      <span className={`relative flex h-3 w-3`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                          service.status === 'running' ? 'bg-white' : 'bg-white'
                        } opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 bg-white`}></span>
                      </span>
                      {service.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Service URL */}
                {service.url && (
                  <div className={`mb-4 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-sm font-medium hover:underline ${
                        darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                      } transition-colors`}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span className="truncate">{service.url}</span>
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {['resume', 'suspend', 'restart'].map((action) => {
                    const getActionIcon = () => {
                      switch(action) {
                        case 'resume':
                          return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        case 'suspend':
                          return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        case 'restart':
                          return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                      }
                    };
                    
                    const getActionStyle = () => {
                      switch(action) {
                        case 'resume':
                          return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/50';
                        case 'suspend':
                          return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/50';
                        case 'restart':
                          return 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-400/50';
                      }
                    };
                    
                    return (
                      <button
                        key={action}
                        onClick={() => performServiceAction(service.id, action)}
                        disabled={actionLoading[`${service.id}_${action}`]}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl ${getActionStyle()} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg`}
                      >
                        {actionLoading[`${service.id}_${action}`] ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : getActionIcon()}
                        {actionLoading[`${service.id}_${action}`] ? 'Processing...' : action.charAt(0).toUpperCase() + action.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {services.length === 0 && !loading && !error && (
            <div className={`text-center py-16 ${darkMode ? 'bg-gray-800/30' : 'bg-white'} rounded-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl opacity-20 blur-xl"></div>
                <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-5 shadow-lg`}>
                  <svg className={`h-14 w-14 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a5 5 0 01-5-5 5 5 0 015-5h14a5 5 0 015 5 5 5 0 01-5 5M5 12a5 5 0 00-5 5 5 5 0 005 5h14a5 5 0 005-5 5 5 0 00-5-5" />
                  </svg>
                </div>
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Services Found</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>
                No Render services are currently available or configured. Add services to your Render account to see them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;