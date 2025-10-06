import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateClimateReport } from '../../services/reportService';
import reportService from '../../services/reportService';

const ReportsSection = ({ darkMode }) => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [reportType, setReportType] = useState('comprehensive');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [reportMetrics, setReportMetrics] = useState({
    totalReports: 0,
    downloads: 0,
    scheduled: 0,
    avgSize: '0 KB'
  });
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(true);
  const [generationProgress, setGenerationProgress] = useState('');
  const [consumerId, setConsumerId] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAdmin, setIsAdmin] = useState(null); // null = checking, false = not admin, true = admin
  const [userInfo, setUserInfo] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  // Helper function to convert blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Check admin access directly from localStorage
  const checkAdminAccess = () => {
    try {
      const sessionUser = localStorage.getItem('climatenotify_user');
      if (!sessionUser) {
        return false;
      }
      
      const userData = JSON.parse(sessionUser);
      return userData.accessLevel === 'admin';
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  };

  // Initialize admin status from localStorage
  const initializeAdminStatus = () => {
    try {
      const sessionUser = localStorage.getItem('climatenotify_user');
      if (!sessionUser) {
        setIsAdmin(false);
        setUserInfo(null);
        return;
      }
      
      const userData = JSON.parse(sessionUser);
      const consumerID = userData.consumerID || userData.id;
      const hasAdminAccess = userData.accessLevel === 'admin';
      
      setUserInfo(userData);
      setIsAdmin(hasAdminAccess);
      
      if (hasAdminAccess && consumerID) {
        setConsumerId(consumerID);
      } else {
        console.log('❌ User does not have admin access');
      }
      
    } catch (error) {
      console.error('Error initializing admin status:', error);
      setIsAdmin(false);
      setUserInfo(null);
    }
  };

  // Show admin warning for non-admin users
  const showAdminWarning = isAdmin === false;  const periods = [
    { value: 'daily', label: 'Daily Reports' },
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'monthly', label: 'Monthly Analysis' },
    { value: 'quarterly', label: 'Quarterly Review' },
    { value: 'yearly', label: 'Annual Report' }
  ];

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Climate Report' },
    { value: 'temperature', label: 'Temperature Analysis' },
    { value: 'precipitation', label: 'Precipitation Patterns' },
    { value: 'extreme', label: 'Extreme Weather Events' },
    { value: 'co2', label: 'CO₂ Emissions Report' },
    { value: 'alerts', label: 'Alert Activity Summary' }
  ];

  const regions = [
    { value: 'global', label: 'Global' },
    { value: 'north_america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'south_america', label: 'South America' },
    { value: 'africa', label: 'Africa' },
    { value: 'oceania', label: 'Oceania' }
  ];

  useEffect(() => {
    initializeAdminStatus();
    setupOnlineListener();
  }, []);

  useEffect(() => {
    if (isAdmin === true || isAdmin === false) { // Allow both admin and non-admin to load reports
      loadReports();
      updateMetrics();
      if (isAdmin === true) {
        initializeDatabase();
      }
    }
  }, [isAdmin]);

  const initializeDatabase = async () => {
    try {
      // Get user data from localStorage
      const sessionUser = localStorage.getItem('climatenotify_user');
      
      if (sessionUser) {
        const userData = JSON.parse(sessionUser);
        const userId = userData.consumerID;
        const userAccessLevel = userData.accessLevel;
        
        if (userAccessLevel !== 'admin') {
          // User is not admin, access denied for database operations
          return;
        }
        
        setConsumerId(userId);
      } else {
        // No user session found
        return;
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
      return;
    }
  };

  const setupOnlineListener = () => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOffline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  const saveToDatabase = async (reportData, fileData = null) => {
    if (!consumerId) return false;

    try {
      const requestBody = {
        reportData,
        consumerId
      };

      // Add file data if provided
      if (fileData) {
        requestBody.fileData = fileData;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/climate-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Save request failed');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('❌ Failed to save to database:', error);
      throw error;
    }
  };

  const loadReports = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/climate-reports`);
      if (response.ok) {
        const data = await response.json();
        setRecentReports(data.data.reports || []);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const updateMetrics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/climate-reports`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      const reports = (data.data && data.data.reports) ? data.data.reports : [];

      // Total downloads
      const totalDownloads = reports.reduce((sum, report) => sum + (parseInt(report.downloadCount) || 0), 0);

      // Average file size in MB
      let avgSizeMB = 0;
      if (reports.length > 0) {
        const totalSizeKB = reports.reduce((sum, report) => {
          const sizeStr = report.fileSize || '0 KB';
          const match = sizeStr.match(/([\d.]+)\s*(KB|MB)/i);
          if (match) {
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            return sum + (unit === 'MB' ? value * 1024 : value);
          }
          return sum;
        }, 0);
        avgSizeMB = totalSizeKB / reports.length / 1024;
      }

      setReportMetrics({
        totalReports: reports.length,
        downloads: totalDownloads,
        scheduled: reports.filter(r => r.status === 'scheduled').length,
        avgSize: avgSizeMB > 0 ? `${avgSizeMB.toFixed(1)} MB` : '0 MB'
      });
    } catch (error) {
      console.error('Failed to update metrics:', error);
      setReportMetrics({
        totalReports: 0,
        downloads: 0,
        scheduled: 0,
        avgSize: '0 MB'
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleGenerateReport = async () => {
    if (isGenerating) {
      alert('A report is already being generated. Please wait.');
      return;
    }

    // Allow all users to generate reports, admin check is only for saving
    // if (!checkAdminAccess()) {
    //   alert('Access denied. Only admin users can generate climate reports.');
    //   return;
    // }

    setIsGenerating(true);
    setGenerationProgress('Initializing...');
    
    try {
      const selectedRegionData = regions.find(r => r.value === selectedRegion);
      
      const reportConfig = {
        type: reportType,
        period: selectedPeriod,
        region: selectedRegion,
        includeCharts,
        includeRawData
      };

      setGenerationProgress('Fetching climate data...');
      const reportData = await generateClimateReport(reportConfig);

      setGenerationProgress('Generating PDF...');

      // Convert blob to base64 for upload
      let fileData = null;
      if (reportData.blob) {
        fileData = await blobToBase64(reportData.blob);
      }

      const reportToSave = {
        title: `${reportTypes.find(t => t.value === reportType)?.label} - ${new Date().toLocaleDateString()}`,
        type: reportType,
        period: selectedPeriod,
        region: selectedRegion,
        generatedDate: new Date().toISOString(),
        fileSize: reportData.fileSize || '0 KB',
        downloadCount: 0,
        status: 'completed',
        fileUrl: reportData.downloadUrl || '',
        isPublic: false
      };

      setGenerationProgress('Saving report...');

      // Save directly to database with file data (only for admin users)
      if (consumerId && isAdmin === true) {
        const savedReport = await saveToDatabase(reportToSave, fileData);
        if (savedReport) {
          // Reload reports to show the new one
          await loadReports();
        }
      } else {
        // For non-admin users, just show success message without saving
        alert('Report generated successfully! Note: Reports are not saved for non-admin users.');
      }
      
      updateMetrics();

      setGenerationProgress('');
      
      if (reportData.isMockData) {
        alert('Report generated successfully using demo data!');
      } else {
        alert('Report generated successfully with real weather data!');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      setGenerationProgress('');
      alert('Failed to generate report: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update download count in database
  const updateDownloadCount = async (reportId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/climate-reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          updateData: { downloadCount: 1 }, // Only update download count
          consumerId: consumerId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Failed to update download count in database:', errorData.message);
        return false;
      }

      const result = await response.json();
      return true;
    } catch (error) {
      console.warn('Error updating download count:', error);
      return false;
    }
  };

  const handleDownloadReport = async (report) => {
    // Update download count in database for ALL report types
    const updateSuccess = await updateDownloadCount(report.id);

    if (report.blob) {
      reportService.downloadReport(report.blob, report.fileName);

      // Update local state only if API call was successful
      if (updateSuccess) {
        const updatedReports = recentReports.map(r =>
          r.id === report.id ? { ...r, downloadCount: (parseInt(r.downloadCount) || 0) + 1 } : r
        );
        setRecentReports(updatedReports);
        updateMetrics();
      }
    } else if (report.filePath) {
      const link = document.createElement('a');
      link.href = report.filePath;
      link.download = report.fileName || `${report.title}.pdf`;
      link.click();

      // Update local state only if API call was successful
      if (updateSuccess) {
        const updatedReports = recentReports.map(r =>
          r.id === report.id ? { ...r, downloadCount: (parseInt(r.downloadCount) || 0) + 1 } : r
        );
        setRecentReports(updatedReports);
        updateMetrics();
      }
    } else if (report.fileUrl) {
      // Handle Appwrite Storage URL
      window.open(report.fileUrl, '_blank');

      // Update local state only if API call was successful
      if (updateSuccess) {
        const updatedReports = recentReports.map(r =>
          r.id === report.id ? { ...r, downloadCount: (parseInt(r.downloadCount) || 0) + 1 } : r
        );
        setRecentReports(updatedReports);
        updateMetrics();
      }
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      // Call DELETE API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/climate-reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          consumerId: consumerId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete report');
      }

      // Update local state only after successful API call
      const updatedReports = recentReports.filter(r => r.id !== reportId);
      setRecentReports(updatedReports);
      updateMetrics();
    } catch (error) {
      console.error('❌ Failed to delete report:', error);
      alert('Failed to delete report: ' + error.message);
    }
  };

  const handleTemplateClick = (template) => {
    setReportType(template.type);
    setSelectedPeriod(template.period);
    setSelectedRegion(template.region);
  };

  const shareReport = async (report) => {
    try {
      // Create shareable link - use fileUrl if available, otherwise create a view link
      let shareUrl = '';
      let shareMessage = '';

      if (report.fileUrl) {
        // Direct link to the PDF file
        shareUrl = report.fileUrl;
        shareMessage = `🌍 Climate Report: ${report.title}\n\n📊 Type: ${report.type}\n📅 Period: ${report.period}\n🌐 Region: ${report.region}\n⏰ Generated: ${formatDate(report.generatedDate)}\n📦 Size: ${report.fileSize}\n\n🔗 View/Download Report:\n${shareUrl}`;
      } else if (report.filePath) {
        // Use file path
        shareUrl = report.filePath;
        shareMessage = `🌍 Climate Report: ${report.title}\n\n📊 Type: ${report.type}\n📅 Period: ${report.period}\n🌐 Region: ${report.region}\n⏰ Generated: ${formatDate(report.generatedDate)}\n📦 Size: ${report.fileSize}\n\n🔗 View/Download Report:\n${shareUrl}`;
      } else {
        // Create a reference link with report ID
        shareUrl = `${window.location.origin}/reports/${report.id}`;
        shareMessage = `🌍 Climate Report: ${report.title}\n\n📊 Type: ${report.type}\n📅 Period: ${report.period}\n🌐 Region: ${report.region}\n⏰ Generated: ${formatDate(report.generatedDate)}\n📦 Size: ${report.fileSize}\n\n🔗 View Report:\n${shareUrl}`;
      }

      // Try Web Share API first (mobile devices)
      if (navigator.share && report.fileUrl) {
        try {
          await navigator.share({
            title: `Climate Report: ${report.title}`,
            text: `${report.type} report for ${report.region} - ${report.period}`,
            url: shareUrl
          });
          return; // Success, exit early
        } catch (shareError) {
          // User cancelled or share failed, continue to clipboard fallback
          if (shareError.name !== 'AbortError') {
            console.log('Share API failed, falling back to clipboard');
          } else {
            return; // User cancelled, don't show clipboard message
          }
        }
      }

      // Fallback to clipboard copy
      await navigator.clipboard.writeText(shareMessage);
      
      // Show success message with custom styled alert
      const alertDiv = document.createElement('div');
      alertDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px; background: ${darkMode ? '#1f2937' : '#ffffff'}; border: 2px solid ${darkMode ? '#3b82f6' : '#2563eb'}; border-radius: 12px; padding: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="background: ${darkMode ? '#1e40af' : '#dbeafe'}; border-radius: 8px; padding: 8px; flex-shrink: 0;">
              <svg style="width: 24px; height: 24px; color: ${darkMode ? '#60a5fa' : '#2563eb'};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div style="flex: 1;">
              <h3 style="color: ${darkMode ? '#ffffff' : '#111827'}; font-weight: 600; font-size: 16px; margin: 0 0 4px 0;">Report Link Copied!</h3>
              <p style="color: ${darkMode ? '#9ca3af' : '#6b7280'}; font-size: 14px; margin: 0 0 8px 0;">Share this link to let others view or download the report.</p>
              <a href="${shareUrl}" target="_blank" style="color: #3b82f6; font-size: 13px; text-decoration: underline; word-break: break-all;">
                ${shareUrl.length > 60 ? shareUrl.substring(0, 60) + '...' : shareUrl}
              </a>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: ${darkMode ? '#9ca3af' : '#6b7280'}; cursor: pointer; padding: 4px; flex-shrink: 0;">
              <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(alertDiv);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        alertDiv.remove();
      }, 5000);

    } catch (error) {
      console.error('Share failed:', error);
      // Final fallback - show the URL in an alert
      const shareUrl = report.fileUrl || report.filePath || `${window.location.origin}/reports/${report.id}`;
      alert(`Copy this link to share:\n\n${shareUrl}`);
    }
  };

  const metricsData = [
    {
      title: 'Total Reports Generated',
      value: reportMetrics.totalReports.toString(),
      change: '+23%',
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Downloads This Month',
      value: reportMetrics.downloads.toString(),
      change: '+45%',
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Scheduled Reports',
      value: reportMetrics.scheduled.toString(),
      change: '+8%',
      trend: 'up',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Average File Size',
      value: reportMetrics.avgSize,
      change: '-5%',
      trend: 'down',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
      case 'generating': return darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
      case 'failed': return darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800';
      case 'scheduled': return darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
      default: return darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(recentReports.length / reportsPerPage);
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = recentReports.slice(indexOfFirstReport, indexOfLastReport);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of reports table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when reports change
  useEffect(() => {
    setCurrentPage(1);
  }, [recentReports.length]);

  return (
    <div className="space-y-8">
      {/* Admin Warning for Non-Admin Users */}
      {showAdminWarning && (
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-yellow-900/20 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-medium">
              Dear {userInfo?.fullname || 'User'}, you have limited access. You can view reports but cannot generate and delete them.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reports & Analytics</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Generate and download climate data reports</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`mt-4 sm:mt-0 px-6 py-3 rounded-xl font-medium transition-colors ${
            isGenerating 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isGenerating ? (generationProgress || 'Generating...') : 'Generate New Report'}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricsData.map((metric, index) => (
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

      {/* Report Generator */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 border`}>
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Generate Custom Report</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {regions.map(region => (
                <option key={region.value} value={region.value}>{region.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
              />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Include charts and visualizations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                checked={includeRawData}
                onChange={(e) => setIncludeRawData(e.target.checked)}
              />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Include raw data export</span>
            </label>
          </div>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isGenerating 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isGenerating ? (generationProgress || 'Generating...') : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Reports</h2>
            <div className="flex items-center space-x-2">
              <button className={`px-4 py-2 transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Filter
              </button>
              <button className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                Export List
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
              <tr>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Report Name</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Type</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Period</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Region</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Generated</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Size</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Downloads</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Status</th>
                <th className={`text-left py-3 px-6 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {recentReports.length === 0 ? (
                <tr>
                  <td colSpan="9" className={`py-8 px-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No reports generated yet. Click "Generate New Report" to create your first climate report.
                  </td>
                </tr>
              ) : (
                currentReports.map(report => (
                <tr key={report.id} className={`transition-colors ${
                  darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }`}>
                  <td className="py-4 px-6">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{report.title}</p>
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{report.type}</td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{report.period}</td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{report.region}</td>
                  <td className={`py-4 px-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDate(report.generatedDate)}
                  </td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{report.fileSize}</td>
                  <td className={`py-4 px-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{report.downloadCount}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {report.status === 'completed' && (
                        <>
                          <button 
                            onClick={() => handleDownloadReport(report)}
                            className={`p-1 transition-colors ${
                              darkMode ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'
                            }`} 
                            title="Download"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => shareReport(report)}
                            className={`p-1 transition-colors ${
                              darkMode ? 'text-gray-500 hover:text-green-400' : 'text-gray-400 hover:text-green-600'
                            }`} 
                            title="Share"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                          </button>
                          {isAdmin === true && (
                            <button 
                              onClick={() => handleDeleteReport(report.id)}
                              className={`p-1 transition-colors ${
                                darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                              }`} 
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {recentReports.length > reportsPerPage && (
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Pagination Info */}
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing <span className="font-medium">{indexOfFirstReport + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastReport, recentReports.length)}</span> of{' '}
                <span className="font-medium">{recentReports.length}</span> reports
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? darkMode
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === currentPage - 2 && currentPage > 3) ||
                      (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className={`px-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? darkMode
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Templates */}
      <div className={`${
        darkMode
          ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-700/50'
          : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100'
      } rounded-2xl p-6 border`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Report Templates</h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quick access to commonly used report configurations</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <button 
            onClick={() => handleTemplateClick({ type: 'comprehensive', period: 'monthly', region: 'global' })}
            className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Executive Summary</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>High-level climate overview</p>
            </div>
          </button>

          <button 
            onClick={() => handleTemplateClick({ type: 'extreme', period: 'weekly', region: 'north_america' })}
            className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-600'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Emergency Report</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Critical weather events</p>
            </div>
          </button>

          <button 
            onClick={() => handleTemplateClick({ type: 'temperature', period: 'yearly', region: 'europe' })}
            className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-100 text-purple-600'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Research Report</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Detailed scientific analysis</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;