// Climate Data Service using Visual Crossing Weather API
// Visual Crossing Weather API: Free tier provides 1000 requests/day

class ClimateDataService {
  constructor() {
    // Using free API key - replace with your actual key in .env
    this.visualCrossingApiKey = import.meta.env.VITE_VISUAL_CROSSING_API_KEY || 'YOUR_VISUAL_CROSSING_KEY';
    
    this.visualCrossingBaseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
    
    // API key validation
    this.isConfigured = this.visualCrossingApiKey !== 'YOUR_VISUAL_CROSSING_KEY';
  }

  // Get region coordinates
  getRegionCoordinates(region) {
    const regionCoords = {
      global: { lat: 0, lon: 0, name: 'Global' },
      north_america: { lat: 45, lon: -100, name: 'North America' },
      europe: { lat: 54.5, lon: 15.2, name: 'Europe' },
      asia: { lat: 35, lon: 100, name: 'Asia' },
      south_america: { lat: -8.7832, lon: -55.4915, name: 'South America' },
      africa: { lat: -8.7832, lon: 34.5085, name: 'Africa' },
      oceania: { lat: -25.2744, lon: 133.7751, name: 'Oceania' }
    };
    return regionCoords[region] || regionCoords.global;
  }

  // Calculate date range based on period
  getDateRange(period) {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate;

    switch (period) {
      case 'daily':
        startDate = new Date(now - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'weekly':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'monthly':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'quarterly':
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'yearly':
        startDate = new Date(now - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      default:
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    return { startDate, endDate };
  }

  // Fetch weather data from Visual Crossing (includes historical and current)
  async fetchWeatherData(region, period) {
    try {
      const coords = this.getRegionCoordinates(region);
      const { startDate, endDate } = this.getDateRange(period);
      
      // Visual Crossing can provide both historical and current data in one call
      const url = `${this.visualCrossingBaseUrl}/${coords.lat},${coords.lon}/${startDate}/${endDate}?key=${this.visualCrossingApiKey}&include=days,current&elements=temp,tempmax,tempmin,humidity,precip,windspeed,pressure,visibility,conditions,feelslike`;

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Visual Crossing API Error:', response.status, errorText);
        throw new Error(`Visual Crossing API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Extract current weather from the latest day or currentConditions
      const currentData = data.currentConditions || data.days[data.days.length - 1];
      
      return {
        location: coords.name,
        coordinates: { lat: coords.lat, lon: coords.lon },
        period: { start: startDate, end: endDate },
        current: {
          temperature: currentData.temp,
          feelsLike: currentData.feelslike || currentData.temp,
          humidity: currentData.humidity,
          pressure: currentData.pressure,
          windSpeed: currentData.windspeed,
          visibility: currentData.visibility,
          conditions: currentData.conditions,
        },
        historical: data.days.map(day => ({
          date: day.datetime,
          temperature: {
            avg: day.temp,
            max: day.tempmax,
            min: day.tempmin
          },
          humidity: day.humidity,
          precipitation: day.precip || 0,
          windSpeed: day.windspeed,
          pressure: day.pressure,
          visibility: day.visibility,
          conditions: day.conditions
        }))
      };
    } catch (error) {
      console.error('Weather API Error:', error.message);
      // Return mock data for demonstration
      return this.getMockWeatherData(region, period);
    }
  }

  // Calculate temperature trends
  calculateTemperatureTrends(weatherData) {
    const temperatures = weatherData.historical.map(d => d.temperature.avg);
    const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    
    // Simple linear trend calculation
    const trend = temperatures.length > 1 
      ? (temperatures[temperatures.length - 1] - temperatures[0]) / temperatures.length
      : 0;

    return {
      average: parseFloat(avgTemp.toFixed(1)),
      trend: parseFloat(trend.toFixed(2)),
      max: Math.max(...temperatures),
      min: Math.min(...temperatures)
    };
  }

  // Calculate precipitation patterns
  calculatePrecipitationPatterns(weatherData) {
    const precipData = weatherData.historical.map(d => d.precipitation);
    const totalPrecip = precipData.reduce((sum, precip) => sum + precip, 0);
    const avgPrecip = totalPrecip / precipData.length;
    
    const rainyDays = precipData.filter(precip => precip > 0).length;

    return {
      total: parseFloat(totalPrecip.toFixed(2)),
      average: parseFloat(avgPrecip.toFixed(2)),
      rainyDays,
      maxDaily: Math.max(...precipData)
    };
  }

  // Identify extreme weather events with proper validation
  identifyExtremeEvents(weatherData) {
    const events = [];
    
    if (!weatherData.historical || !Array.isArray(weatherData.historical)) {
      return events;
    }
    
    weatherData.historical.forEach((day, index) => {
      // Validate day data
      if (!day || !day.date || !day.temperature) {
        return;
      }
      
      // Extreme temperature (very hot or cold) - with proper validation
      const maxTemp = parseFloat(day.temperature.max);
      const minTemp = parseFloat(day.temperature.min);
      
      if (!isNaN(maxTemp) && maxTemp > 35) {
        events.push({
          type: 'Extreme Heat',
          date: day.date,
          value: parseFloat(maxTemp.toFixed(1)),
          unit: '°C',
          severity: maxTemp > 40 ? 'High' : 'Medium'
        });
      }
      
      if (!isNaN(minTemp) && minTemp < -10) {
        events.push({
          type: 'Extreme Cold',
          date: day.date,
          value: parseFloat(minTemp.toFixed(1)),
          unit: '°C',
          severity: minTemp < -20 ? 'High' : 'Medium'
        });
      }

      // Heavy precipitation - with validation
      const precipitation = parseFloat(day.precipitation || 0);
      if (!isNaN(precipitation) && precipitation > 25) {
        events.push({
          type: 'Heavy Rain',
          date: day.date,
          value: parseFloat(precipitation.toFixed(1)),
          unit: 'mm',
          severity: precipitation > 50 ? 'High' : 'Medium'
        });
      }

      // High winds - with validation
      const windSpeed = parseFloat(day.windSpeed || 0);
      if (!isNaN(windSpeed) && windSpeed > 50) {
        events.push({
          type: 'High Winds',
          date: day.date,
          value: parseFloat(windSpeed.toFixed(1)),
          unit: 'km/h',
          severity: windSpeed > 80 ? 'High' : 'Medium'
        });
      }
      
      // Severe weather conditions
      if (day.conditions && typeof day.conditions === 'string') {
        const condition = day.conditions.toLowerCase();
        if (condition.includes('storm') || condition.includes('hurricane') || condition.includes('tornado')) {
          events.push({
            type: 'Severe Weather',
            date: day.date,
            value: condition,
            unit: '',
            severity: 'High'
          });
        }
      }
    });

    // Sort events by date and limit to most recent/severe
    return events
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20); // Limit to 20 most recent events
  }



  getMockWeatherData(region, period) {
    const coords = this.getRegionCoordinates(region);
    const { startDate, endDate } = this.getDateRange(period);
    
    // Generate mock historical data
    const days = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        date: d.toISOString().split('T')[0],
        temperature: {
          avg: 20 + Math.random() * 10,
          max: 25 + Math.random() * 10,
          min: 15 + Math.random() * 5
        },
        humidity: 50 + Math.random() * 40,
        precipitation: Math.random() * 10,
        windSpeed: 10 + Math.random() * 20,
        pressure: 1013 + Math.random() * 30,
        visibility: 8 + Math.random() * 2,
        conditions: ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain'][Math.floor(Math.random() * 4)]
      });
    }

    return {
      location: coords.name,
      coordinates: { lat: coords.lat, lon: coords.lon },
      period: { start: startDate, end: endDate },
      current: {
        temperature: 22.5,
        feelsLike: 24.1,
        humidity: 65,
        pressure: 1015,
        windSpeed: 12,
        visibility: 10,
        conditions: 'partly cloudy'
      },
      historical: days
    };
  }

  // Main method to generate climate report data
  async generateClimateReportData(config) {
    const { region, period, type } = config;

    try {
      // Fetch data from Visual Crossing (includes both historical and current)
      const weatherData = await this.fetchWeatherData(region, period);

      // Process data based on report type
      const reportData = {
        metadata: {
          region: weatherData.location,
          period: weatherData.period,
          generatedAt: new Date().toISOString(),
          type
        },
        current: weatherData.current,
        historical: weatherData.historical
      };

      // Add specific analysis based on report type
      switch (type) {
        case 'temperature':
          reportData.analysis = {
            temperatureTrends: this.calculateTemperatureTrends(weatherData)
          };
          break;
          
        case 'precipitation':
          reportData.analysis = {
            precipitationPatterns: this.calculatePrecipitationPatterns(weatherData)
          };
          break;
          
        case 'extreme':
          reportData.analysis = {
            extremeEvents: this.identifyExtremeEvents(weatherData)
          };
          break;
          
        case 'comprehensive':
        default:
          reportData.analysis = {
            temperatureTrends: this.calculateTemperatureTrends(weatherData),
            precipitationPatterns: this.calculatePrecipitationPatterns(weatherData),
            extremeEvents: this.identifyExtremeEvents(weatherData)
          };
          break;
      }

      return reportData;
    } catch (error) {
      console.error('Error generating climate report data:', error);
      throw error;
    }
  }
}

export default new ClimateDataService();