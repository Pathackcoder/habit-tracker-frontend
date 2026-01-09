import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'

const Settings = () => {
  const { theme } = useTheme()
  const [profile, setProfile] = useState({
    name: 'Amit',
    email: 'amit@example.com',
    timezone: 'UTC-5',
  })
  const [notifications, setNotifications] = useState({
    reminders: true,
    weeklyReport: true,
    achievements: false,
  })

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationToggle = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    })
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'
    }`}>
      <Navbar isAuth={true} userName="Amit" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Settings <span style={{ color: '#ff4d4d', fontWeight: 500 }}>
  [ This part is in development ]
</span>

          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-900 border border-gray-800' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Profile
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
              />
            </div>

            <button
              className={`px-6 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 ${
                theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Change Password Section */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-900 border border-gray-800' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Change Password
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Current Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                New Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm New Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
                placeholder="••••••••"
              />
            </div>

            <button
              className={`px-6 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 ${
                theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
              }`}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-900 border border-gray-800' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Notifications
          </h2>
          
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {key === 'reminders' && 'Habit Reminders'}
                    {key === 'weeklyReport' && 'Weekly Report'}
                    {key === 'achievements' && 'Achievements'}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {key === 'reminders' && 'Get notified when it\'s time for your habits'}
                    {key === 'weeklyReport' && 'Receive weekly progress summaries'}
                    {key === 'achievements' && 'Celebrate your milestones'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value
                      ? theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timezone Section */}
        <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-900 border border-gray-800' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Timezone
          </h2>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Select Timezone
            </label>
            <select
              name="timezone"
              value={profile.timezone}
              onChange={handleProfileChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
              }`}
            >
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC-8">UTC-8 (PST)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+1">UTC+1 (CET)</option>
              <option value="UTC+5:30">UTC+5:30 (IST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings




