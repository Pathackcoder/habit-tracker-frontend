import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'

const JournalDashboard = () => {
  const { theme } = useTheme()

  const stats = [
    { label: 'Total Entries', value: '42' },
    { label: 'Streak', value: '7 days' },
    { label: 'Best Streak', value: '21 days' },
    { label: 'This Month', value: '18' },
  ]

  const generateCalendar = () => {
    const days = []
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)

    return days
  }

  const calendarDays = generateCalendar()
  const hasEntry = (day) => day && Math.random() > 0.6

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'
    }`}>
      <Navbar isAuth={true} userName="Amit" />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-16 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Journal <span style={{ color: '#ff4d4d', fontWeight: 500 }}>
  [ This part is in development ]
</span>
            </h1>
            <p className={`text-md ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Reflect, write, and track your journey
            </p>
          </div>

          <Link
            to="/journal/new"
            className={`px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-accent-dark hover:opacity-90'
                : 'bg-accent-light hover:opacity-90'
            }`}
          >
            + New Entry
          </Link>
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

        {/* CALENDAR */}
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
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>

          {/* DAYS HEADER */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
              <div
                key={day}
                className={`text-xs text-center uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* DATES GRID */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((day, idx) => (
              <Link
                key={idx}
                to={day && hasEntry(day) ? `/journal/entry/${day}` : '/journal/new'}
                className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  !day
                    ? ''
                    : hasEntry(day)
                      ? theme === 'dark'
                        ? 'bg-accent-dark text-white hover:scale-105'
                        : 'bg-accent-light text-white hover:scale-105'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default JournalDashboard
