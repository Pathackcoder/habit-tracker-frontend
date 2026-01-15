import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import API from '../config/api'

const Signup = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.message || 'Signup failed')
        return
      }

      toast.success('Account created 🎉')
      navigate('/login')

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
        
        {/* IMAGE PLACEHOLDER */}
        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-1/2 items-center justify-center relative">
          
          {/* subtle glow behind image (not gradient, very soft) */}
          <div
            className={`absolute w-[450px] h-[450px] rounded-full blur-3xl opacity-20 contrast-110 brightness-105
              ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}
            `}
          />

        <motion.img
          src="/images/login-Image-new.png"
          alt="Signup Illustration"
          className="
            w-[700px] h-[700px]
            object-contain
            drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]
          "
          animate={{ y: [0, -50, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        </div>
                  {/* MOBILE BACKGROUND IMAGE */}
        <div className="absolute inset-0 lg:hidden">
          <img
            src="/images/login-Image-new.png"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* FORM */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
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
              Create your account
            </h1>

            <p className={`text-sm mt-1 mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Build better habits, one day at a time
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {[
                { type: 'text', value: name, setter: setName, placeholder: 'Full name' },
                { type: 'email', value: email, setter: setEmail, placeholder: 'Email address' },
                { type: 'password', value: password, setter: setPassword, placeholder: 'Password' },
                { type: 'password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Confirm password' }
              ].map((field, i) => (
                <input
                  key={i}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
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
              ))}

              {error && (
                <p className="text-xs text-red-500 pt-1 animate-[fadeUp_0.3s_ease-out]">
                  {error}
                </p>
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
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className={`text-xs text-center mt-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Already have an account?
              <Link
                to="/login"
                className={`ml-1 font-medium ${
                  theme === 'dark'
                    ? 'text-accent-dark hover:opacity-80'
                    : 'text-accent-light hover:opacity-80'
                }`}
              >
                Login
              </Link>
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Signup
