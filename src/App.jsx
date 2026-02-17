import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import { Navigate } from 'react-router-dom'
import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AddHabit from './pages/AddHabit'
import JournalDashboard from './pages/JournalDashboard'
import JournalEntry from './pages/JournalEntry'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Intro from './pages/Intro'

function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* GLOBAL TOASTER —  */}
        <Toaster
          position="top-center"
          gutter={12}
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: '#1f2937',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#1f2937',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#1f2937',
              },
            },
          }}
        />

        <Routes>
          {/* Public Root */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/intro" element={<Intro />} />
          </Route>
          
          {/* Private Root */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/habits/add" element={<AddHabit />} />
            <Route path="/habits/edit/:id" element={<AddHabit />} />
            <Route path="/journal" element={<JournalDashboard />} />
            <Route path="/journal/entry/:id" element={<JournalEntry />} />
            <Route path="/journal/new" element={<JournalEntry />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App


