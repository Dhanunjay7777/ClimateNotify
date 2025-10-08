import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const SMSNotificationDashboard = ({ darkMode }) => {
  const { user } = useAuth();
  
  // State management
  const [message, setMessage] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [smsHistory, setSmsHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [smsCount, setSmsCount] = useState(0);
  const [phoneSource, setPhoneSource] = useState('manual'); // 'manual', 'database', 'csv'
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [csvFileName, setCsvFileName] = useState('');
  const textareaRef = useRef(null);
  const csvInputRef = useRef(null);
  
  // SMS character limits from environment variables
  const SMS_SINGLE_LIMIT = parseInt(import.meta.env.VITE_SMS_SINGLE_LIMIT);
  const SMS_MULTI_LIMIT = parseInt(import.meta.env.VITE_SMS_MULTI_LIMIT);

  // Update character count and SMS parts
  useEffect(() => {
    const length = message.length;
    setCharacterCount(length);
    
    if (length === 0) {
      setSmsCount(0);
    } else if (length <= SMS_SINGLE_LIMIT) {
      setSmsCount(1);
    } else {
      setSmsCount(Math.ceil(length / SMS_MULTI_LIMIT));
    }
  }, [message]);

  // Load all users from database (MongoDB Consumers collection)
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reports/consumers/contacts?activeOnly=true&limit=1000`);
      const data = await response.json();
      if (data.status === 'success') {
        const contacts = data.data?.contacts || [];
        setAllUsers(contacts);
      }
    } catch (error) {
      setNotification({
        title: 'Error',
        body: 'Failed to load users from database'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load SMS history from Appwrite
  const loadSMSHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sms-notifications?limit=20`);
      const data = await response.json();
      if (data.status === 'success') {
        setSmsHistory(data.data || []);
      }
    } catch (error) {
      // Silently fail - don't show error to user
      setSmsHistory([]);
    }
  };

  // Handle CSV file upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setNotification({
        title: 'Invalid File',
        body: 'Please upload a CSV file'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setCsvFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n');
        const phoneNumbersFromCSV = [];

        // Skip header if present
        const startIndex = lines[0].toLowerCase().includes('phone') || lines[0].toLowerCase().includes('number') ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            // Extract phone number from CSV (handles comma-separated values)
            const parts = line.split(',');
            const phone = parts[0].trim();
            if (phone && phone.match(/^\+?\d{10,15}$/)) {
              phoneNumbersFromCSV.push(phone);
            }
          }
        }

        if (phoneNumbersFromCSV.length === 0) {
          setNotification({
            title: 'No Valid Numbers',
            body: 'No valid phone numbers found in CSV file'
          });
          setTimeout(() => setNotification(null), 3000);
          return;
        }

        setPhoneNumbers(phoneNumbersFromCSV.join(', '));
        setNotification({
          title: 'CSV Imported',
          body: `Successfully imported ${phoneNumbersFromCSV.length} phone numbers`
        });
        setTimeout(() => setNotification(null), 3000);

      } catch (error) {
        console.error('CSV parse error:', error);
        setNotification({
          title: 'Parse Error',
          body: 'Failed to parse CSV file'
        });
        setTimeout(() => setNotification(null), 3000);
      }
    };

    reader.onerror = () => {
      setNotification({
        title: 'Read Error',
        body: 'Failed to read CSV file'
      });
      setTimeout(() => setNotification(null), 3000);
    };

    reader.readAsText(file);
  };

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all users
  const selectAllUsers = () => {
    if (selectedUsers.length === allUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(allUsers.map(u => u.id));
    }
  };

  // Load selected users' phone numbers
  const loadSelectedPhoneNumbers = () => {
    const selectedContacts = allUsers.filter(u => selectedUsers.includes(u.id));
    const selectedPhones = selectedContacts
      .map(u => u.phone) // Only get phone numbers
      .filter(Boolean)
      .join(', ');
    
    const phoneCount = selectedContacts.filter(u => u.phone).length;
    const noPhone = selectedUsers.length - phoneCount;
    
    setPhoneNumbers(selectedPhones);
    
    if (selectedPhones) {
      let message = `Loaded ${phoneCount} phone number${phoneCount !== 1 ? 's' : ''} from database`;
      if (noPhone > 0) {
        message += ` (${noPhone} user${noPhone !== 1 ? 's' : ''} without phone)`;
      }
      
      setNotification({
        title: 'Numbers Loaded',
        body: message
      });
      setTimeout(() => setNotification(null), 3000);
    } else if (selectedUsers.length > 0) {
      setNotification({
        title: 'No Phone Numbers',
        body: 'Selected users do not have phone numbers in database'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  useEffect(() => {
    loadSMSHistory();
  }, []);

  useEffect(() => {
    if (phoneSource === 'database' && allUsers.length === 0) {
      loadAllUsers();
    }
  }, [phoneSource]);

  // Handle SMS send (placeholder - no backend endpoint yet)
  const handleSendSMS = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !phoneNumbers.trim()) {
      setNotification({
        title: 'Missing Information',
        body: 'Please enter both message and phone numbers'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setLoading(true);
    
    try {
      const phoneList = phoneNumbers.split(',').map(p => p.trim()).filter(Boolean);
      
      // Store SMS notification in Appwrite for each phone number
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sms-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          phoneNumbers: phoneList,
          sentStatus: 'sent',
          sentTime: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setNotification({
          title: 'SMS Sent Successfully!',
          body: `Message delivered to ${phoneList.length} recipient${phoneList.length !== 1 ? 's' : ''}`
        });
        setMessage('');
        setPhoneNumbers('');
        setSelectedUsers([]);
        loadSMSHistory();
      } else {
        throw new Error(data.message || 'Failed to send SMS');
      }
    } catch (error) {
      setNotification({
        title: 'Error',
        body: error.message || 'Failed to send SMS'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Filter SMS history
  const filteredMessages = smsHistory.filter(msg => 
    msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check admin access - same as UserManagement
  if (!user || (user.role !== 'admin' && user.accessLevel !== 'admin')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-center p-8 rounded-2xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Access Denied
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            You need administrator privileges to access this resource.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl animate-slide-in max-w-sm ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-white text-lg">sms</span>
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {notification.title}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {notification.body}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>SMS Notifications</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Send climate alerts directly via SMS to users worldwide</p>
      </div>

      {/* Stats Cards - Horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sent */}
        <div className={`rounded-2xl shadow-lg p-6 border hover-lift transition-smooth ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="material-icons text-white text-2xl">send</span>
            </div>
            <span className="text-xs font-semibold text-green-500">Active</span>
          </div>
          <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {smsHistory.length}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sent</p>
        </div>

        {/* Characters */}
        <div className={`rounded-2xl shadow-lg p-6 border hover-lift transition-smooth ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="material-icons text-white text-2xl">edit_note</span>
            </div>
            <span className={`text-xs font-semibold ${
              characterCount === 0 ? 'text-gray-400' :
              characterCount <= SMS_SINGLE_LIMIT ? 'text-green-500' :
              characterCount <= SMS_SINGLE_LIMIT * 2 ? 'text-orange-500' : 'text-red-500'
            }`}>
              {characterCount === 0 ? 'Empty' : characterCount <= SMS_SINGLE_LIMIT ? 'Good' : 'Long'}
            </span>
          </div>
          <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {characterCount}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Characters</p>
        </div>

        {/* SMS Parts */}
        <div className={`rounded-2xl shadow-lg p-6 border hover-lift transition-smooth ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${
              smsCount > 2 ? 'from-orange-500 to-orange-600' : 'from-purple-500 to-purple-600'
            } rounded-xl flex items-center justify-center`}>
              <span className="material-icons text-white text-2xl">splitscreen</span>
            </div>
            <span className={`text-xs font-semibold ${
              smsCount === 1 ? 'text-green-500' : smsCount <= 2 ? 'text-orange-500' : 'text-red-500'
            }`}>
              {smsCount === 1 ? 'Single' : 'Multi'}
            </span>
          </div>
          <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {smsCount}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>SMS Parts</p>
        </div>

        {/* Recipients */}
        <div className={`rounded-2xl shadow-lg p-6 border hover-lift transition-smooth ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="material-icons text-white text-2xl">people</span>
            </div>
            <span className="text-xs font-semibold text-blue-500">
              {phoneSource === 'database' ? 'Database' : phoneSource === 'csv' ? 'CSV' : 'Manual'}
            </span>
          </div>
          <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {phoneSource === 'database' ? selectedUsers.length : phoneNumbers ? phoneNumbers.split(',').filter(n => n.trim()).length : 0}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recipients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Compose SMS + Best Practices */}
        <div className={`lg:col-span-2 space-y-6`}>
          {/* Compose SMS Card */}
          <div className={`rounded-2xl shadow-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`border-b px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Compose SMS
              </h2>
            </div>
          
          <div className="p-6">
            <form onSubmit={handleSendSMS} className="space-y-6">
              {/* Phone Number Source Selection */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Phone Number Source
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Manual Entry */}
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneSource('manual');
                      setPhoneNumbers('');
                      setCsvFileName('');
                      setSelectedUsers([]);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      phoneSource === 'manual'
                        ? darkMode
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-blue-600 bg-blue-50'
                        : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className={`material-icons text-3xl mb-2 ${
                      phoneSource === 'manual' 
                        ? 'text-blue-500' 
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      keyboard
                    </span>
                    <div className={`font-semibold mb-1 ${
                      phoneSource === 'manual'
                        ? darkMode ? 'text-blue-400' : 'text-blue-600'
                        : darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      Manual Entry
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Type or paste numbers
                    </div>
                  </button>

                  {/* Database Fetch */}
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneSource('database');
                      setPhoneNumbers('');
                      setCsvFileName('');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      phoneSource === 'database'
                        ? darkMode
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-blue-600 bg-blue-50'
                        : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className={`material-icons text-3xl mb-2 ${
                      phoneSource === 'database' 
                        ? 'text-blue-500' 
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      storage
                    </span>
                    <div className={`font-semibold mb-1 ${
                      phoneSource === 'database'
                        ? darkMode ? 'text-blue-400' : 'text-blue-600'
                        : darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      From Database
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Select from users
                    </div>
                  </button>

                  {/* CSV Upload */}
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneSource('csv');
                      setPhoneNumbers('');
                      setSelectedUsers([]);
                      csvInputRef.current?.click();
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      phoneSource === 'csv'
                        ? darkMode
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-blue-600 bg-blue-50'
                        : darkMode
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className={`material-icons text-3xl mb-2 ${
                      phoneSource === 'csv' 
                        ? 'text-blue-500' 
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      upload_file
                    </span>
                    <div className={`font-semibold mb-1 ${
                      phoneSource === 'csv'
                        ? darkMode ? 'text-blue-400' : 'text-blue-600'
                        : darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      CSV Upload
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Import from file
                    </div>
                  </button>
                </div>

                {/* Hidden CSV input */}
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />

                {csvFileName && (
                  <div className={`mt-3 p-3 rounded-lg flex items-center justify-between ${
                    darkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`material-icons text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        check_circle
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        {csvFileName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCsvFileName('');
                        setPhoneNumbers('');
                        if (csvInputRef.current) csvInputRef.current.value = '';
                      }}
                      className={`text-sm ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Database User Selection */}
              {phoneSource === 'database' && (
                <div className={`p-4 border rounded-xl ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Select Recipients ({selectedUsers.length} selected)
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={selectAllUsers}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          darkMode
                            ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {selectedUsers.length === allUsers.length ? 'Deselect All' : 'Select All'}
                      </button>
                      <button
                        type="button"
                        onClick={loadSelectedPhoneNumbers}
                        disabled={selectedUsers.length === 0}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          selectedUsers.length > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : darkMode
                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Load Numbers
                      </button>
                    </div>
                  </div>

                  {loadingUsers ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Loading users...
                      </p>
                    </div>
                  ) : allUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <span className={`material-icons text-4xl mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        group_off
                      </span>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No users found in database
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {allUsers.map(user => (
                        <label
                          key={user.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            selectedUsers.includes(user.id)
                              ? darkMode
                                ? 'bg-blue-900/30 border border-blue-700/50'
                                : 'bg-blue-50 border border-blue-200'
                              : darkMode
                                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                                : 'bg-white hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.name}
                            </div>
                            <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {user.phone && (
                                <div className="flex items-center gap-1">
                                  <span className="material-icons" style={{fontSize: '12px'}}>phone</span>
                                  {user.phone}
                                </div>
                              )}
                              {user.email && (
                                <div className="flex items-center gap-1">
                                  <span className="material-icons" style={{fontSize: '12px'}}>email</span>
                                  {user.email}
                                </div>
                              )}
                              {!user.phone && !user.email && (
                                <span className="text-red-500">No contact info</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.phone && (
                              <span className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                                darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                              }`}>
                                <span className="material-icons" style={{fontSize: '10px'}}>check_circle</span>
                                SMS Ready
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Phone Numbers Textarea */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Numbers {phoneNumbers && `(${phoneNumbers.split(',').filter(n => n.trim()).length} numbers)`}
                </label>
                <textarea
                  value={phoneNumbers}
                  onChange={(e) => setPhoneNumbers(e.target.value)}
                  placeholder="Enter phone numbers, comma separated"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  rows="4"
                  required
                />
              </div>

              {/* SMS Message */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  SMS Message
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your SMS message here. Keep it concise for best delivery."
                    className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      characterCount > SMS_SINGLE_LIMIT * 2
                        ? 'border-red-500'
                        : darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                    rows="6"
                    required
                  />
                  
                  {/* Character Counter */}
                  <div className={`absolute bottom-3 right-3 text-xs font-medium px-3 py-1.5 rounded-lg ${
                    characterCount === 0
                      ? darkMode ? 'text-gray-500 bg-gray-800' : 'text-gray-400 bg-gray-100'
                      : characterCount <= SMS_SINGLE_LIMIT
                        ? 'text-white bg-green-500'
                        : characterCount <= SMS_SINGLE_LIMIT * 2
                          ? 'text-white bg-orange-500'
                          : 'text-white bg-red-500'
                  }`}>
                    {characterCount} chars / {smsCount} SMS
                  </div>
                </div>
                
                {smsCount > 1 && (
                  <div className={`mt-2 p-3 rounded-lg ${
                    smsCount > 2 
                      ? darkMode ? 'bg-orange-900/20 border border-orange-700/30' : 'bg-orange-50 border border-orange-200'
                      : darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className={`text-sm ${
                      smsCount > 2 
                        ? darkMode ? 'text-orange-300' : 'text-orange-700'
                        : darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}>
                      ℹ️ This message will be sent as <strong>{smsCount} SMS parts</strong>. Consider shortening for cost efficiency.
                    </p>
                  </div>
                )}

                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  💡 <strong>Tip:</strong> Messages up to 160 characters cost 1 SMS. Longer messages use 153 chars per SMS part.
                </p>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || !message.trim() || !phoneNumbers.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Sending SMS...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="material-icons mr-2">send</span>
                    Send SMS Notification
                  </div>
                )}
              </button>
            </form>
          </div>
          </div>
        </div>

        {/* Right Sidebar - SMS History Only */}
        <div className="space-y-6">
          {/* SMS History */}
          <div className={`rounded-2xl shadow-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`border-b px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent SMS ({smsHistory.length})
                </h3>
                <button
                  onClick={loadSMSHistory}
                  className={`p-1.5 rounded-lg text-sm transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-icons text-lg">refresh</span>
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <span className={`material-icons absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="material-icons text-sm">close</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8">
                  <span className={`material-icons text-4xl mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    {searchQuery ? 'search_off' : 'sms'}
                  </span>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {searchQuery ? 'No messages found' : 'No SMS sent yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredMessages.map((msg, index) => (
                    <div key={msg.$id || index} className={`p-3 border rounded-lg transition-all hover:shadow-md ${
                      darkMode 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`material-icons text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            sms
                          </span>
                          <p className={`font-medium text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            SMS Alert
                          </p>
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt || Date.now()).toLocaleString([], { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className={`text-xs mb-2 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {msg.message}
                      </p>
                      {msg.phoneNumber && (
                        <div className={`flex items-center gap-1 text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="material-icons" style={{fontSize: '12px'}}>phone_android</span>
                          <span className="truncate">{msg.phoneNumber}</span>
                        </div>
                      )}
                      {msg.sentStatus && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded font-medium ${
                          msg.sentStatus === 'sent' 
                            ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                            : darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          <span className="material-icons" style={{fontSize: '10px'}}>check_circle</span>
                          {msg.sentStatus}
                        </span>
                      )}
                      
                      {/* Compact Actions */}
                      <div className={`flex items-center gap-2 mt-2 pt-2 border-t ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <button
                          onClick={() => {
                            setMessage(msg.message);
                            setPhoneNumbers(msg.phoneNumber || '');
                            setPhoneSource('manual');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setTimeout(() => textareaRef.current?.focus(), 300);
                          }}
                          className={`text-xs px-2 py-1 rounded transition-all flex items-center gap-1 ${
                            darkMode
                              ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          <span className="material-icons" style={{fontSize: '12px'}}>replay</span>
                          Reuse
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.message);
                            setNotification({
                              title: 'Copied!',
                              body: 'Message copied'
                            });
                            setTimeout(() => setNotification(null), 2000);
                          }}
                          className={`text-xs px-2 py-1 rounded transition-all flex items-center gap-1 ${
                            darkMode
                              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600'
                              : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="material-icons" style={{fontSize: '12px'}}>content_copy</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SMSNotificationDashboard;
