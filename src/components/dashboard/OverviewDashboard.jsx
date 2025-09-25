import React, { useMemo, useState, useEffect } from 'react';
import { useClimateData, useWeatherForecast } from '../../hooks/useClimateData';

// Simple chart components using SVG and Material Icons
const LineChart = ({ data, color = "rgb(59, 130, 246)", darkMode }) => {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value - minValue) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              className="drop-shadow-sm"
            />
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
        {data.map((item, index) => (
          <span key={index} className="text-center">{item.label}</span>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, color = "rgb(59, 130, 246)", darkMode }) => {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;
  
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full h-full flex items-end justify-between space-x-2 p-4">
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100;
        return (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div className="text-xs font-medium text-gray-600">{item.value.toFixed(1)}</div>
            <div 
              className="w-full rounded-t-lg transition-all duration-500 ease-out"
              style={{ 
                height: `${height}%`,
                backgroundColor: color,
                minHeight: '4px'
              }}
            />
            <div className="text-xs text-gray-500 text-center">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const StatCardSkeleton = () => (
  <div className="rounded-2xl p-6 border bg-white animate-pulse" style={{ aspectRatio: '1', minHeight: '140px' }}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      <div className="w-16 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
    <div className="w-24 h-4 bg-gray-200 rounded"></div>
  </div>
);

const OverviewDashboard = ({ darkMode }) => {
  const { data: climateData, loading, error, lastUpdated, refresh } = useClimateData(true, 60000);
  const { forecast, loading: forecastLoading, error: forecastError } = useWeatherForecast(null, 5, true);

  // State for localStorage data
  const [localStorageData, setLocalStorageData] = useState(null);
  const [co2Data, setCo2Data] = useState(null);
  const [activeChart, setActiveChart] = useState('temperature');

  // Load data from localStorage
  useEffect(() => {
    try {
      const climateOverview = localStorage.getItem('climate_dashboard_climate_overview');
      const co2Info = localStorage.getItem('climate_co2Data');
      
      if (climateOverview) {
        setLocalStorageData(JSON.parse(climateOverview));
      }
      if (co2Info) {
        setCo2Data(JSON.parse(co2Info));
      }
    } catch (error) {
      console.error('Error loading localStorage data:', error);
    }
  }, []);

  // Use localStorage data as primary source, fallback to API data
  const displayData = localStorageData?.data || climateData;
  const displayForecast = localStorageData?.data?.forecast || forecast;

  // Enhanced stats using Material Icons and real localStorage data
  const realStats = useMemo(() => {
    if (!displayData) return [];
    
    return [
      {
        title: 'Current Temperature',
        value: `${displayData.weather?.temperature || '--'}°C`,
        change: displayData.weather?.apparentTemperature ? `feels ${displayData.weather.apparentTemperature}°C` : '--',
        trend: displayData.weather?.temperature > 25 ? 'up' : 'neutral',
        icon: 'device_thermostat',
        color: displayData.weather?.temperature > 30 ? 'red' : displayData.weather?.temperature > 20 ? 'orange' : 'blue'
      },
      {
        title: 'Air Quality Index',
        value: displayData.airQuality?.aqiLabel || `${displayData.airQuality?.aqi || '--'}`,
        change: displayData.airQuality?.pollutants?.pm2_5 ? `PM2.5: ${displayData.airQuality.pollutants.pm2_5.toFixed(1)}` : '--',
        trend: displayData.airQuality?.aqi >= 100 ? 'up' : displayData.airQuality?.aqi >= 50 ? 'neutral' : 'down',
        icon: 'air',
        color: displayData.airQuality?.aqi >= 100 ? 'red' : displayData.airQuality?.aqi >= 50 ? 'orange' : 'green'
      },
      {
        title: 'UV Index',
        value: displayData.airQuality?.environmental?.uvIndex ? `${displayData.airQuality.environmental.uvIndex}` : '--',
        change: displayData.airQuality?.environmental?.uvIndex >= 8 ? 'Extreme' : 
               displayData.airQuality?.environmental?.uvIndex >= 6 ? 'High' : 
               displayData.airQuality?.environmental?.uvIndex >= 3 ? 'Moderate' : 'Low',
        trend: displayData.airQuality?.environmental?.uvIndex >= 6 ? 'up' : 'neutral',
        icon: 'wb_sunny',
        color: displayData.airQuality?.environmental?.uvIndex >= 8 ? 'red' : 
               displayData.airQuality?.environmental?.uvIndex >= 6 ? 'orange' : 'yellow'
      },
      {
        title: 'Humidity Level',
        value: `${displayData.weather?.humidity || '--'}%`,
        change: displayData.weather?.humidity > 70 ? 'High' : displayData.weather?.humidity < 30 ? 'Low' : 'Normal',
        trend: displayData.weather?.humidity > 70 ? 'up' : displayData.weather?.humidity < 30 ? 'down' : 'neutral',
        icon: 'water_drop',
        color: displayData.weather?.humidity > 70 ? 'blue' : displayData.weather?.humidity < 30 ? 'red' : 'green'
      },
      ...(co2Data ? [{
        title: 'CO₂ Level',
        value: `${co2Data.data?.current || '--'} ppm`,
        change: co2Data.data?.change ? `${co2Data.data.change > 0 ? '+' : ''}${co2Data.data.change} ppm` : '--',
        trend: co2Data.data?.trend === 'increasing' ? 'up' : co2Data.data?.trend === 'decreasing' ? 'down' : 'neutral',
        icon: 'co2',
        color: co2Data.data?.current > 420 ? 'red' : co2Data.data?.current > 400 ? 'orange' : 'green'
      }] : [])
    ];
  }, [displayData, co2Data]);

  const recentAlerts = useMemo(() => displayData?.alerts || [], [displayData?.alerts]);
  const globalInsights = useMemo(() => displayData?.insights || [], [displayData?.insights]);
  const processedForecast = useMemo(() => displayForecast || [], [displayForecast]);

  // Generate chart data from real localStorage data
  const chartData = useMemo(() => {
    if (!displayData || !displayForecast) return null;
    
    // Temperature trend from forecast
    const temperatureTrend = displayForecast.slice(0, 7).map((day, index) => ({
      label: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: (day.tempMax + day.tempMin) / 2
    }));
    
    // Air quality data points
    const airQualityData = displayData.airQuality?.pollutants ? [
      { label: 'PM2.5', value: displayData.airQuality.pollutants.pm2_5 },
      { label: 'PM10', value: displayData.airQuality.pollutants.pm10 },
      { label: 'O₃', value: displayData.airQuality.pollutants.o3 },
      { label: 'NO₂', value: displayData.airQuality.pollutants.no2 },
      { label: 'SO₂', value: displayData.airQuality.pollutants.so2 },
      { label: 'CO', value: displayData.airQuality.pollutants.co / 100 } // Scale down CO
    ] : [];
    
    // UV Index trend from forecast
    const uvTrend = displayForecast.slice(0, 5).map((day, index) => ({
      label: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: day.uvIndex
    }));
    
    return { temperatureTrend, airQualityData, uvTrend };
  }, [displayData, displayForecast]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Climate Overview</h1>
          <div className="flex items-center gap-4">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time global climate monitoring and insights</p>
            {lastUpdated && (
              <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={refresh}
            disabled={loading}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50'
            }`}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && !climateData && (
        <div className={`rounded-lg p-4 border-l-4 ${
          error.includes('429') 
            ? 'border-yellow-500' 
            : 'border-red-500'
        } ${
          darkMode 
            ? (error.includes('429') ? 'bg-yellow-900/20 text-yellow-300' : 'bg-red-900/20 text-red-300')
            : (error.includes('429') ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800')
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-medium">
                {error.includes('429') 
                  ? 'API Rate Limit Reached - Using Cached Data'
                  : 'Unable to fetch real-time climate data'
                }
              </p>
              <p className="mt-1 text-sm opacity-80">
                {error.includes('429') 
                  ? 'Data will refresh automatically in the next hour. Cached forecast data is still available.'
                  : `Error: ${error}`
                }
              </p>
              {!error.includes('429') && (
                <p className="mt-1 text-sm opacity-80">Please check your API keys in .env file and internet connection.</p>
              )}
            </div>
          </div>
        </div>
      )}

   {/* Climate Metrics - Enhanced Stats Section with Better Height */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
  {loading && !climateData ? (
    // Optimized loading skeleton with increased height
    Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className={`rounded-lg p-4 border animate-pulse ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`} style={{ height: '160px' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
          <div className="w-6 h-3 bg-gray-300 rounded-full"></div>
        </div>
        <div className="w-20 h-8 bg-gray-300 rounded mb-2"></div>
        <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
        <div className="w-28 h-3 bg-gray-300 rounded"></div>
      </div>
    ))
  ) : realStats.length > 0 ? (
    // Enhanced metric cards with proper height and spacing
    realStats.map((stat, index) => (
      <div 
        key={index} 
        className={`group rounded-lg p-4 border transition-all duration-200 hover:shadow-lg hover:scale-105 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        style={{ height: '160px' }}
      >
        <div className="flex items-center justify-between mb-4 h-12">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            stat.color === 'red' ? 'bg-red-100 text-red-600' :
            stat.color === 'orange' ? 'bg-orange-100 text-orange-600' :
            stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
            stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
            'bg-green-100 text-green-600'
          }`}>
            <span className="material-icons text-xl">{stat.icon}</span>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
            stat.trend === 'up' ? 'bg-red-100 text-red-600' : 
            stat.trend === 'down' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className="material-icons text-xs">
              {stat.trend === 'up' ? 'trending_up' : stat.trend === 'down' ? 'trending_down' : 'trending_flat'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-20">
          <div className="mb-3">
            <p className={`text-2xl font-bold mb-1 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </p>
            <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {stat.title}
            </p>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {stat.change}
          </p>
        </div>
      </div>
    ))
  ) : (
    // Error state
    <div className={`col-span-full text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      <p>Unable to load real-time data</p>
      <button 
        onClick={refresh}
        className={`mt-2 px-4 py-2 rounded-lg ${
          darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        Retry
      </button>
    </div>
  )}
</div>


      {/* Climate Analytics & Global Insights - Side by Side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Climate Analytics - Main Chart Area with UV Index, Temperature Trend, Air Quality */}
        <div className={`xl:col-span-2 rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <span className="material-icons text-xl">analytics</span>
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Climate Analytics
              </h3>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveChart('temperature')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeChart === 'temperature' 
                    ? darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-600'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Temperature
              </button>
              <button 
                onClick={() => setActiveChart('airquality')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeChart === 'airquality' 
                    ? darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-600'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Air Quality
              </button>
              <button 
                onClick={() => setActiveChart('uv')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeChart === 'uv' 
                    ? darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-600'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                UV Index
              </button>
            </div>
          </div>
          
          <div style={{ height: '280px' }} className="flex items-center justify-center">
            {activeChart === 'temperature' && chartData ? (
              <LineChart 
                data={chartData.temperatureTrend} 
                color="rgb(239, 68, 68)" 
                darkMode={darkMode}
              />
            ) : activeChart === 'airquality' && chartData ? (
              <BarChart 
                data={chartData.airQualityData} 
                color="rgb(59, 130, 246)" 
                darkMode={darkMode}
              />
            ) : activeChart === 'uv' && chartData ? (
              <BarChart 
                data={chartData.uvTrend} 
                color="rgb(251, 191, 36)" 
                darkMode={darkMode}
              />
            ) : (
              <div className={`flex flex-col items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="material-icons text-4xl mb-2 opacity-50">show_chart</span>
                <p className="text-sm">Loading chart data...</p>
              </div>
            )}
          </div>
        </div>

        {/* Global Insights - Compact Side Panel */}
        <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <span className="material-icons text-xl">public</span>
            </div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Global Insights
            </h3>
          </div>
          
          {/* Quick Global Stats */}
          <div className="space-y-3">
            {[
              { label: 'Global CO2 Level', value: '421.2 ppm', change: '+2.1%', trend: 'up', icon: 'co2' },
              { label: 'Ocean Temperature', value: '+1.2°C', change: '+0.3°', trend: 'up', icon: 'waves' },
              { label: 'Arctic Ice', value: '4.7M km²', change: '-12%', trend: 'down', icon: 'ac_unit' },
              { label: 'Forest Coverage', value: '31.2%', change: '-0.8%', trend: 'down', icon: 'forest' }
            ].map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`material-icons text-sm ${
                      insight.trend === 'up' ? 'text-red-500' : 'text-orange-500'
                    }`}>
                      {insight.icon}
                    </span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {insight.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {insight.value}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.trend === 'up' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {insight.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather & Alerts - Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Climate Alerts - Optimized */}
        <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <span className="material-icons text-xl">warning</span>
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Climate Alerts
              </h3>
            </div>
            <button className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              darkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}>
              View All
            </button>
          </div>
          <div className="space-y-4" style={{ minHeight: '320px' }}>
            {loading && !climateData ? (
              // Loading skeleton with fixed dimensions
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`} style={{ height: '80px' }}>
                    <div className="w-3 h-3 rounded-full mt-2 bg-gray-400 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-400 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-400 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-400 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentAlerts.length > 0 ? (
              // Real alerts data - no fallback
              <div className="space-y-4">
                {recentAlerts.slice(0, 5).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`flex items-start space-x-4 p-4 rounded-xl transition-colors hover:shadow-sm ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    style={{ minHeight: '80px' }}
                  >
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      alert.severity === 'High' || alert.severity === 'high' ? 'bg-red-500' : 
                      alert.severity === 'Medium' || alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {alert.type}
                        </h3>
                        <span className={`text-xs flex-shrink-0 ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {alert.time}
                        </span>
                      </div>
                      <p className={`text-sm mb-1 truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {alert.location}
                      </p>
                      <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {alert.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // No alerts - real data state only
              <div className={`flex flex-col items-center justify-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">No active alerts</p>
                <p className="text-sm mt-1 opacity-75">Weather conditions are normal</p>
              </div>
            )}
          </div>
        </div>

        {/* Weather Forecast - Optimized */}
        <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                <span className="material-icons text-xl">wb_sunny</span>
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Weather Forecast
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {forecastError && forecastError.includes('429') && (
                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                  Cached
                </span>
              )}
              <button className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                darkMode ? 'bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/50' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              }`}>
                7 Days
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {forecastLoading && forecast.length === 0 ? (
              // Optimized loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg animate-pulse ${
                  darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                    <div>
                      <div className="h-3 bg-gray-400 rounded w-12 mb-1"></div>
                      <div className="h-2 bg-gray-400 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-400 rounded w-12 mb-1"></div>
                    <div className="h-2 bg-gray-400 rounded w-8"></div>
                  </div>
                </div>
              ))
            ) : processedForecast && processedForecast.length > 0 ? (
              // Clean forecast cards with Material Icons
              processedForecast.slice(0, 5).map((day, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <span className="material-icons text-lg">wb_sunny</span>
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {day.condition}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {day.tempMax}°/{day.tempMin}°
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {day.precipitationProbability}% rain
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Error or no data
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                    d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                </svg>
                <p>Weather forecast data unavailable</p>
                <p className="text-sm mt-1 opacity-75">
                  {forecastError ? 'Try refreshing the page' : 'Loading forecast...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-800 border-gray-700' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Send Alert</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create new notification</p>
            </div>
          </button>
          
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>View Analytics</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Detailed climate data</p>
            </div>
          </button>
          
          <button className={`flex items-center space-x-3 p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Generate Report</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Export climate insights</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
