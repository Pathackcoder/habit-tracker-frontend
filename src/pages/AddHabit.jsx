import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import { toast } from 'react-hot-toast'
import API from "../config/api";


const AddHabit = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [weeklyDays, setWeeklyDays] = useState([])
  // const [monthlyDate, setMonthlyDate] = useState(null)
const [formData, setFormData] = useState({
  title: '',
  description: '',
  category: '',
  type: 'daily',
  frequency: {
    days: []
  },
  color: '#38BDF8',
  icon: '⭐',
  targetCount: 1,
  unit: 'times',
  startDate: new Date().toISOString().split('T')[0],
  reminder: {
    enabled: false,
    time: '09:00'
  }
})

  const icons = ['⭐', '🏃', '🧘', '📚', '💧', '🍎', '💪', '🎯', '🌱', '📝', '🎨', '🎵']

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  let frequencyDays = []

  if(formData.type === "daily") {
    frequencyDays = [0,1,2,3,4,5,6]
  }
  else if(formData.type === "weekly") {
    if(weeklyDays.length === 0){
      return toast.error("Select at least one day")
    }
    frequencyDays = weeklyDays
  }
  // else if(formData.type === "monthly") {
  //   if(!monthlyDate){
  //     return toast.error("Select a date")
  //   }
  //   frequencyDays = [monthlyDate]
  // }

  const payload = {
    ...formData,
    frequency: { days: frequencyDays },
    unit: "times",
    color: "#38BDF8",
    targetCount: 1
  }

  const token = localStorage.getItem("token")

  await fetch(`${API}/api/v1/habits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  toast.success("Habit Added Successfully1")
  navigate("/dashboard")
}


  const handleCancel = () => {
    navigate('/dashboard')
  }

  // Generate calendar preview
  const generateCalendarPreview = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date.getDate())
    }
    return days
  }

  const calendarDays = generateCalendarPreview()

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'
    }`}>
      <Navbar isAuth={true} userName="Amit" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-900 border border-gray-800' 
            : 'bg-white border border-gray-200'
        }`}>
          <h1 className={`text-3xl font-medium mb-6 ${
            theme === 'dark' ? 'text-[#379AE6]' : 'text-[#0AB5CB]'
          }`}>
            {formData.title ? `Habit: ${formData.title}` : 'Add New Habit'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Habit Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Habit Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
                placeholder="e.g., Morning Run"
              />
            </div>
          
              {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
                placeholder="e.g., Will Walk 2KM daily"
              />
            </div>

                {/* Category DropDown
                <div className='flex gap-4'>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Select Category
                    </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className='rounded-xl text-black'
                  >
                    <option value=""> Category</option>
                    <option value="fitness">Fitness</option>
                    <option value="study">Study</option>
                    <option value="health">Health</option>
                    <option value="productivity">Productivity</option>
                    <option value="selfcare">Self Care</option>
                    <option value="career">Career</option>
                    <option value="finance">Finance</option>
                    <option value="relationships">Relationships</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="hobby">Hobby</option>
                  </select>
                </div> */}

                <div className="flex gap-4">
                  {/* Category */}
                  <div className="w-1/2">
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Select Category
                    </label>

                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                      }`}
                    >
                      <option value="">Category</option>
                      <option value="fitness">Fitness</option>
                      <option value="study">Study</option>
                      <option value="health">Health</option>
                      <option value="productivity">Productivity</option>
                      <option value="selfcare">Self Care</option>
                      <option value="career">Career</option>
                      <option value="finance">Finance</option>
                      <option value="relationships">Relationships</option>
                      <option value="spiritual">Spiritual</option>
                      <option value="hobby">Hobby</option>
                    </select>
                  </div>

                  {/* Habit Type */}
                  <div className="w-1/2">
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Habit Type
                    </label>

                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                      }`}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      {/* <option value="monthly">Monthly</option> */}
                    </select>
                  </div>
                </div>



            {/* Icon Selector */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Icon
              </label>
              <div className="grid grid-cols-6 gap-3">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-3 rounded-lg text-2xl transition-all ${
                      formData.icon === icon
                        ? theme === 'dark'
                          ? 'bg-accent-dark ring-2 ring-accent-dark'
                          : 'bg-accent-light ring-2 ring-accent-light'
                        : theme === 'dark'
                          ? 'bg-gray-800 hover:bg-gray-700'
                          : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>



            {/* Start Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
                }`}
              />
            </div>

            {/* Frequency */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Frequency
              </label>

              {/* DAILY → nothing to choose */}
              {formData.type === 'daily' && (
                <div className={`
                  px-4 py-3 rounded-lg border 
                  ${theme === "dark" 
                    ? "bg-gray-800 border-gray-700 text-gray-300" 
                    : "bg-gray-100 border-gray-300 text-gray-700"
                  }
                `}>
                  This habit will repeat every day 👍
                </div>
              )}

              {/* WEEKLY → choose weekday */}
              {formData.type === "weekly" && (
                <div className="flex gap-2 flex-wrap">

              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setWeeklyDays(prev =>
                      prev.includes(i)
                        ? prev.filter(x => x !== i)
                        : [...prev, i]
                    )
                  }}
                  className={`
                    px-3 py-2 rounded-lg border transition-all
                    ${
                      weeklyDays.includes(i)
                        ? theme === "dark"
                          ? "bg-accent-dark text-white border-accent-dark"
                          : "bg-accent-light text-white border-accent-light"
                        : theme === "dark"
                          ? "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                          : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                    }
                  `}
                >
                  {d}
                </button>
              ))}

                </div>
              )}


              {/* MONTHLY → choose date */}
              {/* {formData.type === "monthly" && (
                <select
                  value={monthlyDate ?? ""}
                  onChange={(e) => setMonthlyDate(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border"
                >
                  <option value="">Select Date</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
              )} */}

            </div>


            {/* Reminder Time */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Reminder
              </label>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={formData.reminder.enabled}
                  onChange={e => setFormData({
                    ...formData,
                    reminder: {
                      ...formData.reminder,
                      enabled: e.target.checked
                    }
                  })}
                />

                <span>Enable Reminder</span>
              </div>

              {formData.reminder.enabled && (
                <input
                  type="time"
                  value={formData.reminder.time}
                  onChange={e => setFormData({
                    ...formData,
                    reminder: {
                      ...formData.reminder,
                      time: e.target.value
                    }
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${theme === "dark" 
                    ? "bg-gray-800 border-gray-700 text-gray-300" 
                    : "bg-gray-100 border-gray-300 text-gray-700"
                  }`}
                />
              )}
            </div>


            {/* Calendar Preview
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Preview
              </label>
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">{formData.icon}</span>
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formData.name || 'New Habit'}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center text-xs rounded ${
                        idx < 7 && Math.random() > 0.5
                          ? theme === 'dark'
                            ? 'bg-accent-dark text-white'
                            : 'bg-accent-light text-white'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 ${
                  theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
                }`}
              >
                Save Habit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddHabit




