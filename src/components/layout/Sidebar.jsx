import React from 'react';
import { useLocation } from 'react-router-dom';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  menuItems,
  user,
  onLogout,
  darkMode,
  setDarkMode,
}) => {
  const location = useLocation();

  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10z" />
        </svg>
      ),
      analytics: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      notifications_active: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      groups: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      trending_up: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      database: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    };
    return icons[iconName] || icons.dashboard;
  };

  return (
    <>
      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full transform transition-all duration-300 ease-in-out shadow-lg border-r ${
        // Mobile behavior: slide in/out from left
        // Desktop behavior: always visible, width changes
        sidebarOpen 
          ? 'translate-x-0 w-64 z-50' 
          : 'w-16 -translate-x-full lg:translate-x-0 lg:z-40 z-50'
      } ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center px-4 py-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } ${!sidebarOpen ? 'justify-center lg:justify-center' : ''}`}>
          {!sidebarOpen ? (
            // Only show expand button on desktop when collapsed
            <button
              onClick={() => setSidebarOpen(true)}
              className={`hidden lg:flex p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Expand Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className={`text-lg font-semibold truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ClimateNotify
                </h1>
                <p className={`text-xs truncate ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Climate Dashboard
                </p>
              </div>
              {/* Toggle Button - Show X on mobile, arrow on desktop */}
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title="Collapse Sidebar"
              >
                {/* Mobile: X icon, Desktop: Left arrow */}
                <svg className="w-4 h-4 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg className="w-4 h-4 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 space-y-1 ${sidebarOpen ? 'overflow-y-auto px-2' : 'overflow-hidden px-1 lg:px-1'}`}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                sidebarOpen ? 'px-3 py-2.5' : 'px-2 py-3 justify-center lg:justify-center'
              } ${
                activeSection === item.id
                  ? darkMode 
                    ? 'bg-blue-900/50 text-blue-100 border border-blue-800/50' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200/50'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent'
                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent'
              }`}
              title={!sidebarOpen ? item.name : ''}
            >
              <span className={`flex-shrink-0 ${
                activeSection === item.id 
                  ? 'text-current' 
                  : darkMode 
                    ? 'text-gray-400 group-hover:text-gray-200' 
                    : 'text-gray-400 group-hover:text-gray-600'
              } ${sidebarOpen ? '' : 'mx-auto lg:mx-auto'}`}>
                {getIcon(item.icon)}
              </span>
              {sidebarOpen && (
                <span className="ml-3 truncate text-left">{item.name}</span>
              )}
              {/* Tooltip for collapsed state - only on desktop */}
              {!sidebarOpen && (
                <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } ${sidebarOpen ? 'p-4' : 'p-2 lg:p-2'}`}>
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center text-sm font-medium rounded-lg transition-all duration-200 group relative ${
              sidebarOpen ? 'px-3 py-2' : 'px-2 py-3 justify-center lg:justify-center'
            } ${
              darkMode 
                ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent' 
                : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent'
            }`}
            title={!sidebarOpen ? (darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode') : ''}
          >
            <span className={`flex-shrink-0 transition-colors ${
              darkMode 
                ? 'text-gray-400 group-hover:text-gray-200' 
                : 'text-gray-400 group-hover:text-gray-600'
            } ${sidebarOpen ? '' : 'mx-auto lg:mx-auto'}`}>
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </span>
            {sidebarOpen && (
              <span className="ml-3 text-left">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
            {/* Tooltip for collapsed state - only on desktop */}
            {!sidebarOpen && (
              <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;