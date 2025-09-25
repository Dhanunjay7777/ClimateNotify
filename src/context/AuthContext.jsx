import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('climatenotify_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('climatenotify_user');
      }
    }
    setLoading(false);
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Basic validation (only check if fields are provided)
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Remove password length validation - let server handle authentication

      // Make API call to login endpoint
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Login successful
        const userData = {
          id: data.data.id,
          consumerID: data.data.consumerID,
          name: data.data.fullname,
          email: data.data.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.data.email}`,
          accessLevel: data.data.accessLevel,
          approvedStatus: data.data.approvedStatus,
          agreeTerms: data.data.agreeTerms,
          joinedAt: data.data.createdAt,
          lastLogin: data.data.lastLogin,
          role: data.data.accessLevel || 'user'
        };

        setUser(userData);
        localStorage.setItem('climatenotify_user', JSON.stringify(userData));
        return true;

      } else if (response.status === 403 && data.status === 'pending') {
        // Account pending approval
        throw new Error(data.message);
      } else {
        // Other errors (invalid credentials, etc.)
        throw new Error(data.message || 'Login failed');
      }

    } catch (err) {
      console.error('Login error:', err);
      if (err.message.includes('fetch')) {
        setError('Unable to connect to server. Please try again.');
      } else {
        setError(err.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!validateName(name)) {
        throw new Error('Name must be at least 2 characters long');
      }

      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, create user
      // In production, this would be a real API call
      const userData = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        joinedAt: new Date().toISOString(),
        role: 'user'
      };

      setUser(userData);
      localStorage.setItem('climatenotify_user', JSON.stringify(userData));

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('climatenotify_user');
  };

  const updateProfile = async (updates) => {
    if (!user) return false;

    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('climatenotify_user', JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      setError('Failed to update profile');
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    validateEmail,
    validatePassword,
    validateName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};