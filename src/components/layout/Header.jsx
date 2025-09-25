import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="w-full px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Corner */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">ClimateNotify</span>
          </Link>

          {/* Center Navigation - Hidden on smaller screens */}
          <nav className="hidden lg:flex items-center space-x-1">
            <a href="#features" className="px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">Features</a>
            <a href="#about" className="px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">About</a>
            <a href="#contact" className="px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">Contact</a>
            <a href="#pricing" className="px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">Pricing</a>
          </nav>

          {/* Right Corner - Auth Buttons */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link 
                to="/login"
                className="px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                className="px-6 py-2.5 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <a href="#features" className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">Features</a>
                <a href="#about" className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">About</a>
                <a href="#contact" className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">Contact</a>
                <a href="#pricing" className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">Pricing</a>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 sm:hidden pt-4 border-t border-gray-200">
                <Link 
                  to="/login"
                  className="w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200 text-center"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="w-full px-6 py-3 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
