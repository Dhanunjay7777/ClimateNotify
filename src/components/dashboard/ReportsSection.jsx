import React, { useState } from 'react';

const ReportsSection = ({ darkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [reportType, setReportType] = useState('comprehensive');
  const [selectedRegion, setSelectedRegion] = useState('global');

  const periods = [
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

  const recentReports = [
    {
      id: 1,
      title: 'Global Climate Analysis - January 2024',
      type: 'Comprehensive',
      period: 'Monthly',
      region: 'Global',
      generatedDate: '2024-01-15T09:00:00Z',
      fileSize: '2.4 MB',
      downloadCount: 127,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Extreme Weather Events - Q4 2023',
      type: 'Extreme Weather',
      period: 'Quarterly',
      region: 'North America',
      generatedDate: '2024-01-10T14:30:00Z',
      fileSize: '1.8 MB',
      downloadCount: 89,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Temperature Trends - Europe',
      type: 'Temperature Analysis',
      period: 'Weekly',
      region: 'Europe',
      generatedDate: '2024-01-14T11:15:00Z',
      fileSize: '950 KB',
      downloadCount: 43,
      status: 'completed'
    },
    {
      id: 4,
      title: 'CO₂ Emissions Report - Asia Pacific',
      type: 'CO₂ Emissions',
      period: 'Monthly',
      region: 'Asia',
      generatedDate: '2024-01-12T16:45:00Z',
      fileSize: '3.1 MB',
      downloadCount: 201,
      status: 'completed'
    },
    {
      id: 5,
      title: 'Alert Activity Summary - Daily',
      type: 'Alert Activity',
      period: 'Daily',
      region: 'Global',
      generatedDate: '2024-01-15T08:00:00Z',
      fileSize: '456 KB',
      downloadCount: 312,
      status: 'generating'
    }
  ];

  const reportMetrics = [
    {
      title: 'Total Reports Generated',
      value: '1,247',
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
      value: '4,892',
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
      value: '34',
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
      value: '1.8 MB',
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reports & Analytics</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Generate and download climate data reports</p>
        </div>
        <button className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
          Generate New Report
        </button>
      </div>

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
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Include charts and visualizations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Include raw data export</span>
            </label>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Generate Report
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
              {recentReports.map(report => (
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
                          <button className={`p-1 transition-colors ${
                            darkMode ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'
                          }`} title="Download">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <button className={`p-1 transition-colors ${
                            darkMode ? 'text-gray-500 hover:text-green-400' : 'text-gray-400 hover:text-green-600'
                          }`} title="Share">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                          </button>
                        </>
                      )}
                      <button className={`p-1 transition-colors ${
                        darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                      }`} title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
          }`}>
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
          
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
          }`}>
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
          
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
          }`}>
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