import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import API from '../config/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const defaultOverview = {
  summary: {
    activeHabits: 0,
    averageCompletion: 0,
    longestStreak: 0,
    bestMonth: {
      monthKey: null,
      label: 'N/A',
      completionRate: 0,
    },
  },
  monthlyProgress: [],
  topHabits: [],
  activity: [],
  metadata: {
    activityDays: 90,
  },
};

const AnalyticsVector = ({ theme }) => {
  const stroke = theme === "dark" ? "#67E8F9" : "#0284C7";
  const fill = theme === "dark" ? "rgba(103,232,249,0.15)" : "rgba(2,132,199,0.15)";

  return (
    <svg viewBox="0 0 200 140" className="w-full h-auto">
      {/* Bars */}
      <rect x="20" y="70" width="20" height="50" rx="4" fill={fill} stroke={stroke} />
      <rect x="60" y="50" width="20" height="70" rx="4" fill={fill} stroke={stroke} />
      <rect x="100" y="35" width="20" height="85" rx="4" fill={fill} stroke={stroke} />
      <rect x="140" y="60" width="20" height="60" rx="4" fill={fill} stroke={stroke} />

      {/* Line Graph */}
      <polyline
        points="30,75 70,55 110,40 150,65"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};


const Analytics = () => {
  const { theme } = useTheme();
  const [overview, setOverview] = useState(defaultOverview);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${API}/api/v1/analytics/overview?activityDays=90&months=6&topLimit=4`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result?.message || 'Failed to fetch analytics');
        }

        setOverview(result?.data || defaultOverview);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
        toast.error('Could not load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const summary = overview?.summary || defaultOverview.summary;
  const monthlyProgress = overview?.monthlyProgress || [];
  const topHabits = overview?.topHabits || [];
  const activity = overview?.activity || [];
  const activityDays = overview?.metadata?.activityDays || 90;

  const chartData = useMemo(() => {
    const labels = activity.map((item) => item.label);
    const values = activity.map((item) => item.completionRate);
    const borderColor = theme === 'dark' ? '#53B5FF' : '#0EA5E9';

    return {
      labels,
      datasets: [
        {
          label: 'Completion Rate',
          data: values,
          fill: true,
          borderColor,
          borderWidth: 3,
          tension: 0.42,
          cubicInterpolationMode: 'monotone',
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 12,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1,
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return theme === 'dark'
                ? 'rgba(83, 181, 255, 0.22)'
                : 'rgba(14, 165, 233, 0.2)';
            }

            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            if (theme === 'dark') {
              gradient.addColorStop(0, 'rgba(83, 181, 255, 0.35)');
              gradient.addColorStop(1, 'rgba(83, 181, 255, 0.03)');
            } else {
              gradient.addColorStop(0, 'rgba(14, 165, 233, 0.28)');
              gradient.addColorStop(1, 'rgba(14, 165, 233, 0.02)');
            }
            return gradient;
          },
        },
      ],
    };
  }, [activity, theme]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: theme === 'dark' ? '#F8FAFC' : '#0F172A',
          bodyColor: theme === 'dark' ? '#E2E8F0' : '#1E293B',
          borderColor: theme === 'dark' ? '#334155' : '#CBD5E1',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (ctx) => `${ctx.parsed.y.toFixed(1)}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: theme === 'dark' ? '#94A3B8' : '#64748B',
            maxTicksLimit: 10,
          },
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            color: theme === 'dark' ? '#94A3B8' : '#64748B',
            callback: (value) => `${value}%`,
          },
          grid: {
            color: theme === 'dark' ? 'rgba(51, 65, 85, 0.45)' : 'rgba(203, 213, 225, 0.65)',
            drawBorder: false,
          },
        },
      },
      elements: {
        line: {
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
        },
      },
    };
  }, [theme]);

  const statCards = [
    {
      label: 'Active Habits',
      value: summary.activeHabits,
      helper: 'Currently active',
      icon: '🎯',
    },
    {
      label: 'Average Completion',
      value: `${Number(summary.averageCompletion || 0).toFixed(1)}%`,
      helper: `Last ${activityDays} days`,
      icon: '📈',
    },
    {
      label: 'Longest Streak',
      value: `${summary.longestStreak || 0} days`,
      helper: 'All-time activity',
      icon: '🔥',
    },
    {
      label: 'Best Month',
      value: summary.bestMonth?.label || 'N/A',
      helper: `${Number(summary.bestMonth?.completionRate || 0).toFixed(1)}% completion`,
      icon: '🏆',
    },
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0C111D]' : 'bg-slate-50'
    }`}>
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-16 -top-16 h-80 w-80 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-cyan-700/20' : 'bg-sky-300/35'
        }`} />
        <div className={`absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-blue-700/15' : 'bg-cyan-300/30'
        }`} />
      </div>

      <Navbar isAuth={true} userName="Amit" />

      <div className="relative z-10 mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-16">
<div
  className={`rounded-2xl border p-6 mb-5 shadow-md sm:p-7 ${
    theme === 'dark'
      ? 'border-gray-700/60 bg-gradient-to-br from-[#0F1F3D] via-[#0E1B33] to-[#0A1428]'
      : 'border-sky-100 bg-gradient-to-br from-white via-cyan-50 to-sky-100'
  }`}
>
  <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
    
    {/* Left */}
    <div>
      <h1
        className={`text-2xl sm:text-3xl leading-tight ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Habit Analytics
      </h1>

      <p
        className={`mt-1 text-sm sm:text-base ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        Real-time insights from your tracked habits and streak trends.
      </p>
    </div>

    {/* Right Illustration */}
    <div className="mx-auto w-full max-w-[160px] lg:mx-0 lg:ml-auto">
      <AnalyticsVector theme={theme} />
    </div>

  </div>
</div>



        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-[136px] animate-pulse rounded-3xl border ${
                  theme === 'dark' ? 'border-gray-700/60 bg-gray-900/70' : 'border-slate-200 bg-white'
                }`}
              />
            ))}
          </div>
        ) : error ? (
          <div className={`rounded-2xl border p-6 ${
            theme === 'dark' ? 'border-red-800/60 bg-red-950/40 text-red-100' : 'border-red-200 bg-red-50 text-red-700'
          }`}>
            {error}
          </div>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-gray-700/50 bg-gray-900/90 hover:border-cyan-700/60'
                      : 'border-gray-200/80 bg-white shadow-md hover:border-cyan-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${
                      theme === 'dark' ? 'bg-gray-800/90' : 'bg-slate-100'
                    }`}>{stat.icon}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Live
                    </span>
                  </div>

                  <p className={`mt-5 text-xs uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {stat.label}
                  </p>
                  <p className={`mt-2 text-3xl font-semibold ${
                    theme === 'dark' ? 'text-[#53B5FF]' : 'text-[#0284C7]'
                  }`}>
                    {stat.value}
                  </p>
                  <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stat.helper}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className={`lg:col-span-2 rounded-3xl border p-7 transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-gray-700/50 bg-gray-900/90'
                  : 'border-gray-200/80 bg-white shadow-md'
              }`}>
                <h2 className={`text-2xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Monthly Progress
                </h2>

                {monthlyProgress.length === 0 ? (
                  <p className={`mt-5 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    No monthly progress data yet.
                  </p>
                ) : (
                  <div className="mt-6 space-y-5">
                    {monthlyProgress.map((item) => (
                      <div key={item.monthKey}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-200' : 'text-slate-700'
                          }`}>
                            {item.label}
                          </span>
                          <span className={`text-sm font-semibold ${
                            theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
                          }`}>
                            {item.completionRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className={`h-3 w-full overflow-hidden rounded-full ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                        }`}>
                          <div
                            className={`h-full rounded-full ${
                              theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
                            }`}
                            style={{ width: `${item.completionRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`rounded-3xl border p-7 transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-gray-700/50 bg-gray-900/90'
                  : 'border-gray-200/80 bg-white shadow-md'
              }`}>
                <h2 className={`text-2xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Top Habits
                </h2>

                {topHabits.length === 0 ? (
                  <p className={`mt-5 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    No ranked habits yet.
                  </p>
                ) : (
                  <div className="mt-6 space-y-5">
                    {topHabits.map((habit) => (
                      <div key={habit.habitId}>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{habit.icon || '⭐'}</span>
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-200' : 'text-slate-700'
                            }`}>
                              {habit.title}
                            </span>
                          </div>
                          <span className={`text-sm font-semibold ${
                            theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
                          }`}>
                            {habit.completionRate.toFixed(1)}%
                          </span>
                        </div>

                        <div className={`h-2.5 w-full overflow-hidden rounded-full ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                        }`}>
                          <div
                            className={`h-full rounded-full ${
                              theme === 'dark' ? 'bg-accent-dark' : 'bg-accent-light'
                            }`}
                            style={{ width: `${habit.completionRate}%` }}
                          />
                        </div>

                        <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Active: {habit.activeDays}/{habit.scheduledDays} days
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-3xl border p-7 transition-all duration-300 ${
              theme === 'dark'
                ? 'border-gray-700/50 bg-gray-900/90'
                : 'border-gray-200/80 bg-white shadow-md'
            }`}>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    90-Day Activity
                  </h2>
                  <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Smoothed daily completion trend over the last {activityDays} days.
                  </p>
                </div>
              </div>

              <div className="h-72">
                {activity.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      No activity data available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
