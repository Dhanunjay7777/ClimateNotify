import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopProfile from '../components/layout/TopProfile';
import OverviewDashboard from '../components/dashboard/OverviewDashboard';
import ClimateAnalytics from '../components/dashboard/ClimateAnalytics';
import AlertsManagement from '../components/dashboard/AlertsManagement';
import UserManagement from '../components/dashboard/UserManagement';
import ReportsSection from '../components/dashboard/ReportsSection';
import AppuserReports from '../components/dashboard/AppuserReports';
import SettingsPage from '../components/dashboard/SettingsPage';
import MessagingDashboard from '../components/dashboard/MessagingDashboard';
import ServicesManagement from '../components/dashboard/ServicesManagement';
import SMSNotificationDashboard from '../components/dashboard/SMSNotificationDashboard';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Initialize sidebar state from localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Initialize active section from localStorage
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem('activeSection');
    return saved || 'overview';
  });
  
  // Initialize dark mode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Save dark mode state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Base menu items available to all users
  const baseMenuItems = [
    { id: 'overview', name: 'Overview', icon: 'dashboard', description: 'Dashboard overview & analytics' },
    { id: 'analytics', name: 'Climate Analytics', icon: 'analytics', description: 'Detailed climate data analysis' },
    { id: 'alerts', name: 'Alert Management', icon: 'warning', description: 'Manage climate alerts' },
    { id: 'messaging', name: 'Push Notifications', icon: 'notifications_active', description: 'Send push notifications to users' },
    { id: 'reports', name: 'Reports', icon: 'trending_up', description: 'Analytics & insights' },
    { id: 'settings', name: 'Settings', icon: 'settings', description: 'Application settings' },
  ];

  // Admin-only menu items
  const adminMenuItems = [
    { id: 'users', name: 'User Management', icon: 'groups', description: 'Manage users & permissions' },
    { id: 'sms', name: 'SMS Notifications', icon: 'message', description: 'Send SMS alerts to users' },
    { id: 'services', name: 'Services Management', icon: 'cloud', description: 'Manage Render services' },
    { id: 'appuserreports', name: 'App User Reports', icon: 'database', description: 'View detailed user reports from MongoDB' },
  ];

  // Combine menu items based on user access level (admin users see additional options)
  const menuItems = (user?.role === 'admin' || user?.accessLevel === 'admin')
    ? [...baseMenuItems.slice(0, 4), ...adminMenuItems, ...baseMenuItems.slice(4)]
    : baseMenuItems;

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewDashboard darkMode={darkMode} />;
      
      case 'analytics':
        return <ClimateAnalytics darkMode={darkMode} />;
      
      case 'alerts':
        return <AlertsManagement darkMode={darkMode} />;
      
      case 'messaging':
        return <MessagingDashboard darkMode={darkMode} />;
      
      case 'users':
        return <UserManagement darkMode={darkMode} />;
      
      case 'sms':
        return <SMSNotificationDashboard darkMode={darkMode} />;
      
      case 'services':
        return <ServicesManagement darkMode={darkMode} />;
      
      case 'appuserreports':
        return <AppuserReports darkMode={darkMode} />;
      
      case 'reports':
        return <ReportsSection darkMode={darkMode} />;
      
      case 'settings':
        return <SettingsPage darkMode={darkMode} />;

      default:
        return <OverviewDashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItems}
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        navigate={navigate}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        // Mobile (< lg): Always full width, no margin (sidebar overlays)
        // Desktop (lg+): Adjust margin based on sidebar state
        sidebarOpen 
          ? 'lg:ml-64' // Desktop with expanded sidebar
          : 'lg:ml-16' // Desktop with collapsed sidebar
      }`}>
        {/* Top Profile Bar */}
        <TopProfile 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content Area */}
        <main className={`flex-1 p-4 sm:p-6 overflow-auto custom-scrollbar ${darkMode ? 'custom-scrollbar-dark' : ''}`}>
          <div className="animate-fade-in-up max-w-full">
            <div className="min-w-0 w-full">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;