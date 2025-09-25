import React, { useState } from 'react';

const ClimateAnalytics = ({ darkMode }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('temperature');

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const metrics = [
    { value: 'temperature', label: 'Temperature', unit: '°C', color: 'red' },
    { value: 'co2', label: 'CO₂ Levels', unit: 'ppm', color: 'orange' },
    { value: 'humidity', label: 'Humidity', unit: '%', color: 'blue' },
    { value: 'precipitation', label: 'Precipitation', unit: 'mm', color: 'green' }
  ];

  const chartData = [
    { time: '00:00', temperature: 28.5, co2: 418, humidity: 65, precipitation: 0 },
    { time: '04:00', temperature: 26.8, co2: 420, humidity: 72, precipitation: 2.3 },
    { time: '08:00', temperature: 31.2, co2: 422, humidity: 58, precipitation: 0 },
    { time: '12:00', temperature: 35.7, co2: 425, humidity: 45, precipitation: 0 },
    { time: '16:00', temperature: 38.1, co2: 428, humidity: 42, precipitation: 0 },
    { time: '20:00', temperature: 33.4, co2: 424, humidity: 55, precipitation: 1.8 }
  ];

  const regionalData = [
    {
      region: 'North America',
      temperature: 32.4,
      temperatureChange: '+2.1',
      co2: 421,
      co2Change: '+3.2',
      alerts: 234,
      trend: 'up'
    },
    {
      region: 'Europe',
      temperature: 28.7,
      temperatureChange: '+1.8',
      co2: 418,
      co2Change: '+2.8',
      alerts: 156,
      trend: 'up'
    },
    {
      region: 'Asia',
      temperature: 34.1,
      temperatureChange: '+2.5',
      co2: 425,
      co2Change: '+4.1',
      alerts: 387,
      trend: 'up'
    },
    {
      region: 'South America',
      temperature: 29.3,
      temperatureChange: '+1.4',
      co2: 415,
      co2Change: '+2.1',
      alerts: 198,
      trend: 'stable'
    },
    {
      region: 'Africa',
      temperature: 36.8,
      temperatureChange: '+3.2',
      co2: 422,
      co2Change: '+3.8',
      alerts: 412,
      trend: 'up'
    },
    {
      region: 'Oceania',
      temperature: 27.9,
      temperatureChange: '+1.1',
      co2: 416,
      co2Change: '+1.9',
      alerts: 89,
      trend: 'stable'
    }
  ];

  const getMaxValue = (data, key) => Math.max(...data.map(d => d[key]));
  const getBarHeight = (value, maxValue) => (value / maxValue) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Climate Analytics</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Detailed climate data analysis and trends</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className={`rounded-2xl p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select Metric</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(metric => (
            <button
              key={metric.value}
              onClick={() => setSelectedMetric(metric.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedMetric === metric.value
                  ? darkMode 
                    ? 'border-blue-500 bg-blue-900/30' 
                    : 'border-blue-500 bg-blue-50'
                  : darkMode
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg mb-3 mx-auto ${
                metric.color === 'red' ? 'bg-red-100' :
                metric.color === 'orange' ? 'bg-orange-100' :
                metric.color === 'blue' ? 'bg-blue-100' :
                'bg-green-100'
              }`}></div>
              <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.label}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.unit}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className={`rounded-2xl p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {metrics.find(m => m.value === selectedMetric)?.label} Trends
          </h2>
          <div className={`flex items-center space-x-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Current Period</span>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64 flex items-end justify-between space-x-2 mb-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600 relative group"
                style={{ 
                  height: `${getBarHeight(data[selectedMetric], getMaxValue(chartData, selectedMetric))}%`,
                  minHeight: '8px'
                }}
              >
                <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                  darkMode ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
                }`}>
                  {data[selectedMetric]}{metrics.find(m => m.value === selectedMetric)?.unit}
                </div>
              </div>
              <span className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{data.time}</span>
            </div>
          ))}
        </div>

        {/* Chart Legend */}
        <div className={`flex items-center justify-center space-x-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center space-x-2">
            <span>Min: {Math.min(...chartData.map(d => d[selectedMetric]))}{metrics.find(m => m.value === selectedMetric)?.unit}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Max: {Math.max(...chartData.map(d => d[selectedMetric]))}{metrics.find(m => m.value === selectedMetric)?.unit}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Avg: {(chartData.reduce((sum, d) => sum + d[selectedMetric], 0) / chartData.length).toFixed(1)}{metrics.find(m => m.value === selectedMetric)?.unit}</span>
          </div>
        </div>
      </div>

      {/* Regional Data */}
      <div className={`rounded-2xl p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Regional Climate Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Region</th>
                <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Temperature</th>
                <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CO₂ Levels</th>
                <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Active Alerts</th>
                <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {regionalData.map((region, index) => (
                <tr key={index} className={`border-b transition-colors ${
                  darkMode 
                    ? 'border-gray-700 hover:bg-gray-700' 
                    : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  <td className={`py-4 px-4 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{region.region}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{region.temperature}°C</span>
                      <span className="text-xs text-red-600 font-medium">({region.temperatureChange})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{region.co2} ppm</span>
                      <span className="text-xs text-orange-600 font-medium">({region.co2Change})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      region.alerts > 300 ? 'bg-red-100 text-red-800' :
                      region.alerts > 150 ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {region.alerts}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <svg className={`w-4 h-4 ${
                        region.trend === 'up' ? 'text-red-500' : 'text-gray-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                      <span className={`text-sm capitalize ${
                        region.trend === 'up' 
                          ? 'text-red-600' 
                          : darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {region.trend}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 border ${
          darkMode
            ? 'bg-gradient-to-br from-gray-800 to-gray-800 border-gray-700'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Global temperature rising</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average increase of 2.1°C across all regions</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>CO₂ levels accelerating</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>3.2 ppm increase over last monitoring period</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Regional variations significant</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Africa showing highest temperature increases</p>
              </div>
            </li>
          </ul>
        </div>

        <div className={`rounded-2xl p-6 border ${
          darkMode
            ? 'bg-gradient-to-br from-gray-800 to-gray-800 border-gray-700'
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Increase monitoring frequency</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Focus on high-alert regions</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Deploy additional sensors</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Target areas with data gaps</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enhance alert systems</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Improve early warning capabilities</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClimateAnalytics;