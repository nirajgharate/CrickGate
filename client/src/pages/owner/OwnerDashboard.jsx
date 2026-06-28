import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, FiUsers, FiMapPin, FiActivity, FiArrowUpRight, 
  FiPlusCircle, FiTrendingUp, FiMessageSquare, FiStar, FiClock,
  FiCalendar, FiCheckCircle, FiAlertCircle, FiZap, FiAward,
  FiEye, FiSettings, FiBarChart2, FiTarget, FiCoffee
} from 'react-icons/fi';
import { HiOutlineFire, HiOutlineLightningBolt } from 'react-icons/hi';
import api from '../../api/api';

// Real Unsplash sport images
const HERO_COVER = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=85&fit=crop";
const CRICKET_IMG = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80&fit=crop";
const FOOTBALL_IMG = "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=600&q=80&fit=crop";
const BASKETBALL_IMG = "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80&fit=crop";
const AVATAR_1 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face";
const AVATAR_2 = "https://images.unsplash.com/photo-1494790108755-2616b332ad44?w=80&q=80&fit=crop&crop=face";
const AVATAR_3 = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&fit=crop&crop=face";
const AVATAR_4 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&fit=crop&crop=face";
const OWNER_AVATAR = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80&fit=crop&crop=face";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [owner, setOwner] = useState(null);

  const getInitials = (name) => {
    if (!name) return "TG";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return "from-emerald-500 to-teal-600";
    const colors = [
      "from-emerald-500 to-teal-600",
      "from-cyan-500 to-blue-600",
      "from-indigo-500 to-purple-600",
      "from-pink-500 to-rose-600",
      "from-amber-500 to-orange-600"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const [stats, setStats] = useState({
    totalRevenue: 0,
    bookingsCount: 0,
    activeTurfsCount: 0,
    occupancyRate: 0,
    monthlyRevenueTrend: [],
    sportsDistribution: [],
    recentBookings: [],
    recentReviews: [],
    liveOccupancy: []
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/owner/stats');
        if (res.data?.success) {
          if (res.data.owner) {
            setOwner(res.data.owner);
          }
          if (res.data.stats) {
            const apiStats = res.data.stats;
            
            // Re-map visual colors and images for sports distribution
            const sportsWithVisuals = (apiStats.sportsDistribution || []).map(item => {
              let color = '#10b981';
              let img = CRICKET_IMG;
              if (item.name === 'Football') {
                color = '#06b6d4';
                img = FOOTBALL_IMG;
              } else if (item.name === 'Basketball') {
                color = '#f59e0b';
                img = BASKETBALL_IMG;
              }
              return { ...item, color, img };
            });

            setStats({
              ...apiStats,
              sportsDistribution: sportsWithVisuals,
              recentReviews: apiStats.recentReviews || [],
              liveOccupancy: apiStats.liveOccupancy || [],
              recentBookings: apiStats.recentBookings || []
            });
          }
        }
      } catch (err) {
        console.log("Error loading dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // SVG Bar Chart Math
  const barChartWidth = 500;
  const barChartHeight = 200;
  const maxRevenue = stats.monthlyRevenueTrend.length > 0 
    ? Math.max(...stats.monthlyRevenueTrend.map(d => d.revenue)) 
    : 0;
  const maxRevenueVal = maxRevenue || 1;
  const padding = 30;

  // SVG Donut
  const totalSportsVal = stats.sportsDistribution.reduce((acc, item) => acc + item.value, 0) || 1;
  let accumulatedAngle = 0;
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const kpiCards = [
    {
      label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign, color: 'emerald', change: '+12.4%', trend: 'up',
      sub: 'This season'
    },
    {
      label: 'Total Bookings', value: stats.bookingsCount,
      icon: FiCalendar, color: 'cyan', change: '+8.1%', trend: 'up',
      sub: 'Last 30 days'
    },
    {
      label: 'Active Arenas', value: stats.activeTurfsCount,
      icon: FiMapPin, color: 'violet', change: 'Stable', trend: 'neutral',
      sub: 'All operational'
    },
    {
      label: 'Avg Occupancy', value: `${stats.occupancyRate}%`,
      icon: FiBarChart2, color: 'amber', change: '+3.5%', trend: 'up',
      sub: 'Peak hours'
    }
  ];

  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' },
    cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-500',    border: 'border-cyan-500/20',    glow: 'shadow-cyan-500/10'    },
    violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-500',  border: 'border-violet-500/20',  glow: 'shadow-violet-500/10'  },
    amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-500',   border: 'border-amber-500/20',   glow: 'shadow-amber-500/10'   }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-24">

      {/* ═══════════════════════════════════════════════════════
           CINEMATIC HERO BANNER
         ═══════════════════════════════════════════════════════ */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={HERO_COVER}
          alt="Sports ground aerial view"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              ⚡ Operations Center
            </span>

            <div className="flex items-center gap-4 mt-4">
              {owner?.avatar ? (
                <img
                  src={owner.avatar}
                  alt={owner.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl hidden sm:block animate-fade-in"
                />
              ) : (
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarColor(owner?.name || '')} flex items-center justify-center text-white font-black text-lg tracking-wider border-2 border-white/10 shadow-xl hidden sm:flex shrink-0`}>
                  {getInitials(owner?.name || '')}
                </div>
              )}
              <div>
                <p className="text-slate-400 text-sm font-semibold">{greeting}, {owner?.name || 'Arena Owner'} 👋</p>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                  TurfGate Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <button
                onClick={() => navigate('/owner/turfs')}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 text-sm cursor-pointer"
              >
                <FiPlusCircle size={15} />
                Add New Turf / Tournament
              </button>
              <button
                onClick={() => navigate('/owner/profile')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2.5 px-5 rounded-xl transition-all text-sm backdrop-blur-sm cursor-pointer"
              >
                <FiSettings size={14} />
                Business Profile
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8 relative z-10">

        {/* ═══════════════════════════════════════════════════════
             KPI CARDS
           ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {kpiCards.map((card, idx) => {
            const c = colorMap[card.color];
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`bg-white dark:bg-slate-900/80 backdrop-blur-md border ${c.border} dark:border-slate-800/80 rounded-2xl p-5 shadow-lg ${c.glow} hover:shadow-xl transition-all duration-300 cursor-default`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${card.trend === 'up' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {card.change}
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════
             LIVE ARENA MONITOR
           ═══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Arena Monitor
            </h2>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Real-time
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            {stats.liveOccupancy.length > 0 ? (
              stats.liveOccupancy.map((loc, idx) => (
                <div key={loc.id} className="relative overflow-hidden group">
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <img src={loc.img} alt={loc.sport} className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500 scale-105 group-hover:scale-100 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-white/90 dark:via-slate-900/90 to-transparent" />
                  </div>

                  <div className="relative p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-sm">{loc.turfName}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{loc.player}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${loc.status === 'Booked Today' || loc.status === 'In Use' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'}`}>
                        {loc.status}
                      </span>
                    </div>

                    {/* Occupancy bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400">
                        <span>Occupancy</span>
                        <span>{loc.status === 'Booked Today' || loc.status === 'In Use' ? '100%' : '0%'}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: loc.status === 'Booked Today' || loc.status === 'In Use' ? '100%' : '0%' }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                          className={`h-full rounded-full ${loc.status === 'Booked Today' || loc.status === 'In Use' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{loc.sport}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400 dark:text-slate-500 text-sm font-semibold">
                🏟️ No active turfs found. Go to "List New Turf" to list one.
              </div>
            )}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════
             CHARTS — Revenue Bar + Sport Donut
           ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-500" /> Monthly Revenue Trend
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Last 6 months performance</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-500">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 font-bold">Total this season</p>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <svg width="100%" viewBox={`0 0 ${barChartWidth} ${barChartHeight + 40}`} className="overflow-visible">
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                  <line
                    key={i}
                    x1={padding} y1={padding + (barChartHeight - 2 * padding) * (1 - r)}
                    x2={barChartWidth - padding} y2={padding + (barChartHeight - 2 * padding) * (1 - r)}
                    stroke="rgba(148,163,184,0.1)" strokeWidth={1} strokeDasharray="4,4"
                  />
                ))}

                {/* Bars */}
                {stats.monthlyRevenueTrend.map((data, idx) => {
                  const numBars = stats.monthlyRevenueTrend.length;
                  const chartInnerWidth = barChartWidth - 2 * padding;
                  const barWidth = 38;
                  const gap = (chartInnerWidth - numBars * barWidth) / (numBars - 1);
                  const x = padding + idx * (barWidth + gap);
                  const ratio = data.revenue / maxRevenueVal;
                  const chartInnerHeight = barChartHeight - 2 * padding;
                  const barHeight = chartInnerHeight * ratio;
                  const y = barChartHeight - padding - barHeight;
                  const isLast = idx === stats.monthlyRevenueTrend.length - 1;

                  return (
                    <g key={idx} className="group cursor-pointer">
                      <motion.rect
                        x={x} y={y} width={barWidth} height={barHeight} rx={8}
                        fill={isLast ? "url(#barGradient)" : "rgba(16,185,129,0.35)"}
                        className="hover:fill-emerald-400 transition-all duration-300"
                        style={{ filter: isLast ? "drop-shadow(0 0 8px rgba(16,185,129,0.4))" : "none" }}
                        initial={{ height: 0, y: barChartHeight - padding }}
                        animate={{ height: barHeight, y }}
                        transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                      />
                      <text
                        x={x + barWidth / 2} y={y - 8}
                        textAnchor="middle" fontSize={10} fontWeight="700"
                        className="fill-emerald-500 dark:fill-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ₹{(data.revenue / 1000).toFixed(1)}k
                      </text>
                      <text
                        x={x + barWidth / 2} y={barChartHeight - padding + 18}
                        textAnchor="middle" fontSize={11} fontWeight="600"
                        className="fill-slate-400 dark:fill-slate-500"
                      >
                        {data.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </motion.div>

          {/* Sport Donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-lg flex flex-col"
          >
            <h2 className="font-black text-slate-900 dark:text-white mb-1">🎯 Bookings By Sport</h2>
            <p className="text-xs text-slate-400 mb-4">Distribution this season</p>

            <div className="relative flex justify-center py-2">
              <svg width="150" height="150" viewBox="-1 -1 2 2" className="overflow-visible -rotate-90">
                {stats.sportsDistribution.map((item, idx) => {
                  const percent = item.value / totalSportsVal;
                  const [startX, startY] = getCoordinatesForPercent(accumulatedAngle);
                  accumulatedAngle += percent;
                  const [endX, endY] = getCoordinatesForPercent(accumulatedAngle);
                  const largeArcFlag = percent > 0.5 ? 1 : 0;
                  const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
                  return (
                    <path
                      key={idx}
                      d={pathData}
                      fill={item.color}
                      fillOpacity={0.8}
                      stroke="rgba(0,0,0,0.05)"
                      strokeWidth={0.02}
                      style={{ filter: `drop-shadow(0 0 6px ${item.color}44)` }}
                    />
                  );
                })}
                <circle cx="0" cy="0" r="0.58" fill="white" className="dark:hidden" />
                <circle cx="0" cy="0" r="0.58" className="hidden dark:inline fill-slate-900" />
                <text x="0" y="0.08" textAnchor="middle" fontSize="0.18" fontWeight="800" fill="#10b981">
                  {stats.bookingsCount}
                </text>
                <text x="0" y="0.28" textAnchor="middle" fontSize="0.12" fill="#94a3b8">
                  total
                </text>
              </svg>
            </div>

            <div className="space-y-3 mt-4 flex-1">
              {stats.sportsDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>{item.name}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.6 + idx * 0.15 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════
             RECENT BOOKINGS + PLAYER REVIEWS
           ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Bookings Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FiCalendar className="text-cyan-500" /> Recent Bookings
              </h2>
              <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1">
                View All <FiArrowUpRight size={11} />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    {b.avatar ? (
                      <img src={b.avatar} alt={b.userName} className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 font-black text-sm flex items-center justify-center shrink-0 border border-cyan-500/20">
                        {b.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{b.userName}</p>
                      <p className="text-xs text-slate-500 truncate">{b.turfName} · {b.date} · {b.timeSlot}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-slate-900 dark:text-white text-sm">₹{b.amount}</p>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        b.status === 'confirmed' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' :
                        b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                  📅 No bookings scheduled yet.
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">KYC Verified Account</span>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <FiCheckCircle size={10} /> Payout Settlement Active
              </span>
            </div>
          </motion.div>

          {/* Reviews Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FiMessageSquare className="text-emerald-500" /> Player Feedback
              </h2>
              <span className="flex items-center gap-1 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Reviews
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto custom-scrollbar">
              {stats.recentReviews.length > 0 ? (
                stats.recentReviews.map((rev) => (
                  <div key={rev.id} className="px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start gap-3">
                      {rev.avatar ? (
                        <img src={rev.avatar} alt={rev.userName} className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-500 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500/20 mt-0.5">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm">{rev.userName}</p>
                            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{rev.turfName}</p>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar key={i} size={11} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                  📝 No player reviews written yet.
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">Avg Rating: ⭐ 4.8 / 5</span>
                <span className="text-[10px] text-slate-400 font-bold">{stats.bookingsCount}+ happy players</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════
             QUICK ACTION SHORTCUTS
           ═══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: FiPlusCircle, label: 'List New Turf', sub: 'Add an arena', color: 'emerald', action: () => navigate('/owner/turfs') },
            { icon: FiAward, label: 'Create Tournament', sub: 'Host a league', color: 'amber', action: () => navigate('/owner/turfs') },
            { icon: FiEye, label: 'View Bookings', sub: 'Check schedule', color: 'cyan', action: () => navigate('/owner/turfs') },
            { icon: FiSettings, label: 'Business Profile', sub: 'Manage settings', color: 'violet', action: () => navigate('/owner/profile') }
          ].map((item, idx) => {
            const c = colorMap[item.color];
            const Icon = item.icon;
            return (
              <motion.button
                key={idx}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={item.action}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900/80 border ${c.border} dark:border-slate-800 shadow-md hover:shadow-lg transition-all text-left cursor-pointer group`}
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={18} />
                </div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{item.label}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.sub}</p>
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default OwnerDashboard;
