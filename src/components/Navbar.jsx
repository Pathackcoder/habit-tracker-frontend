import React, { useState , useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'


const Navbar = ({ isAuth = false }) => {
  const { theme, toggleTheme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) 

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (isDropdownOpen && !event.target.closest('.relative')) {
      setIsDropdownOpen(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [isDropdownOpen])

  const fullName = localStorage.getItem("name") || "";
  const userName = fullName.trim().split(/\s+/)[0];
  
  const handleLogout =function(){
    setIsDropdownOpen(false)
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    localStorage.removeItem("name")
  }

  return (
    <nav className={`w-full border-b transition-colors duration-200 ${
      theme === 'dark' 
        ? 'border-gray-800 bg-[#0C111D]' 
        : 'border-gray-200 bg-white'
    }`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuth ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className='h-32 w-32'>
              <img src="../../public/images/Stoic-Habit.png" alt="Stoic Habit" />
            </div>
          </Link>

          {/* Center - Navigation Links (only if authenticated) */}
          {isAuth && (
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Habits
              </Link>
              <Link 
                to="/journal" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Journal
              </Link>
              <Link 
                to="/analytics" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Analytics
              </Link>
              <Link 
                to="/support" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Support
              </Link>
              <Link 
                to="/settings" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Settings
              </Link>
            </div>
          )}

          {/* Right side - User & Theme Toggle */}
          {/* Right side - User & Theme Toggle */}
          <div className="flex items-center space-x-4">
            {isAuth && (
              <div className="relative">
                <div 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer ${
                    theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-sm">Welcome, {userName}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
                  }`}>
                    <span className="text-white text-sm font-medium">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/login"
                      className={`block px-4 py-2 text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-gray-700 hover:text-red-300'
                          : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                      }`}
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

