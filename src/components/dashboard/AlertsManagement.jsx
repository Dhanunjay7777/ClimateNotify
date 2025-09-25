import React, { useState } from 'react';

const AlertsManagement = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: 'active', label: 'Active Alerts', count: 24 },
    { id: 'resolved', label: 'Resolved', count: 156 },
    { id: 'scheduled', label: 'Scheduled', count: 8 }
  ];

  const severityFilters = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const alerts = [
    {
      id: 1,
      title: 'Extreme Heat Warning - Phoenix',
      type: 'Temperature',
      severity: 'critical',
      location: 'Phoenix, Arizona, USA',
      description: 'Temperature forecast to exceed 120°F for 3 consecutive days',
      timestamp: '2024-01-15T14:30:00Z',
      status: 'active',
      affectedPopulation: '1.7M',
      estimatedDuration: '72 hours',
      priority: 1
    },
    {
      id: 2,
      title: 'Hurricane Category 4 - Atlantic',
      type: 'Storm',
      severity: 'critical',
      location: 'Atlantic Ocean',
      description: 'Hurricane intensifying, expected landfall in 48 hours',
      timestamp: '2024-01-15T12:15:00Z',
      status: 'active',
      affectedPopulation: '2.3M',
      estimatedDuration: '120 hours',
      priority: 1
    },
    {
      id: 3,
      title: 'Wildfire Risk - California',
      type: 'Fire Weather',
      severity: 'high',
      location: 'Northern California, USA',
      description: 'Red flag conditions with high winds and low humidity',
      timestamp: '2024-01-15T10:00:00Z',
      status: 'active',
      affectedPopulation: '850K',
      estimatedDuration: '24 hours',
      priority: 2
    },
    {
      id: 4,
      title: 'Heavy Rainfall Alert - Mumbai',
      type: 'Precipitation',
      severity: 'medium',
      location: 'Mumbai, Maharashtra, India',
      description: 'Monsoon activity exceeding normal levels, flooding possible',
      timestamp: '2024-01-15T08:45:00Z',
      status: 'active',
      affectedPopulation: '12.4M',
      estimatedDuration: '48 hours',
      priority: 3
    },
    {
      id: 5,
      title: 'Air Quality Alert - Beijing',
      type: 'Air Quality',
      severity: 'medium',
      location: 'Beijing, China',
      description: 'PM2.5 levels exceeding WHO guidelines',
      timestamp: '2024-01-15T06:30:00Z',
      status: 'active',
      affectedPopulation: '21.5M',
      estimatedDuration: '36 hours',
      priority: 3
    },
    {
      id: 6,
      title: 'Drought Conditions - Australia',
      type: 'Drought',
      severity: 'high',
      location: 'Western Australia',
      description: 'Severe drought affecting agricultural regions',
      timestamp: '2024-01-14T16:20:00Z',
      status: 'resolved',
      affectedPopulation: '450K',
      estimatedDuration: '2160 hours',
      priority: 2
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'critical') {
      return (
        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    );
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab !== 'all' && alert.status !== activeTab) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    return true;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Alerts Management</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monitor and manage climate alerts and notifications</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Create Alert
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-2xl p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>2</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Critical Alerts</p>
        </div>

        <div className={`rounded-2xl p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>5</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>High Priority</p>
        </div>

        <div className={`rounded-2xl p-6 border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>24</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Alerts</p>
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
          <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>156</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Resolved Today</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Tabs */}
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'bg-blue-900 text-blue-100'
                      : 'bg-blue-100 text-blue-700'
                    : darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <select 
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {severityFilters.map(filter => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className={`${darkMode ? 'divide-gray-700' : 'divide-gray-100'} divide-y`}>
          {filteredAlerts.map(alert => (
            <div key={alert.id} className={`p-6 transition-colors ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {alert.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className={`flex items-center space-x-4 text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{alert.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatTimestamp(alert.timestamp)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{alert.affectedPopulation} affected</span>
                      </span>
                    </div>
                    
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{alert.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-3 py-1 rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        Type: {alert.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        Duration: {alert.estimatedDuration}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className={`p-2 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className={`p-2 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-400 hover:text-green-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button className={`p-2 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredAlerts.length} of {alerts.length} alerts
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
            3
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
    </div>
  );
};

export default AlertsManagement;