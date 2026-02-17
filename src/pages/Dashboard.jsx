import React, { useState , useEffect } from 'react'
import { useLayoutEffect } from "react";
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import { toast } from "react-hot-toast"
import HabitModal from '../components/HabitModal'
import CircularProgressIndicator from '../components/CircularProgressIndicator'
import API from '../config/api'
import { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COMPLETION_OPTIONS = [25, 50, 75, 100];

const HabitVectorIllustration = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <svg
      viewBox="0 0 360 220"
      className="w-full h-auto"
      role="img"
      aria-label="Habit progress illustration"
    >
      <defs>
        <linearGradient id="habitHeroBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#1B2A47' : '#E0F2FE'} />
          <stop offset="100%" stopColor={isDark ? '#0B162E' : '#ECFEFF'} />
        </linearGradient>
        <linearGradient id="habitAccentBar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#5AA9FF' : '#0EA5E9'} />
          <stop offset="100%" stopColor={isDark ? '#2DD4BF' : '#14B8A6'} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="360" height="220" rx="28" fill="url(#habitHeroBg)" />

      <g opacity="0.22">
        <circle cx="306" cy="36" r="52" fill={isDark ? '#60A5FA' : '#38BDF8'} />
        <circle cx="56" cy="198" r="58" fill={isDark ? '#14B8A6' : '#22D3EE'} />
      </g>

      <g transform="translate(28 34)">
        <rect
          x="0"
          y="0"
          width="132"
          height="126"
          rx="18"
          fill={isDark ? '#0F1E37' : '#FFFFFF'}
          stroke={isDark ? '#2B3E61' : '#D1E8F5'}
          strokeWidth="2"
        />
        <rect x="16" y="18" width="88" height="10" rx="5" fill={isDark ? '#3B4D70' : '#CFE6F2'} />
        <rect x="16" y="40" width="98" height="8" rx="4" fill={isDark ? '#2B3E61' : '#E2F2F9'} />
        <rect x="16" y="56" width="76" height="8" rx="4" fill={isDark ? '#2B3E61' : '#E2F2F9'} />
        <rect x="16" y="72" width="90" height="8" rx="4" fill={isDark ? '#2B3E61' : '#E2F2F9'} />

        <circle cx="108" cy="98" r="14" fill="url(#habitAccentBar)" />
        <path
          d="M101 98l5 5 10-11"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g transform="translate(184 52)">
        <rect
          x="0"
          y="0"
          width="146"
          height="112"
          rx="18"
          fill={isDark ? '#0F1E37' : '#FFFFFF'}
          stroke={isDark ? '#2B3E61' : '#D1E8F5'}
          strokeWidth="2"
        />
        <rect x="18" y="78" width="18" height="18" rx="6" fill={isDark ? '#30476D' : '#DDEFFA'} />
        <rect x="44" y="62" width="18" height="34" rx="6" fill={isDark ? '#35598C' : '#CBEAFE'} />
        <rect x="70" y="48" width="18" height="48" rx="6" fill={isDark ? '#3A6DB3' : '#A5E5F8'} />
        <rect x="96" y="30" width="18" height="66" rx="6" fill="url(#habitAccentBar)" />
        <rect x="122" y="42" width="12" height="54" rx="6" fill={isDark ? '#2DD4BF' : '#22D3EE'} />

        <path
          d="M18 36c16 8 28 11 40 6 12-5 20-18 36-17 16 1 28 17 40 14"
          fill="none"
          stroke={isDark ? '#84CCFF' : '#0EA5E9'}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g transform="translate(260 152)">
        <ellipse cx="20" cy="32" rx="28" ry="11" fill={isDark ? '#0C1B31' : '#BFE8F6'} opacity="0.72" />
        <path d="M20 8v26" stroke={isDark ? '#22D3EE' : '#0EA5E9'} strokeWidth="4" strokeLinecap="round" />
        <path d="M20 16c-14 0-18-12-11-20 11 1 17 8 17 16" fill={isDark ? '#22D3EE' : '#14B8A6'} />
        <path d="M20 19c12 0 18-9 13-16-9 1-14 7-13 14" fill={isDark ? '#67E8F9' : '#2DD4BF'} />
      </g>
    </svg>
  );
};

const Dashboard = () => {
  const { theme } = useTheme()
  
const hasAutoScrolledRef = useRef(
  sessionStorage.getItem("scrolledToday") === "1"
);
const [habits, setHabits] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [entries, setEntries] = useState({})
const [graphData, setGraphData] = useState(null)
const [graphLoading, setGraphLoading] = useState(false)
const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
const [completionPicker, setCompletionPicker] = useState(null);

  const [selectedHabit, setSelectedHabit] = useState(null)
const [isModalOpen, setIsModalOpen] = useState(false)
// const [currentMonthDate, setCurrentMonthDate] = useState(new Date())
const [totalCompleted, setTotalCompleted] = useState(0);
const [averageRate, setAverageRate] = useState(0);
const [habitStats, setHabitStats] = useState({});
const [bestDay, setBestDay] = useState(null);
const [activeDays, setActiveDays] = useState(0);


const dayRefs = useRef({});
const gridContainerRef = useRef(null);








const fetchUserAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");

    // 🔥 Best Day
    const bestDayRes = await fetch(
      `${API}/api/v1/analytics/best-day`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const bestDayResult = await bestDayRes.json();
    setBestDay(bestDayResult?.data || null);

    // 🔥 Active Days
    const activeDaysRes = await fetch(
      `${API}/api/v1/analytics/active-days`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const activeDaysResult = await activeDaysRes.json();
    setActiveDays(activeDaysResult?.data?.activeDays || 0);

  } catch (err) {
    console.error("Analytics fetch failed", err);
  }
};


useEffect(() => {
  fetchUserAnalytics();
}, [currentMonthDate, entries]);



useEffect(() => {
  if (habits.length === 0) return;

  const fetchTotals = async () => {
    try {
      const token = localStorage.getItem("token");

      let completedSum = 0;
      let rateSum = 0;
      let statsMap = {};

      for (const habit of habits) {
        const res = await fetch(
          `${API}/api/v1/analytics/habits/${habit._id}/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data } = await res.json();
        console.log("ye data dekho >>>>", data)

        completedSum += data?.completedEntries || 0;
        rateSum += data?.completionRate || 0;

        statsMap[habit._id] = {
          completionRate: data?.completionRate || 0,
          completedEntries: data?.completedEntries || 0,
        };
      }

      setTotalCompleted(completedSum);
      setAverageRate(rateSum / habits.length);
      setHabitStats(statsMap);

    } catch (err) {
      console.error(err);
    }
  };

  fetchTotals();
}, [habits, entries]);


const openHabitModal = (habit) => {
  setSelectedHabit(habit)
  setIsModalOpen(true)
}

const closeHabitModal = () => {
  setSelectedHabit(null)
  setIsModalOpen(false)
}
  
const normalizeCompletionValue = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, value));
  }

  if (value === true) {
    return 100;
  }

  return 0;
};

const formatDateForApi = (dateObj) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
};

const openCompletionPicker = (habitId, day) => {
  const date = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth(),
    day
  );
  date.setHours(0, 0, 0, 0);

  const key = formatKey(habitId, date);
  const currentPercentage = normalizeCompletionValue(entries[key]);

  setCompletionPicker({
    habitId,
    key,
    dateStr: formatDateForApi(date),
    dateLabel: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    currentPercentage,
  });
};

const closeCompletionPicker = () => {
  setCompletionPicker(null);
};

const updateDayCompletion = async (percentage) => {
  if (!completionPicker) return;

  const { habitId, key, dateStr, currentPercentage } = completionPicker;
  setEntries((prev) => ({
    ...prev,
    [key]: percentage,
  }));
  closeCompletionPicker();

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/v1/habits/${habitId}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        date: dateStr,
        completionPercentage: percentage
      })
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result?.message || "Failed to update");
    }

    const savedPercentage = result?.data?.completed
      ? 100
      : normalizeCompletionValue(result?.data?.completionPercentage);

    setEntries((prev) => ({
      ...prev,
      [key]: savedPercentage,
    }));

    fetchGraphData();
  } catch (err) {
    setEntries((prev) => ({
      ...prev,
      [key]: currentPercentage,
    }));

    toast.error("Failed 🚨");
  }
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const isToday = (dateObj) => {
  return dateObj.getTime() === today.getTime();
};


// Generate all days of the current month with day names
const getDaysInMonth = () => {
  if (!currentMonthDate) return [];
  const year = currentMonthDate.getFullYear()
  const month = currentMonthDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    days.push({ day: i, name: dayName })
  }
  return days
}


const days = getDaysInMonth()
const currentMonth = currentMonthDate.toLocaleDateString(
  'en-US',
  { month: 'long', year: 'numeric' }
)


useLayoutEffect(() => {
  // guards
  if (!gridContainerRef.current) return;
  if (!days.length) return;
  if (hasAutoScrolledRef.current) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sameMonth =
    today.getFullYear() === currentMonthDate.getFullYear() &&
    today.getMonth() === currentMonthDate.getMonth();

  if (!sameMonth) return;

  const todayDate = today.getDate();

  // retry-safe scroll
  const attemptScroll = () => {
    const container = gridContainerRef.current;
    const todayEl = dayRefs.current[todayDate];

    if (!container || !todayEl) return false;

    const containerRect = container.getBoundingClientRect();
    const elRect = todayEl.getBoundingClientRect();

    const isMobile = window.innerWidth < 768;
    const scrollLeft =
      elRect.left -
      containerRect.left +
      container.scrollLeft -
      container.clientWidth * (isMobile ? 0.55 : 0.3);
      elRect.width / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });

    hasAutoScrolledRef.current = true;
    return true;
  };

  // try immediately
  if (attemptScroll()) return;

  // retry once after DOM settles
  const timer = setTimeout(() => {
    attemptScroll();
  }, 300);

  return () => clearTimeout(timer);
}, [currentMonthDate, days.length, habits.length]);




  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`${API}/api/v1/habits`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!res.ok) {
        toast.error("Failed to load habits 😔")
        throw new Error("Failed to fetch habits")
      }

      const result = await res.json()
      console.log("habit ids>>>>", result)
      setHabits(result?.data?.habits || [])
    } 
    catch (err) {
      setError(err.message)
      toast.error("Something went wrong 🚨")
    }
    finally {
      setLoading(false)
    }
  }

useEffect(() => {


  fetchHabits()
}, [])



useEffect(() => {
  

  const fetchEntries = async () => {
    if (habits.length === 0) return;
    try {
      const token = localStorage.getItem("token");

    const startDate = new Date(
      currentMonthDate.getFullYear(),
      currentMonthDate.getMonth(),
      1
    )

    const endDate = new Date(
      currentMonthDate.getFullYear(),
      currentMonthDate.getMonth() + 1,
      0
    );
    endDate.setHours(23, 59, 59, 999);

      let map = {};

      for (const habit of habits) {
        const res = await fetch(
          `${API}/api/v1/habits/${habit._id}/entries?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        data.data.forEach(entry => {
          const d = new Date(entry.date);
          d.setHours(0,0,0,0);
          const key = formatKey(habit._id, d);
          const savedPercentage = entry.completed
            ? 100
            : normalizeCompletionValue(entry.completionPercentage);
          map[key] = normalizeCompletionValue(savedPercentage);
        });
      }

      setEntries(map);
    } catch (err) {
      toast.error("Could not load entries 😓");
    }
  };

  fetchEntries();
}, [habits, currentMonthDate]);

// Fetch graph data
const fetchGraphData = async () => {
  if (!currentMonthDate) return;
  setGraphLoading(true);

  try {
    const token = localStorage.getItem("token");
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth() + 1;

    const url = `${API}/api/v1/analytics/monthly-graph?year=${year}&month=${month}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const result = await res.json();

    const data = result?.data || result;

    setGraphData(data || null);

  } catch (err) {
    console.error("Error fetching graph data:", err);
    setGraphData(null);
  } finally {
    setGraphLoading(false);
  }
};


useEffect(() => {
  fetchGraphData();
}, [currentMonthDate]);

const formatKey = (habitId, dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${habitId}-${y}-${m}-${d}`;
};

if (loading) {
  return <p className="text-center mt-10">Loading habits...</p>
}

if (error) {
  return <p className="text-center text-red-500 mt-10">{error}</p>
}






  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0C111D]' : 'bg-slate-50'
    }`}>
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -top-28 -left-20 h-80 w-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-cyan-700/20' : 'bg-sky-300/35'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-28 h-96 w-96 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-blue-700/20' : 'bg-cyan-300/30'
          }`}
        />
      </div>
      <Navbar isAuth={true} userName="Amit" />
      
      <div className="relative z-10 max-w-full mx-auto px-3 sm:px-6 lg:px-16 py-6">
        {/* Header */}
<div
  className={`relative mb-5 overflow-hidden rounded-2xl border px-5 py-5 shadow-md sm:px-6 sm:py-6 ${
    theme === 'dark'
      ? 'border-gray-700/60 bg-gradient-to-br from-[#0F1F3D] via-[#0E1B33] to-[#0A1428]'
      : 'border-sky-100 bg-gradient-to-br from-white via-cyan-50 to-sky-100'
  }`}
>
  <div
    className={`absolute -right-6 -top-8 h-28 w-28 rounded-full blur-2xl ${
      theme === 'dark' ? 'bg-sky-500/20' : 'bg-cyan-300/40'
    }`}
  />

  <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-center">
    <div>
      <div
        className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs tracking-wide ${
          theme === 'dark'
            ? 'bg-cyan-500/15 text-cyan-200'
            : 'bg-cyan-100 text-cyan-700'
        }`}
      >
        Build consistency every day
      </div>

      <h1
        className={`text-2xl sm:text-3xl leading-snug ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Stoic Habit Dashboard
      </h1>

      <p
        className={`mt-2 max-w-lg text-sm ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        Cleaner view of routines, streaks, and monthly progress.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-lg px-3 py-1 text-xs ${
            theme === 'dark'
              ? 'bg-slate-800 text-slate-300'
              : 'bg-white/80 text-slate-700'
          }`}
        >
          {currentMonth}
        </span>

        <span
          className={`rounded-lg px-3 py-1 text-xs ${
            theme === 'dark'
              ? 'bg-slate-800 text-cyan-300'
              : 'bg-white/80 text-cyan-700'
          }`}
        >
          {habits.length} active
        </span>
      </div>
    </div>

    <div className="mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
      <HabitVectorIllustration theme={theme} />
    </div>
  </div>
</div>

        

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left: Habit Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div  className={`relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 sm:p-8 ${
              theme === 'dark' 
                ? 'border border-gray-700/50 bg-gray-900/90' 
                : 'border border-gray-200/80 bg-white'
            }`}
            style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
            >
                <div
                  className={`pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full blur-2xl ${
                    theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-200/50'
                  }`}
                />

                {/* HEADER */}
                <div className="relative mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                  {/* LEFT : TITLE */}
                  <div className="mb-4 flex flex-col md:mb-0">
                    <h2 className={`text-2xl font-semibold tracking-tight sm:text-[1.7rem] ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Your Habits
                    </h2>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Track your consistency over time
                    </span>
                  </div>

                  {/* CENTER : MONTH SELECTOR */}
                  <div className="flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2 mb-4 md:mb-0">
                    <div className={`flex items-center gap-3 rounded-xl border px-4 py-2 shadow-sm ${
                      theme === 'dark'
                        ? 'border-gray-700 bg-gray-800/70'
                        : 'border-gray-200 bg-slate-100/80'
                    }`}>
                      <button
                        onClick={() => {
                          hasAutoScrolledRef.current = false;
                          setCurrentMonthDate(prev =>
                            new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                          );
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <FaArrowLeft />
                      </button>

                      <span className={`w-28 text-center text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {currentMonth}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentMonthDate(prev =>
                            new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                          )
                        }
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>


                  {/* RIGHT : CTA */}
                <div className="flex md:absolute md:right-0">
                  <Link
                    to="/habits/add"
                    className={`w-full md:w-auto text-center inline-flex items-center justify-center gap-2
                      rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200
                      ${theme === 'dark'
                        ? 'bg-accent-dark text-white hover:brightness-110'
                        : 'bg-accent-light text-white hover:brightness-95'
                      }`}
                  >
                    <span className="text-lg leading-none">+</span>
                    Add Habit
                  </Link>
                </div>

                </div>

                {/* DIVIDER */}
                <div className={`h-px mb-6 ${
                  theme === 'dark' ? 'bg-gray-800/90' : 'bg-slate-200'
                }`} />

              {/* Habit Grid */}
              <div
                ref={gridContainerRef}
                className={`relative flex-1 overflow-x-auto overflow-y-auto rounded-2xl pb-2 ${
                  theme === 'dark' ? 'ring-1 ring-gray-800/80' : 'ring-1 ring-slate-200'
                }`}
              >
                <table className="w-full" style={{ minWidth: '1000px' }}>
                  <thead className="sticky top-0 z-20">
                    <tr>
                      <th className={`sticky left-0 z-10 px-6 py-4 text-left text-sm font-medium backdrop-blur-sm ${
                        theme === 'dark' ? 'bg-gray-800/95 text-gray-300' : 'bg-slate-100/95 text-gray-700'
                      }`}
                      style={{ minWidth: '150px', maxWidth: '200px', width: '200px' }}
                      >
                        Habit
                      </th>
                      {days.map(({ day, name }) => (
                        <th key={day} ref={(el) => (dayRefs.current[day] = el)} className={`px-3 py-4 text-center text-xs font-medium backdrop-blur-sm ${
                          theme === 'dark' ? 'bg-gray-800/95 text-gray-300' : 'bg-slate-100/95 text-gray-700'
                        }`}>
                          <div className="flex flex-col items-center ">
                            <span
                                className={`text-xs mb-1.5 uppercase tracking-wide
                                  ${
                                    (() => {
                                      const d = new Date(
                                        currentMonthDate.getFullYear(),
                                        currentMonthDate.getMonth(),
                                        day
                                      );
                                      d.setHours(0,0,0,0);
                                      return isToday(d)
                                        ? 'font-semibold opacity-100'
                                        : 'opacity-70';
                                    })()
                                  }
                                `}
                              >
                              {name}
                            </span>

                          {(() => {
                            const dateObj = new Date(
                              currentMonthDate.getFullYear(),
                              currentMonthDate.getMonth(),
                              day
                            );
                            dateObj.setHours(0,0,0,0);

                            const todayActive = isToday(dateObj);

                            return (
                              <span
                              className={`text-base font-medium rounded-full w-8 h-8
                                  flex items-center justify-center
                                  transition-all
                                  ${
                                    todayActive
                                      ? theme === 'dark'
                                        ? 'bg-accent-dark text-white ring-2 ring-accent-dark/40'
                                        : 'bg-accent-light text-white ring-2 ring-accent-light/40'
                                      : theme === 'dark'
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-slate-200 text-gray-900'
                                  }`}
                              >
                                {day}
                              </span>
                            );
                          })()}

                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {habits.length === 0 && (
                      <div className="    absolute left-0 right-0 bottom-0
                              top-[120px] md:top-[140px]
                              flex items-center justify-center
                              pointer-events-none">
                        <div className="pointer-events-auto">
                          {/* EMPTY CARD */}
                          <div
                            className={`w-full max-w-[280px] md:max-w-[360px]
                              rounded-2xl md:rounded-3xl
                              p-5 md:p-8
                              text-center
                              ${
                                theme === 'dark'
                                  ? 'bg-gray-900 border border-gray-700/60'
                                  : 'bg-white border border-gray-200 shadow-md'
                              }`}
                          >
                            {/* ICON */}
                            <div className="mb-4 flex justify-center">
                              <div
                                className={`w-12 h-12 md:w-16 md:h-16
                                  rounded-xl md:rounded-2xl
                                  flex items-center justify-center
                                  ${
                                    theme === 'dark'
                                      ? 'bg-gray-800 border border-gray-700'
                                      : 'bg-gray-100 border border-gray-200'
                                  }`}
                              >
                                <span className="text-2xl md:text-3xl">🧭</span>
                              </div>
                            </div>

                            {/* TEXT */}
                            <h3
                              className={`text-base md:text-lg font-medium mb-1.5 ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                              }`}
                            >
                              No habits yet
                            </h3>

                            <p
                              className={`text-xs md:text-sm mb-4 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              Start with one habit and build momentum.
                            </p>

                            {/* CTA */}
                            <Link
                              to="/habits/add"
                              className={`inline-flex items-center justify-center
                                w-full md:w-auto
                                px-4 py-2.5 rounded-xl
                                text-sm font-medium text-white
                                ${
                                  theme === 'dark'
                                    ? 'bg-accent-dark'
                                    : 'bg-accent-light'
                                }`}
                            >
                              + Add Habit
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}



                      
                    {habits.map(habit => (
                      <tr key={habit._id} onClick={() => openHabitModal(habit)} className={`cursor-pointer border-t transition-colors duration-200 ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800/35' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                      style={{ minWidth: '200px', maxWidth: '200px', width: '200px' }}
                      >
                        <td className={`sticky left-0 z-10 px-3 py-5 ${
                            theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'
                          }`}>
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl filter drop-shadow-sm">{habit.icon || "⭐"}</span>
                            <span className={`font-base text-base ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {habit.title}
                            </span>
                          </div>
                        </td>
                        {days.map(({ day }) => {
                          // const dateObj = new Date(new Date().getFullYear(), new Date().getMonth(), day);
                            const dateObj = new Date(
                              currentMonthDate.getFullYear(),
                              currentMonthDate.getMonth(),
                              day
                            );
                            dateObj.setHours(0,0,0,0);
                            const weekday = dateObj.getDay() 
                            const isAllowed = habit.frequency?.days?.includes(weekday)
                          const key = formatKey(habit._id, dateObj);
                          const completionPercentage = normalizeCompletionValue(entries[key]);
                          const hasProgress = completionPercentage > 0;
                          return (
                            <td key={day} className={`py-5 px-3 text-center transition-colors
                              ${
                                (() => {
                                  const d = new Date(
                                    currentMonthDate.getFullYear(),
                                    currentMonthDate.getMonth(),
                                    day
                                  );
                                  d.setHours(0,0,0,0);
                                  return isToday(d)
                                    ? theme === 'dark'
                                      ? 'bg-accent-dark/10'
                                      : 'bg-accent-light/10'
                                    : '';
                                })()
                              }
                            `}>
                              <button
                                disabled={!isAllowed}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (isAllowed) openCompletionPicker(habit._id, day)
                                }}
                                className={`relative h-9 w-9 rounded-full border-2 transition-all duration-300 
                                  
                                  ${!isAllowed 
                                    ? 'opacity-40 cursor-not-allowed' 
                                    : 'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
                                  }

                                  ${isAllowed && hasProgress
                                    ? theme === 'dark'
                                      ? 'border-cyan-400/70'
                                      : 'border-cyan-500/80'
                                    : theme === 'dark'
                                      ? 'border-gray-700 hover:border-gray-500'
                                      : 'border-slate-300 hover:border-slate-400'
                                  }`}
                                title={isAllowed ? `Completion: ${completionPercentage}%` : 'Not scheduled'}
                              >
                                <CircularProgressIndicator
                                  percentage={completionPercentage}
                                  theme={theme}
                                  disabled={!isAllowed}
                                />
                                {isAllowed && completionPercentage === 100 && (
                                  <svg
                                    className="relative z-9 mx-auto h-5 w-5 text-white"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M5 10.5l3.2 3.1L15 6.8"
                                      stroke="currentColor"
                                      strokeWidth="2.4"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </button>
                            </td>

                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daily Progress Chart - Full width below habits */}
            <div className={`rounded-3xl p-6 shadow-lg transition-colors duration-200 ${
              theme === 'dark' 
                ? 'border border-gray-800 bg-gray-900/90' 
                : 'border border-slate-200 bg-white'
            }`}>
              <h2 className={`mb-4 text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Daily Progress
              </h2>
              {graphLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Loading chart...
                  </p>
                </div>
              ) : graphData && graphData.dailyData && graphData.dailyData.length > 0 ? (
                <div className="overflow-x-auto pb-2">
                  <div style={{ minWidth: '1000px', height: '192px' }}>
                    <Bar
                      data={{
                        labels: graphData.dailyData.map((item) => item.day),
                        datasets: [
                          {
                            label: 'Completion Rate (%)',
                            data: graphData.dailyData.map((item) => item.completionRate),
                            backgroundColor: theme === 'dark' 
                              ? 'rgba(55, 154, 230, 0.8)' 
                              : 'rgba(10, 181, 203, 0.8)',
                            borderColor: theme === 'dark' 
                              ? '#379AE6' 
                              : '#0AB5CB',
                            borderWidth: 1,
                            borderRadius: 4,
                            borderSkipped: false,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            titleColor: theme === 'dark' ? '#fff' : '#000',
                            bodyColor: theme === 'dark' ? '#fff' : '#000',
                            borderColor: theme === 'dark' ? '#379AE6' : '#0AB5CB',
                            borderWidth: 1,
                            callbacks: {
                              label: function(context) {
                                return `Completion: ${context.parsed.y.toFixed(1)}%`;
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                              callback: function(value) {
                                return value + '%';
                              },
                            },
                            grid: {
                              color: theme === 'dark' ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)',
                            },
                          },
                          x: {
                            ticks: {
                              color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                            },
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No data available
                  </p>
                </div>
              )}
            </div>
          </div> 

          {/* Right: Overall Progress Card + Metric Boxes */}
          <div className="space-y-6 lg:col-span-1">
            {/* Overall Progress Card */}
            <div className={`h-[80vh] sm:h-[75vh] lg:h-[600px]
                          flex flex-col rounded-3xl p-5 transition-all duration-300 sm:p-6 lg:p-8
                          ${theme === 'dark'
                            ? 'border border-gray-700/50 bg-gray-900/90'
                            : 'border border-gray-200/80 bg-white shadow-lg'
                          }`}
            // style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
            >
              <h2 className={`mb-6 text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Overall Progress
              </h2>
              
                <div className="flex-1 overflow-y-auto pb-2">
                  {habits.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                      <div className={`text-6xl mb-4 ${
                        theme === 'dark' ? 'opacity-80' : 'opacity-90'
                      }`}>
                        🪴
                      </div>

                      <h3 className={`text-lg font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        No Habits Yet
                      </h3>

                      <p className={`text-sm mb-6 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Looks empty here 👀 <br />
                        Add your first habit and start tracking your progress.
                      </p>

                      <div className={`px-5 py-2 rounded-full text-sm font-medium ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 border border-gray-700'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        ✨ Consistency builds success
                      </div>
                    </div>
                  ) : (
                    /* HABITS LIST */
                    <div className="space-y-6">
                      {habits.map(habit => (
                        <div key={habit._id}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{habit.icon}</span>
                              <span className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {habit.title}
                              </span>
                            </div>
                            <span className={`text-sm font-semibold ${
                              theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
                            }`}>
                              {habitStats[habit._id]?.completionRate?.toFixed(1) ?? 0}%
                            </span>
                          </div>

                          <div className={`w-full h-2 rounded-full overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                          }`}>
                            <div
                              className={`h-full transition-all ${
                                theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
                              }`}
                              style={{
                                width: `${habitStats[habit._id]?.completionRate ?? 0}%`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

            </div>

            {/* Metric Tiles - 2x2 Grid below Overall Progress */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Completed', value: totalCompleted, icon: '✅', gradient: 'from-green-400 to-emerald-500' },
                { label: 'Average Rate', value: `${averageRate.toFixed(1)}%`, icon: '📊', gradient: 'from-blue-400 to-cyan-500' },
                { 
                  label: 'Best Day', 
                  value: bestDay?.bestDay
                    ? new Date(bestDay.bestDay).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short'
                      })
                    : '—',
                  icon: '🏆',
                  gradient: 'from-yellow-400 to-orange-500'
                },
                { 
                  label: 'Active Days', 
                  value: activeDays,
                  icon: '🔥',
                  gradient: 'from-pink-400 to-rose-500'
                },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className={`group relative h-[138px] overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${
                    theme === 'dark' 
                      ? 'border border-gray-700/50 bg-gray-900/90 hover:border-cyan-700/60' 
                      : 'border border-gray-200/80 bg-white shadow-md hover:border-cyan-200 hover:shadow-lg'
                  }`}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${metric.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}></div>
                  
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`grid h-9 w-9 place-items-center rounded-xl text-xl ${
                        theme === 'dark' ? 'bg-gray-800/90' : 'bg-slate-100'
                      }`}>{metric.icon}</span>
                      <div className={`h-8 w-1 rounded-full ${
                        theme === 'dark' ? 'bg-gray-700/90' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-2 uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {metric.label}
                      </p>
                      <p className={`text-3xl font-semibold ${
                        theme === 'dark' ? 'text-[#379AE6]' : 'text-[#0AB5CB]'
                      }`}>
                        {metric.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {completionPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          onClick={closeCompletionPicker}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-xs rounded-2xl border p-5 shadow-2xl ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-900'
                : 'border-slate-200 bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Set completion
            </h3>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {completionPicker.dateLabel}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {COMPLETION_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => updateDayCompletion(option)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                    completionPicker.currentPercentage === option
                      ? theme === 'dark'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                        : 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : theme === 'dark'
                        ? 'border-gray-700 text-gray-200 hover:border-gray-500'
                        : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {option}%
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => updateDayCompletion(0)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:border-gray-500'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                Reset
              </button>
              <button
                onClick={closeCompletionPicker}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:border-gray-500'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && selectedHabit && (
  <HabitModal
    habit={selectedHabit}
    onClose={closeHabitModal}
    onUpdated={fetchHabits}   // refresh list after update/delete
  />
)}
    </div>
  )
}

export default Dashboard
