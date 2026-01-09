import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'

const JournalEntry = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [entry, setEntry] = useState({
    mood: '',
    gratitude: '',
    highlights: '',
    challenges: '',
    learnings: '',
    tomorrowGoals: '',
    notes: '',
  })

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😤', label: 'Frustrated' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🤔', label: 'Thoughtful' },
    { emoji: '😎', label: 'Confident' },
    { emoji: '❤️', label: 'Loved' },
  ]

  const handleChange = (e) => {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    // Save entry logic here
    navigate('/journal')
  }

  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'
    }`}>
      <Navbar isAuth={true} userName="Amit" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Header */}
        <div className={`mb-6 pb-4 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h1 className={`text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {dateString}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Mood Selector */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              How are you feeling today?
            </label>
            <div className="flex flex-wrap gap-3">
              {moods.map(mood => (
                <button
                  key={mood.emoji}
                  type="button"
                  onClick={() => setEntry({ ...entry, mood: mood.emoji })}
                  className={`px-4 py-2 rounded-lg text-lg transition-all ${
                    entry.mood === mood.emoji
                      ? theme === 'dark'
                        ? 'bg-accent-dark ring-2 ring-accent-dark'
                        : 'bg-accent-light ring-2 ring-accent-light'
                      : theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Gratitude */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Gratitude
            </label>
            <textarea
              name="gratitude"
              value={entry.gratitude}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
              }`}
              placeholder="What are you grateful for today?"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Highlights
            </label>
            <textarea
              name="highlights"
              value={entry.highlights}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
              }`}
              placeholder="What were the best moments of your day?"
            />
          </div>

          {/* Challenges */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Challenges
            </label>
            <textarea
              name="challenges"
              value={entry.challenges}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
              }`}
              placeholder="What obstacles did you face?"
            />
          </div>

          {/* Learnings */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Learnings
            </label>
            <textarea
              name="learnings"
              value={entry.learnings}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
              }`}
              placeholder="What did you learn today?"
            />
          </div>

          {/* Tomorrow Goals */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Tomorrow Goals
            </label>
            <textarea
              name="tomorrowGoals"
              value={entry.tomorrowGoals}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
              }`}
              placeholder="What do you want to accomplish tomorrow?"
            />
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Notes
            </label>
            <textarea
              name="notes"
              value={entry.notes}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-accent-dark focus:ring-1 focus:ring-accent-dark' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-light focus:ring-1 focus:ring-accent-light'
              }`}
              placeholder="Any additional thoughts..."
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 ${
                theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
              }`}
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalEntry




