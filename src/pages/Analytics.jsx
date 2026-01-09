import React from 'react'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'

const Analytics = () => {
  const { theme } = useTheme()

  const stats = [
    { label: 'Active Habits', value: '8' },
    { label: 'Average Completion', value: '78%' },
    { label: 'Longest Streak', value: '24 days' },
    { label: 'Best Month', value: 'January' },
  ]

  const topHabits = [
    { name: 'Morning Run', icon: '🏃', completion: 95 },
    { name: 'Meditation', icon: '🧘', completion: 88 },
    { name: 'Read Book', icon: '📚', completion: 82 },
    { name: 'Drink Water', icon: '💧', completion: 90 },
  ]

  const monthlyData = [
    { month: 'Jan', value: 85 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 82 },
    { month: 'Apr', value: 88 },
    { month: 'May', value: 75 },
    { month: 'Jun', value: 90 },
  ]

  const activityData = Array.from({ length: 90 }, (_, i) => ({
    day: i + 1,
    value: Math.floor(Math.random() * 100),
  }))

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'
    }`}>
      <Navbar isAuth={true} userName="Amit" />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-16 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className={`text-3xl font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Analytics <span style={{ color: '#ff4d4d', fontWeight: 500 }}>
  [ This part is in development ]
</span>
          </h1>
          <p className={`text-md ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Insights into your habits and consistency
          </p>
        </div>

        {/* STATS — TOP ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-gray-700/50'
                  : 'bg-white border border-gray-200/80 shadow-md'
              }`}
              style={{ height: '140px' }}
            >
              <p className={`text-xs uppercase tracking-wider mb-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-normal ${
                theme === 'dark' ? 'text-[#379AE6]' : 'text-[#0AB5CB]'
              }`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* MONTHLY + TOP HABITS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* MONTHLY PROGRESS */}
          <div
            className={`lg:col-span-2 rounded-3xl p-8 transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gray-900 border border-gray-700/50'
                : 'bg-white border border-gray-200/80'
            }`}
          >
            <h2 className={`text-2xl font-medium mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Monthly Progress
            </h2>

            <div className="space-y-5">
              {monthlyData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.month}
                    </span>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.value}%
                    </span>
                  </div>

                  <div className={`w-full h-3 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`${theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'} h-full`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP HABITS */}
          <div
            className={`rounded-3xl p-8 transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gray-900 border border-gray-700/50'
                : 'bg-white border border-gray-200/80'
            }`}
          >
            <h2 className={`text-2xl font-medium mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Top Habits
            </h2>

            <div className="space-y-5">
              {topHabits.map((habit, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{habit.icon}</span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {habit.name}
                      </span>
                    </div>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {habit.completion}%
                    </span>
                  </div>

                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`${theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'} h-full`}
                      style={{ width: `${habit.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 90 DAY ACTIVITY */}
        <div
          className={`rounded-3xl p-8 transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gray-900 border border-gray-700/50'
              : 'bg-white border border-gray-200/80'
          }`}
        >
          <h2 className={`text-2xl font-medium mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            90-Day Activity
          </h2>

          <div className="h-64 flex items-end gap-[2px]">
            {activityData.map((item, idx) => (
              <div key={idx} className="flex-1">
                <div
                  className={`${theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'} rounded-t`}
                  style={{ height: `${item.value}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 text-xs">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              90 days ago
            </span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              Today
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Analytics
