# HabitTracker 🎯

A clean, modern, and delightful habit-tracking web app built with React and Tailwind CSS.

## Features

- 🌞 **Light & Dark Themes** - Beautiful themes with smooth transitions
- 📊 **Habit Tracking** - Track your daily habits with an intuitive grid interface
- 📝 **Journal** - Reflect on your journey with daily journal entries
- 📈 **Analytics** - Visualize your progress with charts and statistics
- ⚙️ **Settings** - Customize your experience with preferences and notifications

## Tech Stack

- **React** (JSX only, no TypeScript)
- **React Router** - For navigation
- **Tailwind CSS** - For styling
- **Vite** - Build tool and dev server

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Habit-Tracker/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   └── EmptyState.jsx
│   ├── context/          # React context providers
│   │   └── ThemeContext.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddHabit.jsx
│   │   ├── JournalDashboard.jsx
│   │   ├── JournalEntry.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Theme Colors

### Light Theme
- Background: White
- Accent: #0AB5CB
- Text: Dark Gray / Black
- Cards: Off-white with soft shadows

### Dark Theme
- Background: #0C111D
- Accent: #379AE6
- Text: Light Gray / White
- Cards: Slightly lighter than page background

## Pages

1. **Login** - Sign in to your account
2. **Signup** - Create a new account
3. **Dashboard** - Main habit tracking interface with grid and progress cards
4. **Add/Edit Habit** - Create or modify habits
5. **Journal Dashboard** - View journal entries in calendar format
6. **Journal Entry** - Write and edit journal entries
7. **Analytics** - View progress charts and statistics
8. **Settings** - Manage profile, password, notifications, and timezone

## Design Philosophy

- **Minimal** - Clean and uncluttered interface
- **Soft** - Gentle colors and rounded corners
- **Wholesome** - Friendly and approachable
- **Calm** - Peaceful and non-overwhelming
- **Friendly** - Warm and inviting

## License

MIT




