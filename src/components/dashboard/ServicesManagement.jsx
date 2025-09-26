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
      <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Access Denied</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            You don't have permission to access this feature. Administrator privileges are required.
          </p>
          <div className={`inline-flex items-center px-4 py-2 rounded-md text-sm ${
            darkMode ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-800'
          }`}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contact your administrator to request access
          </div>
        </div>
      </div>
    );
  }

  const getAuthToken = () => {
    return user?.id || 'admin-token';
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
        throw new Error(`Server returned HTML instead of JSON. This usually means:
1. The server is not running on port 5000
2. The API endpoint doesn't exist
3. There's a server error

Please check:
- Is your server running? (npm start in server folder)
- Is it listening on port 5000?
- Check server console for errors`);
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
      <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12l4-4m-4 4l4 4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12h-6m6 0l-4-4m4 4l-4 4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-emerald-600">Render Services Management</h2>
        </div>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage and monitor your Render.com services</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <h3 className="font-bold">Error:</h3>
          <pre className="mt-2 text-sm whitespace-pre-wrap">{error}</pre>
          <button 
            onClick={() => setError('')}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Found {services.length} services
        </div>
        <button
          onClick={fetchServices}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Services
        </button>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`border rounded-lg p-4 ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  service.status === 'running' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    service.status === 'running' ? 'text-green-600' : 'text-gray-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12l4-4m-4 4l4 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {service.name}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </h3>
                  <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {service.type} • {service.env}
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-mono`}>ID: {service.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    service.status === 'running'
                      ? 'bg-green-100 text-green-800'
                      : service.status === 'stopped'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {service.status}
                </span>
              </div>
            </div>

            {service.url && (
              <div className="mb-3">
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {service.url}
                </a>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {['resume', 'suspend', 'restart'].map((action) => {
                const getActionIcon = () => {
                  switch(action) {
                    case 'resume':
                      return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 0a9 9 0 1118 0 9 9 0 01-18 0z" />
                      </svg>
                    case 'suspend':
                      return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    case 'restart':
                      return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                  }
                };
                
                return (
                  <button
                    key={action}
                    onClick={() => performServiceAction(service.id, action)}
                    disabled={actionLoading[`${service.id}_${action}`]}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                      action === 'resume'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : action === 'suspend'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {actionLoading[`${service.id}_${action}`] ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : getActionIcon()}
                    {actionLoading[`${service.id}_${action}`] ? 'Loading...' : action.charAt(0).toUpperCase() + action.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-4m0 0l-2-2m2 2l-2 2" />
              </svg>
            </div>
          </div>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Services Found</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No Render services are currently available or configured.</p>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;