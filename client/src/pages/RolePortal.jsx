import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiUser, FiActivity, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import playerBg from '../assets/turfgate_portal_bg.png';
import ownerBg from '../assets/turfgate_ad_banner.png';
import TurfGateLogo from '../components/TurfGateLogo';

const RolePortal = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [hoveredSide, setHoveredSide] = useState(null); // 'player' | 'owner' | null
  const [mobileActiveRole, setMobileActiveRole] = useState('player'); // 'player' | 'owner'

  const handleRoleSelect = (role, action) => {
    localStorage.setItem('selected_role', role);
    if (action === 'signin') {
      navigate(`/signin?role=${role}`);
    } else {
      navigate(`/signup?role=${role}`);
    }
  };

  // Dynamic backgrounds based on active theme
  const playerBgGradient = theme === 'dark'
    ? `linear-gradient(to top, rgba(15, 23, 42, 0.95) 20%, rgba(15, 23, 42, 0.6) 70%, rgba(15, 23, 42, 0.3)), url(${playerBg})`
    : `linear-gradient(to top, rgba(248, 250, 252, 0.95) 20%, rgba(248, 250, 252, 0.65) 70%, rgba(248, 250, 252, 0.3)), url(${playerBg})`;

  const ownerBgGradient = theme === 'dark'
    ? `linear-gradient(to top, rgba(15, 23, 42, 0.95) 20%, rgba(15, 23, 42, 0.6) 70%, rgba(15, 23, 42, 0.3)), url(${ownerBg})`
    : `linear-gradient(to top, rgba(248, 250, 252, 0.95) 20%, rgba(248, 250, 252, 0.65) 70%, rgba(248, 250, 252, 0.3)), url(${ownerBg})`;

  const mobileBgGradient = theme === 'dark'
    ? `linear-gradient(to top, rgba(15, 23, 42, 0.98) 30%, rgba(15, 23, 42, 0.8) 70%, rgba(15, 23, 42, 0.5)), url(${mobileActiveRole === 'player' ? playerBg : ownerBg})`
    : `linear-gradient(to top, rgba(248, 250, 252, 0.98) 30%, rgba(248, 250, 252, 0.85) 70%, rgba(248, 250, 252, 0.5)), url(${mobileActiveRole === 'player' ? playerBg : ownerBg})`;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative select-none bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Top Floating Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-30 pointer-events-none">
        <motion.div 
          className="flex items-center gap-2 pointer-events-auto cursor-pointer"
          onClick={() => navigate('/home')}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TurfGateLogo size={34} />
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
            TurfGate
          </span>
        </motion.div>

        {/* Custom Soulful Theme Toggle Pill */}
        <motion.div
          className="p-1 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 flex items-center gap-0.5 pointer-events-auto relative shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-black z-10 flex items-center gap-1.5 cursor-pointer transition-colors duration-300 ${
              theme === 'light' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {theme === 'light' && (
              <motion.div
                layoutId="activeThemePill"
                className="absolute inset-0 bg-slate-900 dark:bg-white rounded-xl -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <FiSun size={13} />
            <span>Light</span>
          </button>
          
          <button
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-black z-10 flex items-center gap-1.5 cursor-pointer transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-900 dark:text-slate-900' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
            }`}
          >
            {theme === 'dark' && (
              <motion.div
                layoutId="activeThemePill"
                className="absolute inset-0 bg-slate-900 dark:bg-white rounded-xl -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <FiMoon size={13} />
            <span>Dark</span>
          </button>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP SPLIT VIEW (md and up) */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-1 flex-row h-full w-full relative">
        {/* Division Circle Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <motion.div 
            className={`w-20 h-20 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-2xl transition-all duration-500 bg-white/90 dark:bg-slate-950/90 ${
              hoveredSide === 'player' 
                ? 'border-emerald-500 shadow-emerald-500/25 dark:shadow-emerald-500/20' 
                : hoveredSide === 'owner' 
                  ? 'border-cyan-500 shadow-cyan-500/25 dark:shadow-cyan-500/20' 
                  : 'border-slate-200 dark:border-white/10 shadow-slate-900/5 dark:shadow-black/40'
            }`}
            animate={{ rotate: hoveredSide ? (hoveredSide === 'player' ? -15 : 15) : 0 }}
          >
            <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">TG</span>
          </motion.div>
        </div>

        {/* PLAYER PANEL */}
        <motion.div
          className="relative flex-1 flex flex-col justify-end p-8 sm:p-12 md:p-16 transition-all duration-700 ease-out cursor-pointer group"
          style={{
            backgroundImage: playerBgGradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{
            flex: hoveredSide === 'player' ? 1.4 : hoveredSide === 'owner' ? 0.65 : 1
          }}
          onMouseEnter={() => setHoveredSide('player')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          {/* Glow overlay */}
          <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="space-y-6 z-10 max-w-md pointer-events-auto">
            <motion.div 
              className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <FiUser size={24} />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Player <br className="hidden md:block"/> Arena
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Book box cricket and football slots, sign up for competitive leagues, and rise in the local standings.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-350">
              <div className="flex items-center gap-2">
                <FiActivity className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Instant Slots Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Competitive Leagues</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => handleRoleSelect('player', 'signin')}
                className="py-3.5 px-6 rounded-xl bg-emerald-50/50 dark:bg-white/10 hover:bg-emerald-100/80 dark:hover:bg-white/20 text-emerald-700 dark:text-white font-bold text-sm transition-all border border-emerald-200/50 dark:border-white/10 cursor-pointer flex items-center justify-center"
              >
                Sign In
              </button>
              <button
                onClick={() => handleRoleSelect('player', 'signup')}
                className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center justify-center"
              >
                Join the Arena
              </button>
            </div>
          </div>
        </motion.div>

        {/* OWNER PANEL */}
        <motion.div
          className="relative flex-1 flex flex-col justify-end p-8 sm:p-12 md:p-16 transition-all duration-700 ease-out cursor-pointer group"
          style={{
            backgroundImage: ownerBgGradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{
            flex: hoveredSide === 'owner' ? 1.4 : hoveredSide === 'player' ? 0.65 : 1
          }}
          onMouseEnter={() => setHoveredSide('owner')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          {/* Glow overlay */}
          <div className="absolute inset-0 bg-cyan-500/5 dark:bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="space-y-6 z-10 max-w-md pointer-events-auto">
            <motion.div 
              className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <FiBriefcase size={22} />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Turf <br className="hidden md:block"/> Manager
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                List your multi-sport fields, manage slot schedules, track real-time bookings, and host tournaments.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-350">
              <div className="flex items-center gap-2">
                <FiActivity className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Full Schedule Planner</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Revenue Dashboard</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => handleRoleSelect('admin', 'signin')}
                className="py-3.5 px-6 rounded-xl bg-cyan-50/50 dark:bg-white/10 hover:bg-cyan-100/80 dark:hover:bg-white/20 text-cyan-700 dark:text-white font-bold text-sm transition-all border border-cyan-200/50 dark:border-white/10 cursor-pointer flex items-center justify-center"
              >
                Sign In
              </button>
              <button
                onClick={() => handleRoleSelect('admin', 'signup')}
                className="py-3.5 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/25 flex items-center justify-center"
              >
                List Your Turf
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE PREMIUM VIEW (below md) */}
      {/* ========================================================================= */}
      <div 
        className="flex md:hidden flex-1 flex-col justify-center items-center px-6 relative transition-all duration-500"
        style={{
          backgroundImage: mobileBgGradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 dark:from-slate-950/80 to-transparent pointer-events-none" />

        <motion.div 
          className="w-full max-w-sm bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 mt-16 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          {/* Custom Toggle Selector */}
          <div className="flex bg-slate-200/50 dark:bg-slate-950/50 p-1 rounded-2xl w-full border border-slate-300/30 dark:border-slate-800 relative">
            <motion.div 
              className={`absolute top-1 bottom-1 rounded-xl shadow-md ${
                mobileActiveRole === 'player' ? 'bg-emerald-600' : 'bg-cyan-600'
              }`}
              layoutId="mobileActivePill"
              initial={false}
              animate={{
                left: mobileActiveRole === 'player' ? '4px' : 'calc(50% + 2px)',
                right: mobileActiveRole === 'player' ? 'calc(50% + 2px)' : '4px'
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
            <button 
              onClick={() => setMobileActiveRole('player')}
              className={`flex-1 py-2 text-center text-xs font-black z-10 cursor-pointer transition-colors duration-300 ${
                mobileActiveRole === 'player' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              PLAYER ARENA
            </button>
            <button 
              onClick={() => setMobileActiveRole('owner')}
              className={`flex-1 py-2 text-center text-xs font-black z-10 cursor-pointer transition-colors duration-300 ${
                mobileActiveRole === 'owner' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              TURF MANAGER
            </button>
          </div>

          {/* Animated Card Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileActiveRole}
              initial={{ opacity: 0, x: mobileActiveRole === 'player' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mobileActiveRole === 'player' ? 20 : -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 min-h-[260px]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  mobileActiveRole === 'player' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                }`}>
                  {mobileActiveRole === 'player' ? <FiUser size={22} /> : <FiBriefcase size={20} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {mobileActiveRole === 'player' ? 'Player Arena' : 'Turf Manager'}
                  </h3>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    mobileActiveRole === 'player' ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'
                  }`}>
                    {mobileActiveRole === 'player' ? 'Book & Play' : 'Host & Earn'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                {mobileActiveRole === 'player' 
                  ? 'Book box cricket and football slots, sign up for competitive leagues, and rise in the local standings.'
                  : 'List your multi-sport fields, manage slot schedules, track real-time bookings, and host tournaments.'
                }
              </p>

              {/* Stats / Highlight */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-200/50 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-350">
                <div className="flex items-center gap-1.5">
                  <FiActivity className={mobileActiveRole === 'player' ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'} />
                  <span>{mobileActiveRole === 'player' ? 'Instant Slots' : 'Full Planner'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiTrendingUp className={mobileActiveRole === 'player' ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'} />
                  <span>{mobileActiveRole === 'player' ? 'Leaderboards' : 'Revenue Stats'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-auto">
                <button
                  onClick={() => handleRoleSelect(mobileActiveRole === 'player' ? 'player' : 'admin', 'signup')}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                    mobileActiveRole === 'player' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25'
                      : 'bg-cyan-600 hover:bg-cyan-700 shadow-md shadow-cyan-500/25'
                  }`}
                >
                  {mobileActiveRole === 'player' ? 'Join the Arena' : 'List Your Turf'}
                </button>
                <button
                  onClick={() => handleRoleSelect(mobileActiveRole === 'player' ? 'player' : 'admin', 'signin')}
                  className={`w-full py-3 rounded-xl border font-bold text-sm transition-all cursor-pointer flex items-center justify-center bg-transparent ${
                    mobileActiveRole === 'player'
                      ? 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-950/60 hover:bg-emerald-500/10'
                      : 'text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-950/60 hover:bg-cyan-500/10'
                  }`}
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
};

export default RolePortal;

