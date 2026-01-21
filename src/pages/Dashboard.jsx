import React, { useState , useEffect } from 'react'
import { useLayoutEffect } from "react";
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import { toast } from "react-hot-toast"
import HabitModal from '../components/HabitModal'
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

  const [checkedDays, setCheckedDays] = useState({})

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
  

const toggleDay = async (habitId, day) => {

  const now = new Date();

  const date = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth(),
    day
  );

  // normalize local date
  date.setHours(0, 0, 0, 0);

  console.log("the date>>>>>>>>", date)

  const key = formatKey(habitId, date);

  const newCompleted = !entries[key];

  // Optimistic update
  setEntries(prev => ({
    ...prev,
    [key]: newCompleted
  }));
  const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  try {
    const token = localStorage.getItem("token");

    await fetch(`${API}/api/v1/habits/${habitId}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      
      body: JSON.stringify({
        date: dateStr,
        completed: newCompleted
      })
    });

    // Refresh graph data after entry update
    fetchGraphData();
    // toast.success("Updated ✔️");
  } catch (err) {

    // rollback
    setEntries(prev => ({
      ...prev,
      [key]: !newCompleted
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
          map[key] = entry.completed;
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
    <div className={`min-h-screen  transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0C111D]' : 'bg-gray-50'
    }`}>
      <Navbar isAuth={true} userName="Amit" />
      
      <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-16 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Stoic Habit
          </h1>
          <p className={`text-md ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Track your daily habits and build consistency
          </p>
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Habit Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div  className={`rounded-3xl p-8 transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-900 border border-gray-700/50' 
                : 'bg-white border border-gray-200/80'
            }`}
            style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
            >

                {/* HEADER */}
                <div className=" relative flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8">

                  {/* LEFT : TITLE */}
                  <div className="flex flex-col mb-4 md:mb-0">
                    <h2 className={`text-2xl font-semibold tracking-tight ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Your Habits
                    </h2>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Track your consistency over time
                    </span>
                  </div>

                  {/* CENTER : MONTH SELECTOR */}
                  <div className="flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2 mb-4 md:mb-0">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
                      theme === 'dark'
                        ? 'border-gray-700 bg-gray-800/60'
                        : 'border-gray-200 bg-gray-100/60'
                    }`}>
                      <button
                        onClick={() => {
                          hasAutoScrolledRef.current = false;
                          setCurrentMonthDate(prev =>
                            new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                          );
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          theme === 'dark'
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        <FaArrowLeft />
                      </button>

                      <span className={`text-sm font-medium w-28 text-center ${
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
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          theme === 'dark'
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-200 text-gray-600'
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
                      px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${theme === 'dark'
                        ? 'bg-accent-dark text-white'
                        : 'bg-accent-light text-white'
                      }`}
                  >
                    <span className="text-lg leading-none">+</span>
                    Add Habit
                  </Link>
                </div>

                </div>

                {/* DIVIDER */}
                <div className={`h-px mb-6 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`} />

              {/* Habit Grid */}
              <div ref={gridContainerRef} className="relative overflow-x-auto overflow-y-auto pb-2 rounded-xl flex-1">
                <table className="w-full" style={{ minWidth: '1000px' }}>
                  <thead className="sticky top-0 z-20">
                    <tr>
                      <th className={`sticky left-0 z-10 text-left py-4 px-6 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'
                      }`}
                      style={{ minWidth: '150px', maxWidth: '200px', width: '200px' }}
                      >
                        Habit
                      </th>
                      {days.map(({ day, name }) => (
                        <th key={day} ref={(el) => (dayRefs.current[day] = el)} className={`text-center py-4 px-3 text-xs font-medium ${
                          theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'
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
                                        : 'bg-gray-200 text-gray-900'
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
                      <tr key={habit._id} onClick={() => openHabitModal(habit)} className={`cursor-pointer border-t transition-colors duration-200 hover:bg-opacity-50 ${
                        theme === 'dark' ? 'border-gray-800 hover:bg-gray-800/30' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      style={{ minWidth: '200px', maxWidth: '200px', width: '200px' }}
                      >
                        <td className={`sticky  left-0 z-10 py-5 px-3 ${
                            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
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
                          const isChecked = entries[key];
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
                                  if (isAllowed) toggleDay(habit._id, day)
                                }}
                                className={`w-9 h-9 rounded-xl border-2 transition-all duration-300 
                                  
                                  ${!isAllowed 
                                    ? 'opacity-40 cursor-not-allowed' 
                                    : 'hover:scale-110'
                                  }

                                  ${isAllowed && isChecked
                                    ? theme === 'dark'
                                      ? 'bg-accent-dark border-transparent'
                                      : 'bg-accent-light border-transparent'
                                    : theme === 'dark'
                                      ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
                                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100'
                                  }`}
                              >
                                {isAllowed && isChecked && (
                                  <svg className="w-5 h-5 mx-auto text-white" fill="currentColor">
                                    <path d="M16.7 5.3a1 1 0 01..."/>
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
            <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-900 border border-gray-800' 
                : 'bg-white border border-gray-200'
            }`}>
              <h2 className={`text-xl font-base mb-4 ${
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
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Progress Card */}
            <div className={`rounded-3xl p-5 sm:p-6 lg:p-8
                          flex flex-col transition-all duration-300
                          h-[80vh] sm:h-[75vh] lg:h-[600px]
                          ${theme === 'dark'
                            ? 'bg-gray-900 border border-gray-700/50'
                            : 'bg-white border border-gray-200/80'
                          }`}
            // style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
            >
              <h2 className={`text-xl font-base mb-6 ${
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
                              <span className={`text-sm font-base ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {habit.title}
                              </span>
                            </div>
                            <span className={`text-sm font-base ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
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
                  className={`group relative rounded-2xl p-5 transition-all duration-300 transform hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border border-gray-700/50 hover:border-gray-600' 
                      : 'bg-white border border-gray-200/80 hover:border-gray-300 shadow-md hover:shadow-lg'
                  }`}
                  style={{ height: '138px' }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{metric.icon}</span>
                      <div className={`w-1 h-8 rounded-full ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-2 uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {metric.label}
                      </p>
                      <p className={`text-3xl font-normal ${
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



