import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const MessagingDashboard = ({ darkMode }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Emoji categories
  const emojiCategories = {
    climate: {
      name: 'Climate & Weather',
      emojis: ['🌍', '🌎', '🌏', '🌡️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☀️', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🔥', '💧', '🌊', '❗', '⚡']
    },
    nature: {
      name: 'Nature & Plants',
      emojis: ['🌱', '🌲', '🌳', '🌴', '🌵', '🌿', '☘️', '🍀', '🌾', '🌻', '🌺', '🌸', '🌼', '🌷', '🏔️', '⛰️', '🗻', '🌋', '🏕️', '🏞️']
    },
    alerts: {
      name: 'Alerts & Warnings',
      emojis: ['🚨', '⚠️', '❗', '❌', '✅', '🔔', '📢', '📣', '🆘', '🚯', '⛔', '🔴', '🟠', '🟡', '🔵', '🟢', '🟣']
    },
    reactions: {
      name: 'Reactions',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳']
    },
    objects: {
      name: 'Objects & Symbols',
      emojis: ['📱', '💻', '📊', '📈', '📉', '🔍', '🔎', '📝', '📋', '📌', '📍', '🗂️', '📁', '📄', '📃', '📑', '📊', '💡', '🔋', '⚙️', '🛠️', '🔧', '🔨', '⏰', '⏱️', '⏲️', '🕐', '📅', '📆']
    }
  };

  // Handle emoji insertion
  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.substring(0, start) + emoji + message.substring(end);
    
    setMessage(newMessage);
    
    // Reset cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  // Load messages from API
  const loadMessages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages?limit=5`);
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log to see what we're getting
      
      if (data.status === 'success') {
        console.log(`📨 Loaded ${data.data.length} messages from server`);
        setMessages(data.data);
      } else {
        console.error('Failed to load messages:', data.message);
        // Fallback to empty array
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Fallback to mock data if server is down
      const mockMessages = [
        { $id: '1', message: 'Climate alert: Temperature rising in your area', createdAt: new Date().toISOString() },
        { $id: '2', message: 'Weather update: Heavy rainfall expected', createdAt: new Date(Date.now() - 86400000).toISOString() }
      ];
      setMessages(mockMessages);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (message.length > 200) {
      alert('Message cannot exceed 200 characters');
      return;
    }

    setLoading(true);
    try {
      // Send message to API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim()
        })
      });

      const data = await response.json();
      
      console.log('API Response:', response.status, data); // Debug log
      
      if (response.ok && data.status === 'success') {
        // Add to messages list
        const newMessage = {
          $id: data.data.id,
          message: data.data.message,
          createdAt: data.data.createdAt
        };
        setMessages(prev => [newMessage, ...prev.slice(0, 4)]); // Keep only last 5 messages
        
        // Show success notification
        setNotification({
          title: 'Success!',
          body: 'Notification sent successfully!'
        });
        setTimeout(() => setNotification(null), 3000);
        
        setMessage('');
        
        // Refresh messages from server to get the most up-to-date list
        setTimeout(() => {
          loadMessages();
        }, 1000);
        
        // Also try to broadcast the notification
        try {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/broadcast`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: 'Climate Alert',
              body: message.trim()
            })
          });
        } catch (broadcastError) {
          console.log('Broadcast notification failed:', broadcastError);
        }
        
      } else {
        console.error('API Error Response:', data); // Debug log
        throw new Error(data.message || `Server responded with status ${response.status}`);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      console.error('Full error object:', error);
      
      let errorMessage = 'Failed to send message';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the server is running on port 5000.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    loadMessages();
  }, []);

  const stats = [
    { title: 'Total Messages', value: messages.length, icon: 'mail', color: 'from-blue-500 to-blue-600', change: '+12%' },
    { title: 'Active Users', value: '1,234', icon: 'groups', color: 'from-green-500 to-green-600', change: '+8%' },
    { title: 'Delivery Rate', value: '99.9%', icon: 'analytics', color: 'from-purple-500 to-purple-600', change: '+0.1%' },
    { title: 'Response Time', value: '< 1s', icon: 'speed', color: 'from-orange-500 to-orange-600', change: '-5%' }
  ];

  return (
    <div className="space-y-8">
      {/* Success Notification */}
      {notification && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg animate-slide-in-top">
          <div className="flex items-center">
            <span className="material-icons text-2xl mr-3 animate-bounce-custom">mark_email_unread</span>
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="opacity-90">{notification.body}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Push Notifications</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Send instant notifications to all users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-2xl shadow-lg p-6 border hover-lift transition-smooth animate-fade-in-up stagger-${index + 1} ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center hover-glow`}>
                <span className="material-icons text-white text-2xl">{stat.icon}</span>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full animate-scale-in ${
                stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Compose & History */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`rounded-2xl shadow-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`border-b px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Compose Notification</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSendMessage} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Message Content</label>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your notification message here"
                      className={`w-full px-4 py-4 pr-16 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                      }`}
                      rows="6"
                      required
                    />
                    
                    {/* Emoji Button */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`absolute bottom-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-105 ${
                        showEmojiPicker
                          ? 'bg-blue-500 text-white shadow-lg'
                          : darkMode 
                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      😊
                    </button>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div 
                        ref={emojiPickerRef}
                        className={`absolute top-full mt-2 right-0 w-80 max-h-96 overflow-y-auto rounded-xl border shadow-xl z-10 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Add Emojis to your message
                          </h3>
                        </div>
                        
                        <div className="p-4 space-y-4">
                          {Object.entries(emojiCategories).map(([key, category]) => (
                            <div key={key}>
                              <h4 className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {category.name}
                              </h4>
                              <div className="grid grid-cols-8 gap-2">
                                {category.emojis.map((emoji, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => insertEmoji(emoji)}
                                    className={`w-8 h-8 text-xl flex items-center justify-center rounded-lg hover:scale-110 transition-all ${
                                      darkMode 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-100'
                                    }`}
                                    title={emoji}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className={`p-3 border-t text-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(false)}
                            className={`text-xs px-3 py-1 rounded-lg ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className={`text-sm ${message.length > 200 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Characters: {message.length}/200 {message.length > 200 && '⚠️ Too long!'}
                    </p>
                    <div className={`flex items-center space-x-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Ready to broadcast</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !message.trim() || message.length > 200}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover-lift transition-smooth disabled:opacity-50 disabled:cursor-not-allowed btn-ripple interactive-scale"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="loading-dots">Broadcasting</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="material-icons mr-2">send</span>
                      Send Notification
                    </div>
                  )}
                </button>
              </form>

              {/* Tips */}
              <div className={`mt-8 p-6 rounded-xl border ${
                darkMode 
                  ? 'bg-blue-900/20 border-blue-700/30' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
              }`}>
                <h3 className={`font-semibold mb-3 flex items-center ${
                  darkMode ? 'text-blue-300' : 'text-blue-900'
                }`}>
                  <span className="mr-2">💡</span>
                  Notification Best Practices
                </h3>
                <div className={`grid md:grid-cols-2 gap-4 text-sm ${
                  darkMode ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  <ul className="space-y-1">
                    <li>• Keep messages concise and engaging</li>
                    <li>• Use emojis 😊 to increase engagement</li>
                    <li>• Try climate emojis: 🌍 🌡️ ⛈️ ❄️</li>
                    <li>• Personalize when possible</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Test notifications before sending</li>
                    <li>• Avoid sending too frequently</li>
                    <li>• Include clear call-to-actions</li>
                    <li>• Click 😊 button for emoji picker</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className={`border-b px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Last 5 Messages ({messages.length})
              </h2>
              <button
                onClick={loadMessages}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="material-icons text-sm mr-1">refresh</span>
                Refresh
              </button>
            </div>
          </div>
          <div className="p-6">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <span className={`material-icons text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>inbox</span>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.slice(0, 5).map((msg, index) => (
                  <div key={msg.$id || index} className={`p-4 border rounded-xl transition-colors ${
                    darkMode 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Climate Alert</p>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingDashboard;