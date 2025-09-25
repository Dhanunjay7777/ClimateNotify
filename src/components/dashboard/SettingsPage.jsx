import React, { useState } from 'react';

const SettingsPage = ({ darkMode }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      temperatureUnit: 'celsius',
      theme: 'light'
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false,
      alertFrequency: 'immediate',
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '06:00'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      loginNotifications: true,
      passwordExpiry: '90'
    },
    api: {
      rateLimiting: true,
      apiVersion: 'v2',
      webhookUrl: '',
      dataRetention: '365'
    }
  });

  const sections = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'api', label: 'API Settings', icon: 'code' },
    { id: 'data', label: 'Data Management', icon: 'database' },
    { id: 'integrations', label: 'Integrations', icon: 'link' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bell: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      shield: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      code: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      database: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      link: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    };
    return icons[iconName] || icons.settings;
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>General Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Language</label>
            <select 
              value={settings.general.language}
              onChange={(e) => updateSetting('general', 'language', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Timezone</label>
            <select 
              value={settings.general.timezone}
              onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date Format</label>
            <select 
              value={settings.general.dateFormat}
              onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Temperature Unit</label>
            <select 
              value={settings.general.temperatureUnit}
              onChange={(e) => updateSetting('general', 'temperatureUnit', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
              <option value="kelvin">Kelvin (K)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className={`text-md font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Theme</h4>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={settings.general.theme === 'light'}
              onChange={(e) => updateSetting('general', 'theme', e.target.value)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Light</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={settings.general.theme === 'dark'}
              onChange={(e) => updateSetting('general', 'theme', e.target.value)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Dark</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="theme"
              value="auto"
              checked={settings.general.theme === 'auto'}
              onChange={(e) => updateSetting('general', 'theme', e.target.value)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Auto</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notification Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Alerts</span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Receive climate alerts via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.emailAlerts}
              onChange={(e) => updateSetting('notifications', 'emailAlerts', e.target.checked)}
              className={`h-5 w-5 text-blue-600 focus:ring-blue-500 rounded ${
                darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              }`}
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Push Notifications</span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Browser push notifications for urgent alerts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
              className={`h-5 w-5 text-blue-600 focus:ring-blue-500 rounded ${
                darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              }`}
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>SMS Alerts</span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Text message notifications for critical events</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.smsAlerts}
              onChange={(e) => updateSetting('notifications', 'smsAlerts', e.target.checked)}
              className={`h-5 w-5 text-blue-600 focus:ring-blue-500 rounded ${
                darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              }`}
            />
          </label>
        </div>
      </div>
      
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Alert Frequency</label>
        <select 
          value={settings.notifications.alertFrequency}
          onChange={(e) => updateSetting('notifications', 'alertFrequency', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="immediate">Immediate</option>
          <option value="hourly">Hourly Digest</option>
          <option value="daily">Daily Summary</option>
          <option value="weekly">Weekly Report</option>
        </select>
      </div>
      
      <div>
        <label className="flex items-center justify-between mb-4">
          <div>
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quiet Hours</span>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Disable notifications during specified hours</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications.quietHours}
            onChange={(e) => updateSetting('notifications', 'quietHours', e.target.checked)}
            className={`h-5 w-5 text-blue-600 focus:ring-blue-500 rounded ${
              darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
            }`}
          />
        </label>
        
        {settings.notifications.quietHours && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Start Time</label>
              <input
                type="time"
                value={settings.notifications.quietStart}
                onChange={(e) => updateSetting('notifications', 'quietStart', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>End Time</label>
              <input
                type="time"
                value={settings.notifications.quietEnd}
                onChange={(e) => updateSetting('notifications', 'quietEnd', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Security Settings</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Two-Factor Authentication</span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add an extra layer of security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
              className={`h-5 w-5 text-blue-600 focus:ring-blue-500 rounded ${
                darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              }`}
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Login Notifications</span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get notified when someone logs into your account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.security.loginNotifications}
              onChange={(e) => updateSetting('security', 'loginNotifications', e.target.checked)}
              className={`h-5 w-5 text-blue-600 focus:ring-blue-500 rounded ${
                darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              }`}
            />
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Session Timeout (minutes)</label>
          <select 
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="480">8 hours</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password Expiry (days)</label>
          <select 
            value={settings.security.passwordExpiry}
            onChange={(e) => updateSetting('security', 'passwordExpiry', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="365">1 year</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>
      
      <div className={`border rounded-lg p-4 ${
        darkMode 
          ? 'bg-yellow-900/20 border-yellow-800' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex">
          <svg className={`w-5 h-5 mt-0.5 ${
            darkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="ml-3">
            <h4 className={`text-sm font-medium ${
              darkMode ? 'text-yellow-300' : 'text-yellow-800'
            }`}>Security Recommendation</h4>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-yellow-400' : 'text-yellow-700'
            }`}>
              We recommend enabling two-factor authentication and setting a session timeout of 30 minutes or less for enhanced security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>API Configuration</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Rate Limiting</span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enable API rate limiting for security</p>
            </div>
            <input
              type="checkbox"
              checked={settings.api.rateLimiting}
              onChange={(e) => updateSetting('api', 'rateLimiting', e.target.checked)}
              className={`h-5 w-5 text-blue-600 focus:ring-blue-500 rounded ${
                darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              }`}
            />
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>API Version</label>
          <select 
            value={settings.api.apiVersion}
            onChange={(e) => updateSetting('api', 'apiVersion', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="v1">Version 1.0</option>
            <option value="v2">Version 2.0</option>
            <option value="v3">Version 3.0 (Beta)</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data Retention (days)</label>
          <select 
            value={settings.api.dataRetention}
            onChange={(e) => updateSetting('api', 'dataRetention', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="365">1 year</option>
            <option value="730">2 years</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Webhook URL</label>
        <input
          type="url"
          value={settings.api.webhookUrl}
          onChange={(e) => updateSetting('api', 'webhookUrl', e.target.value)}
          placeholder="https://your-webhook-endpoint.com"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Optional: Receive real-time data updates via webhook</p>
      </div>
      
      <div className={`border rounded-lg p-4 ${
        darkMode 
          ? 'bg-blue-900/20 border-blue-800' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <h4 className={`text-sm font-medium mb-2 ${
          darkMode ? 'text-blue-300' : 'text-blue-800'
        }`}>API Keys</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                darkMode ? 'text-blue-400' : 'text-blue-700'
              }`}>Production Key</p>
              <p className={`text-xs font-mono ${
                darkMode ? 'text-blue-500' : 'text-blue-600'
              }`}>••••••••••••••••••••••••••••••••</p>
            </div>
            <button className={`text-sm font-medium transition-colors ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              Regenerate
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                darkMode ? 'text-blue-400' : 'text-blue-700'
              }`}>Test Key</p>
              <p className={`text-xs font-mono ${
                darkMode ? 'text-blue-500' : 'text-blue-600'
              }`}>••••••••••••••••••••••••••••••••</p>
            </div>
            <button className={`text-sm font-medium transition-colors ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'api':
        return renderAPISettings();
      case 'data':
        return (
          <div className="text-center py-12">
            <svg className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <h3 className={`text-lg font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Data Management Settings</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Configure data backup, export, and deletion preferences</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Coming Soon
            </button>
          </div>
        );
      case 'integrations':
        return (
          <div className="text-center py-12">
            <svg className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 className={`text-lg font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Third-Party Integrations</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Connect with external services and platforms</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Coming Soon
            </button>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your account preferences and system configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? darkMode ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={activeSection === section.id 
                  ? darkMode ? 'text-blue-400' : 'text-blue-600' 
                  : darkMode ? 'text-gray-500' : 'text-gray-400'
                }>
                  {getIcon(section.icon)}
                </span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-6`}>
            {renderContent()}
            
            {/* Save Button */}
            <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Changes are automatically saved as you update them.
                </p>
                <div className="flex space-x-3">
                  <button className={`px-4 py-2 border rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}>
                    Reset to Defaults
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Export Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;