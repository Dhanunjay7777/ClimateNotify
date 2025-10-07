import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AppuserReports = ({ darkMode }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(15);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

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

  // Fetch reports from MongoDB API
  const fetchReports = async (page = 1, filter = 'all', search = '') => {
    try {
      setLoading(true);
      setError('');
      
      // Double check admin access before making API calls
      if (!user || user.accessLevel !== 'admin') {
        throw new Error('Unauthorized access. Admin privileges required.');
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: reportsPerPage.toString()
      });

      if (search.trim()) {
        params.append('search', search.trim());
      }

      if (filter !== 'all') {
        params.append('filter', filter);
      }

      const response = await fetch(`${API_BASE_URL}/api/reports?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setReports(data.data.reports);
        setTotalPages(data.data.pagination?.totalPages || 0);
        setTotalReports(data.data.pagination?.totalReports || 0);
        setHasNextPage(data.data.pagination?.hasNext || false);
        setHasPrevPage(data.data.pagination?.hasPrev || false);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      const errorMessage = err.message.includes('fetch') 
        ? `Cannot connect to server. Make sure the server is running.`
        : err.message;
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics from MongoDB API
  const fetchStats = async () => {
    try {
      // Double check admin access before making API calls
      if (!user || user.accessLevel !== 'admin') {
        throw new Error('Unauthorized access. Admin privileges required.');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/reports/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setStats(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchReports(currentPage, selectedFilter, searchTerm),
        fetchStats()
      ]);
    };

    loadData();
  }, [currentPage, selectedFilter, searchTerm]);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  // Handle image preview - open in new tab
  const handleImagePreview = async (s3Key) => {
    try {
      setImageLoading(true);
      
      // Double check admin access before making API calls
      if (!user || user.accessLevel !== 'admin') {
        alert('Unauthorized access. Admin privileges required.');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/reports/image/${encodeURIComponent(s3Key)}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        window.open(data.data.signedUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert('Failed to load image. Please try again.');
      }
    } catch (err) {
      alert('Error loading image. Please check your connection.');
    } finally {
      setImageLoading(false);
    }
  };

  // Handle view details
  const handleViewDetails = (report) => {
    const details = {
      'Report ID': report._id || 'N/A',
      'User ID': report.userid || 'N/A',
      'Description': report.description || 'No description',
      'Location': report.location || 'Unknown',
      'Raised At': report.raisedat ? formatDate(report.raisedat) : 'N/A',
      'File Size': report.filesize ? `${(report.filesize / 1024).toFixed(1)} KB` : 'N/A',
      'MIME Type': report.mimetype || 'N/A',
      'Has Image': report.imageurl ? 'Yes' : 'No'
    };
    
    const detailsText = Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\\n');
    
    alert(`Report Details:\\n\\n${detailsText}`);
  };

  // Handle export report
  const handleExportReport = (report) => {
    try {
      const csvContent = [
        'Field,Value',
        `Report ID,"${report._id || 'N/A'}"`,
        `User ID,"${report.userid || 'N/A'}"`,
        `Description,"${(report.description || 'No description').replace(/"/g, '""')}"`,
        `Location,"${report.location || 'Unknown'}"`,
        `Raised At,"${report.raisedat ? formatDate(report.raisedat) : 'N/A'}"`,
        `File Size,"${report.filesize ? `${(report.filesize / 1024).toFixed(1)} KB` : 'N/A'}"`,
        `MIME Type,"${report.mimetype || 'N/A'}"`,
        `Image URL,"${report.imageurl || 'N/A'}"`
      ].join('\\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `app-user-report-${report.userid || 'unknown'}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('✅ Report exported successfully!');
    } catch (error) {
      alert('❌ Failed to export report. Please try again.');
    }
  };

  // Handle delete report with API call
  const handleDeleteReport = async (report) => {
    // Double check admin access before making API calls
    if (!user || user.accessLevel !== 'admin') {
      alert('Unauthorized access. Admin privileges required.');
      return;
    }
    
    const confirmMessage = `Are you sure you want to delete this report?\\n\\nUser: ${report.userid}\\nDescription: ${report.description?.substring(0, 50)}...\\n\\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reports/${report._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setReports(prevReports => prevReports.filter(r => r._id !== report._id));
          setTotalReports(prev => prev - 1);
          alert('✅ Report deleted successfully!');
        } else {
          alert(`❌ Failed to delete report: ${data.message}`);
        }
      } catch (error) {
        alert('❌ Error deleting report. Please try again.');
      }
    }
  };

  // Handle bulk export
  const handleBulkExport = () => {
    if (reports.length === 0) {
      alert('No reports to export');
      return;
    }
    
    try {
      const csvContent = [
        'Report ID,User ID,Description,Location,Raised At,File Size,MIME Type,Image URL',
        ...reports.map(report => [
          report._id || 'N/A',
          report.userid || 'N/A',
          (report.description || 'No description').replace(/"/g, '""'),
          report.location || 'Unknown',
          report.raisedat ? formatDate(report.raisedat) : 'N/A',
          report.filesize ? `${(report.filesize / 1024).toFixed(1)} KB` : 'N/A',
          report.mimetype || 'N/A',
          report.imageurl || 'N/A'
        ].map(field => `"${field}"`).join(','))
      ].join('\\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `app-user-reports-bulk-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert(`✅ Successfully exported ${reports.length} reports!`);
    } catch (error) {
      alert('❌ Failed to export reports. Please try again.');
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Default stats if API fails
  const defaultStats = {
    totalReports: 0,
    thisMonth: 0,
    activeUsers: 0,
    monthlyGrowth: 0,
    totalGrowth: 0
  };

  const displayStats = stats || defaultStats;

  const reportMetrics = [
    {
      title: 'Total App User Reports',
      value: displayStats.totalReports?.toLocaleString() || '0',
      change: `${displayStats.totalGrowth > 0 ? '+' : ''}${displayStats.totalGrowth || 0}%`,
      trend: displayStats.totalGrowth >= 0 ? 'up' : 'down',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Reports This Month',
      value: displayStats.thisMonth?.toLocaleString() || '0',
      change: `${displayStats.monthlyGrowth > 0 ? '+' : ''}${displayStats.monthlyGrowth || 0}%`,
      trend: displayStats.monthlyGrowth >= 0 ? 'up' : 'down',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Active Users',
      value: displayStats.activeUsers?.toLocaleString() || '0',
      change: '+12%',
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      title: 'Database Status',
      value: error ? 'Error' : 'Connected',
      change: error ? 'Failed' : 'Active',
      trend: error ? 'down' : 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      )
    }
  ];

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Reports', count: reports.length },
    { value: 'recent', label: 'Recent (7 days)', count: 0 },
    { value: 'thisMonth', label: 'This Month', count: displayStats.thisMonth || 0 },
    { value: 'critical', label: 'Critical Issues', count: 0 }
  ];

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading app user reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>App User Reports Dashboard</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time user reports and incident data from MongoDB (Admin Only)</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
          >
            Refresh Data
          </button>
          <button 
            onClick={handleBulkExport}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`${darkMode ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-800'} border rounded-xl p-4`}>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Database Connection Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {reportMetrics.map((metric, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border hover:shadow-lg transition-all duration-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'} rounded-xl flex items-center justify-center`}>
                {metric.icon}
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' 
                  ? darkMode ? 'text-green-400' : 'text-green-600'
                  : darkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                <svg className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                <span>{metric.change}</span>
              </div>
            </div>
            <div>
              <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Controls */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === option.value
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search app user reports..."
                value={searchTerm}
                onChange={handleSearch}
                className={`w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* App User Reports Table */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              App User Reports from MongoDB ({reports.length} records)
            </h2>
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
              <tr>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>User ID</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Description</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Location</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Raised At</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Image</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {reports.length > 0 ? (
                reports.map((report, index) => (
                  <tr key={report._id || index} className={`transition-colors ${
                    darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}>
                    <td className="py-4 px-6">
                      <span className={`font-mono text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {report.userid || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className={`font-medium max-w-xs truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {report.description || 'No description available'}
                      </p>
                    </td>
                    <td className={`py-4 px-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {report.location || 'Unknown'}
                    </td>
                    <td className={`py-4 px-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {report.raisedat ? formatDate(report.raisedat) : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      {report.imageurl ? (
                        <button
                          onClick={() => handleImagePreview(report.imageurl)}
                          disabled={imageLoading}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
                            imageLoading
                              ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : darkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {imageLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>Open Image</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>No Image</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(report)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                          }`} 
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleExportReport(report)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                          }`} 
                          title="Export Report"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteReport(report)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          }`} 
                          title="Delete Report"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={`py-12 px-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex flex-col items-center space-y-3">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-lg font-medium">No app user reports found</p>
                        <p className="text-sm">Try adjusting your search criteria or check the database connection.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {((currentPage - 1) * reportsPerPage) + 1} to {Math.min(currentPage * reportsPerPage, totalReports)} of {totalReports} reports
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={!hasPrevPage || loading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    !hasPrevPage || loading
                      ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : darkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={!hasNextPage || loading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    !hasNextPage || loading
                      ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppuserReports;