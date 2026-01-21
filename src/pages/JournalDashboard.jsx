import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import API from '../config/api' // <-- your base API file

const JournalDashboard = () => {
  const { theme } = useTheme()

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const [stats, setStats] = useState(null)
  const [filledDates, setFilledDates] = useState([])

  /* ---------------- STATS API ---------------- */
  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${API}/api/v1/journals/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await res.json()
      setStats(data.data)
    }

    fetchStats()
  }, [])

  /* ---------------- CALENDAR API ---------------- */
  useEffect(() => {
    const fetchCalendar = async () => {
      const res = await fetch(
        `${API}/api/v1/journals/calendar?year=${year}&month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      const data = await res.json()
      setFilledDates(data.data.filledDates)
    }

    fetchCalendar()
  }, [year, month])

  /* ---------------- CALENDAR UTILS ---------------- */
  const generateCalendar = () => {
    const days = []
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)

    return days
  }

const hasEntry = (day) => {
  if (!day) return false;

  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return filledDates.includes(dateStr);
};

  const calendarDays = generateCalendar()

  /* ---------------- UI ---------------- */
  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'
      }`}
    >
      <Navbar isAuth userName="Amit" />

      <div className="px-4 sm:px-6 lg:px-16 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Journal
            </h1>
            <p className="text-gray-400 text-sm">
              Reflect, write, and track your journey
            </p>
          </div>

          <Link
            to={`/journal/new?date=${new Date().toLocaleDateString('en-CA')}`}
            className={`px-6 py-3 text-sm rounded-xl text-white ${theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'}  hover:scale-105 transition`}
          >
            + New Entry
          </Link>
        </div>

        {/* STATS */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Entries', value: stats.totalEntries },
              { label: 'Streak', value: `${stats.currentStreak} days` },
              { label: 'Best Streak', value: `${stats.bestStreak} days` },
              { label: 'This Month', value: stats.thisMonth },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border border-gray-700/50'
                    : 'bg-white border shadow'
                }`}
              >
                <p className="text-xs uppercase text-gray-400 mb-2">
                  {item.label}
                </p>
                <p className={`text-3xl ${
                        theme === 'dark' ? 'text-[#379AE6]' : 'text-[#0AB5CB]'
                      }`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* CALENDAR */}
        <div
          className={`rounded-3xl p-8 ${
            theme === 'dark'
              ? 'bg-gray-900 border border-gray-700/50'
              : 'bg-white border'
          }`}
        >
          <h2 className="text-2xl text-white mb-6">
            {today.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>

          {/* WEEK HEADER */}
          <div className="grid grid-cols-7 gap-4 mb-4 text-xs text-gray-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((day, idx) => (
              <Link
                key={idx}
                    to={
                      day
                        ? `/journal/new?date=${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        : '#'
                    }
                className={`aspect-square rounded-2xl flex items-center justify-center transition ${
                  !day
                    ? ''
                    : hasEntry(day)
                      ? theme === 'dark' ? 'bg-accent-dark text-white hover:scale-105': 'bg-accent-light text-white hover:scale-105'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-400'
                        : 'bg-gray-100 text-gray-600'
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
