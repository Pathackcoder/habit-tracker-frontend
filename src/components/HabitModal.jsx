import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { useTheme } from '../context/ThemeContext'
import API from '../config/api'

const HabitModal = ({ habit, onClose, onUpdated }) => {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: habit.title,
    description: habit.description,
    category: habit.category,
    type: habit.type,
    icon: habit.icon
  })

  const token = localStorage.getItem("token")

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const updateHabit = async () => {
    try {
      setLoading(true)

      const res = await fetch(`${API}/api/v1/habits/${habit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error()

      toast.success("Habit updated ✨")
      onUpdated()
      onClose()
    } 
    catch {
      toast.error("Update failed 😓")
    }
    finally {
      setLoading(false)
    }
  }

  const deleteHabit = async () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Delete this habit permanently? </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-600 dark:bg-gray-700 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              
              try {
                setLoading(true)

                await fetch(`${API}/api/v1/habits/${habit._id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                })

                toast.success("Habit deleted 🗑️")
                onUpdated()
                onClose()
              } 
              catch {
                toast.error("Delete failed 🚨")
              }
              finally {
                setLoading(false)
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">

      {/* Modal Box */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-xl animate-scale-in">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-base">
            Edit Habit
          </h2>

          <button onClick={onClose} className="text-2xl hover:opacity-70">✖</button>
        </div>

        <div className="space-y-4">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800"
            placeholder="Habit title"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800"
            placeholder="Description"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800"
          >
            <option value="fitness">Fitness</option>
            <option value="study">Study</option>
            <option value="productivity">Productivity</option>
            <option value="selfcare">Self Care</option>
          </select>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

        </div>

        {/* Footer */}
        <div className="flex justify-between mt-8">

          <button
            onClick={deleteHabit}
            disabled={loading}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            Delete
          </button>

          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 hover:opacity-90"
            >
              Cancel
            </button>

            <button
              onClick={updateHabit}
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white disabled:opacity-50 ${
                    theme === 'dark' ? 'bg-accent-dark hover:opacity-90' : 'bg-accent-light hover:opacity-90'
                    }`}
                >
              Save
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default HabitModal