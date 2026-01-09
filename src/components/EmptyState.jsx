import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const EmptyState = ({ 
  icon = '💙', 
  title = 'No habits yet', 
  message = 'Start your journey by adding your first habit',
  actionLabel = 'Add Habit',
  actionLink = '/habits/add'
}) => {
  const { theme } = useTheme()

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 rounded-2xl transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 border border-gray-800' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className={`text-2xl font-bold mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      <p className={`text-center mb-6 max-w-md ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {message}
      </p>
      <Link
        to={actionLink}
        className={`px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 ${
          theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
        }`}
      >
        {actionLabel}
      </Link>
    </div>
  )
}

export default EmptyState




