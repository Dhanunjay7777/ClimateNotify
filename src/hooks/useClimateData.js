import { useState, useEffect, useCallback } from 'react';
import climateApi from '../services/climateApi';

/**
 * Custom hook for managing climate data state
 */
export const useClimateData = (autoRefresh = false, refreshInterval = 300000) => { // 5 minutes default
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchClimateData = useCallback(async (forceRefresh = false) => {
    try {
      // Don't set loading if we have data and this isn't a force refresh
      if (!data || forceRefresh) {
        setLoading(true);
      }
      
      setError(null);
      
      const climateData = await climateApi.getAllClimateData();
      
      setData(climateData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch real-time climate data:', err);
      setError(err.message || 'Failed to fetch real-time climate data');
      
      // No fallback to mock data - show error state
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [data]);

  // Initial load
  useEffect(() => {
    fetchClimateData();
  }, []);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      fetchClimateData(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchClimateData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchClimateData(true);
  }, [fetchClimateData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
};

/**
 * Hook for individual weather data
 */
export const useWeatherData = (coordinates = null) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let coords = coordinates;
        if (!coords) {
          coords = await climateApi.getUserLocation();
        }
        
        const weatherData = await climateApi.getCurrentWeather(coords.lat, coords.lon);
        setWeather(weatherData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coordinates]);

  return { weather, loading, error };
};

/**
 * Hook for climate alerts
 */
export const useClimateAlerts = (limit = 10, autoRefresh = true) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const alertsData = await climateApi.getClimateAlerts(limit);
      setAlerts(alertsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Auto refresh alerts every 2 minutes
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAlerts();
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, fetchAlerts]);

  return { alerts, loading, error, refresh: fetchAlerts };
};

/**
 * Hook for global climate statistics
 */
export const useClimateStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [climateStats, co2Data] = await Promise.all([
          climateApi.getClimateStatistics(),
          climateApi.getGlobalCO2Data()
        ]);
        
        setStats({
          ...climateStats,
          co2: co2Data
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

/**
 * Hook for weather forecast with caching
 */
export const useWeatherForecast = (coordinates = null, days = 5, autoRefresh = true) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchForecast = useCallback(async () => {
    try {
      setError(null);
      
      let coords = coordinates;
      if (!coords) {
        coords = await climateApi.getUserLocation();
      }
      
      const forecastData = await climateApi.getWeatherForecast(coords.lat, coords.lon, days);
      setForecast(forecastData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch forecast:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coordinates, days]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  // Auto refresh forecast every hour to sync with cache refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchForecast();
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, [autoRefresh, fetchForecast]);

  return { 
    forecast, 
    loading, 
    error, 
    lastUpdated,
    refresh: fetchForecast 
  };
};

export default {
  useClimateData,
  useWeatherData,
  useClimateAlerts,
  useClimateStats,
  useWeatherForecast
};