import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import API from '../config/api'

const Login = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const response = await res.json()

      if (!res.ok) {
        setError(response?.message || 'Invalid credentials')
        return
      }

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
      }

      if (response.data?.user?.id && response.data?.user?.name) {
        localStorage.setItem('id', response.data.user.id)
        localStorage.setItem('name', response.data.user.name)
      }

      toast.success('Welcome back 👋')
      navigate('/intro')

    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-[#0b0f19]' : 'bg-gray-50'
    }`}>
      <Navbar isAuth={false} />

      <div className="flex min-h-[calc(100vh-4rem)]">

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-1/2 items-center justify-center relative">

          <div
            className={`absolute w-[450px] h-[450px] rounded-full blur-3xl opacity-20 contrast-110 brightness-105
              ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}
            `}
          />

          <motion.img
            src="/images/login-Image-new.png"
            alt="Login Illustration"
            className="w-[700px] h-[700px] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
            animate={{ y: [0, -50, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

        </div>

        {/* FORM */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className={`
              relative w-full max-w-md p-10 rounded-3xl
              transition-all duration-300
              backdrop-blur-xl
              ${theme === 'dark'
                ? `
                  bg-white/5 
                  border border-white/10
                  shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]
                `
                : `
                  bg-white/80
                  border border-gray-200
                  shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]
                `
              }
            `}
          >

            <h1 className={`text-3xl font-semibold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back
            </h1>

            <p className={`text-sm mt-1 mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Log in to continue your journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className={`
                  w-full px-4 py-3 rounded-xl text-sm
                  transition-all duration-300
                  focus:outline-none
                  focus:-translate-y-[1px]
                  focus:shadow-lg
                  ${theme === 'dark'
                    ? `
                      bg-gray-800/70
                      text-white
                      placeholder-gray-500
                      border border-gray-700
                      focus:border-accent-dark
                    `
                    : `
                      bg-gray-50
                      text-gray-900
                      placeholder-gray-500
                      border border-gray-300
                      focus:border-accent-light
                    `
                  }
                `}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className={`
                  w-full px-4 py-3 rounded-xl text-sm
                  transition-all duration-300
                  focus:outline-none
                  focus:-translate-y-[1px]
                  focus:shadow-lg
                  ${theme === 'dark'
                    ? `
                      bg-gray-800/70
                      text-white
                      placeholder-gray-500
                      border border-gray-700
                      focus:border-accent-dark
                    `
                    : `
                      bg-gray-50
                      text-gray-900
                      placeholder-gray-500
                      border border-gray-300
                      focus:border-accent-light
                    `
                  }
                `}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-red-500 pt-1"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full mt-6 py-3 rounded-xl
                  text-sm font-medium text-white
                  transition-all duration-300
                  hover:scale-[1.03]
                  active:scale-[0.96]
                  hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.6)]
                  ${theme === 'dark'
                    ? 'bg-accent-dark'
                    : 'bg-accent-light'
                  }
                `}
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>

            <p className={`text-xs text-center mt-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Don’t have an account?
              <Link
                to="/signup"
                className={`ml-1 font-medium ${
                  theme === 'dark'
                    ? 'text-accent-dark hover:opacity-80'
                    : 'text-accent-light hover:opacity-80'
                }`}
              >
                Sign up
              </Link>
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
