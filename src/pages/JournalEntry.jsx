import React, { useEffect, useState } from 'react'
import {  useParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import API from '../config/api'

import { useNavigate, useSearchParams } from 'react-router-dom'

const JournalEntry = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { date } = useParams() // yyyy-mm-dd (for edit)
  const [searchParams] = useSearchParams()
const selectedDate = searchParams.get('date')

const isEdit = Boolean(selectedDate)

  const [loading, setLoading] = useState(false)
  const [entryId, setEntryId] = useState(null)

  const [entry, setEntry] = useState({
    content: '',
    mood: '',
  })





  /* ---------------- FETCH ENTRY (EDIT MODE) ---------------- */
useEffect(() => {
  if (!selectedDate) return;

  const fetchEntry = async () => {
    const res = await fetch(
      `${API}/api/v1/journals?startDate=${selectedDate}&endDate=${selectedDate}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const data = await res.json();

    if (data.data.journals.length > 0) {
      const j = data.data.journals[0];
      setEntry({
        content: j.content,
        mood: j.mood || '',
      });
      setEntryId(j._id);
    }
  };

  fetchEntry();
}, [selectedDate]);


  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value })
  }

const handleSave = async () => {
  const payload = {
    content: entry.content,
    mood: entry.mood,
    date: selectedDate,
  };

  const url = entryId
    ? `${API}/api/v1/journals/${entryId}`
    : `${API}/api/v1/journals`;

  const method = entryId ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  });

  navigate('/journal');
};




  const handleDelete = async () => {
    if (!entryId) return

    await fetch(`${API}/api/v1/journals/${entryId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    navigate('/journal')
  }

  /* ---------------- UI ---------------- */
const displayDate = selectedDate
  ? new Date(selectedDate).toDateString()
  : new Date().toDateString()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'}`}>
      <Navbar isAuth userName="Amit" />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl text-white mb-6">
          {displayDate}
        </h1>

        {/* MOOD */}
        <select
          name="mood"
          value={entry.mood}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white"
        >
          <option value="">Select mood</option>
          <option value="happy">Happy</option>
          <option value="neutral">Neutral</option>
          <option value="sad">Sad</option>
          <option value="excited">Excited</option>
          <option value="anxious">Anxious</option>
          <option value="angry">Angry</option>
        </select>

        {/* CONTENT */}
        <textarea
          name="content"
          value={entry.content}
          onChange={handleChange}
          rows={10}
          className="w-full p-4 rounded bg-gray-900 text-white"
          placeholder="Write your thoughts..."
        />

        {/* ACTIONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-accent-dark py-3 rounded text-white"
          >
            {isEdit ? 'Update Entry' : 'Save Entry'}
          </button>

          {isEdit && (
            <button
              onClick={handleDelete}
              className="bg-red-500 px-6 rounded text-white"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JournalEntry
