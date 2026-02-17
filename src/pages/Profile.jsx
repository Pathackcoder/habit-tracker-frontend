import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import API from '../config/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiCamera, FiUser, FiMail, FiClock, FiEdit2, FiArrowLeft, FiEye, FiImage } from 'react-icons/fi'

const Profile = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [showViewPhoto, setShowViewPhoto] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    timezone: 'UTC',
    avatar: null,
  })
  const [avatarPreview, setAvatarPreview] = useState(null)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null
    return `${API}/uploads/${avatarPath}`
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/api/v1/users/profile`, {
          headers: getAuthHeaders(),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.message || 'Failed to load profile')
        const user = json.data
        setProfile({
          name: user.name || '',
          email: user.email || '',
          bio: user.bio || '',
          timezone: user.timezone || 'UTC',
          avatar: user.avatar || null,
        })
        if (user.avatar) {
          setAvatarPreview(getAvatarUrl(user.avatar))
        }
      } catch (err) {
        toast.error(err.message || 'Could not load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    const closeMenu = (e) => {
      if (showAvatarMenu && !e.target.closest('.avatar-menu-wrapper')) {
        setShowAvatarMenu(false)
      }
    }
    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [showAvatarMenu])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((p) => ({ ...p, [name]: value }))
  }

  const handleChangePhotoClick = () => {
    setShowAvatarMenu(false)
    fileInputRef.current?.click()
  }

  const handleViewPhotoClick = () => {
    setShowAvatarMenu(false)
    if (avatarPreview) setShowViewPhoto(true)
  }

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('avatar', file)

    setUploading(true)
    fetch(`${API}/api/v1/users/profile/avatar`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.avatar) {
          setProfile((p) => ({ ...p, avatar: data.data.avatar }))
          localStorage.setItem('avatar', data.data.avatar)
          window.dispatchEvent(new CustomEvent('avatar-updated'))
          toast.success('Photo updated!')
        } else {
          throw new Error(data?.message || 'Upload failed')
        }
      })
      .catch((err) => toast.error(err.message || 'Could not upload photo'))
      .finally(() => setUploading(false))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/v1/users/profile`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          timezone: profile.timezone,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || 'Update failed')
      localStorage.setItem('name', profile.name)
      toast.success('Profile saved!')
    } catch (err) {
      toast.error(err.message || 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'}`}>
        <div className="animate-pulse text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading profile…</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'}`}>
      <Navbar isAuth={true} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-4 text-sm font-medium transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiArrowLeft size={18} />
            Back
          </button>
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Profile
          </h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your profile and photo
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`mt-8 rounded-2xl shadow-xl overflow-hidden border transition-colors ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}
        >
          {/* Cover / Avatar area */}
          <div
            className={`relative h-36 ${
              theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-sky-100 to-teal-50'
            }`}
          >
            <div className="avatar-menu-wrapper absolute bottom-0 left-8 transform translate-y-1/2">
              <div
                className={`relative block cursor-pointer group ${
                  theme === 'dark' ? 'border-gray-900 bg-gray-800' : 'border-white bg-gray-100'
                } w-28 h-28 rounded-full border-4 overflow-hidden flex items-center justify-center transition-all hover:ring-4 ${
                  theme === 'dark' ? 'ring-accent-dark/50' : 'ring-accent-light/50'
                }`}
                onClick={() => !uploading && setShowAvatarMenu((s) => !s)}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {profile.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
                <div
                  className={`absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                    theme === 'dark' ? 'bg-black/60' : 'bg-black/40'
                  }`}
                >
                  {uploading ? (
                    <span className="text-white text-sm">Uploading…</span>
                  ) : (
                    <FiCamera className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarSelect}
                disabled={uploading}
              />
              {showAvatarMenu && (
                <div
                  className={`absolute left-0 top-full mt-2 w-44 rounded-xl shadow-lg py-2 z-50 ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleViewPhotoClick}
                      className={`flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FiEye size={16} />
                      View photo
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleChangePhotoClick}
                    className={`flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiImage size={16} />
                    Change photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 sm:p-8 pt-20 space-y-6">
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiUser size={16} /> Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiMail size={16} /> Email
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiEdit2 size={16} /> Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-3 rounded-xl border resize-none transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
                placeholder="Tell us a bit about yourself…"
              />
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {profile.bio.length}/500
              </p>
            </div>

            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <FiClock size={16} /> Timezone
              </label>
              <select
                name="timezone"
                value={profile.timezone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-accent-dark focus:ring-1 focus:ring-accent-dark'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
              >
                <option value="UTC">UTC</option>
                <option value="UTC-5">UTC-5 (EST)</option>
                <option value="UTC-8">UTC-8 (PST)</option>
                <option value="UTC+0">UTC+0 (GMT)</option>
                <option value="UTC+1">UTC+1 (CET)</option>
                <option value="UTC+5:30">UTC+5:30 (IST)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 rounded-xl font-medium text-white transition-all ${
                theme === 'dark' ? 'bg-accent-dark hover:opacity-90' : 'bg-accent-light hover:opacity-90'
              } disabled:opacity-60`}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </motion.div>
      </div>

      {/* View photo modal */}
      {showViewPhoto && avatarPreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowViewPhoto(false)}
        >
          <button
            type="button"
            onClick={() => setShowViewPhoto(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={avatarPreview}
            alt="Profile"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default Profile
