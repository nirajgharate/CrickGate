import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, FiMapPin, FiStar, FiArrowRight, FiActivity,
  FiAward, FiHeart, FiClock, FiTrendingUp, FiZap, FiSearch
} from 'react-icons/fi';
import { HiOutlineFire, HiTicket } from 'react-icons/hi';
import { FetchUser } from '../../services/user.services';
import { GetUserBookingsService } from '../../services/booking.services';

// Unsplash real images
const HERO_BG       = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=85&fit=crop";
const CRICKET_IMG   = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80&fit=crop";
const FOOTBALL_IMG  = "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=400&q=80&fit=crop";
const BASKETBALL_IMG = "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80&fit=crop";
const TENNIS_IMG    = "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80&fit=crop";
const USER_AVATAR   = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80&fit=crop&crop=face";
const TOURNAMENT_BG = "https://images.unsplash.com/photo-1544085311-11a028465b03?w=600&q=80&fit=crop";

const FEATURED_TURFS = [
  { id: 1, name: "Battle Ground Arena", location: "Pimpalgaon, Nashik", sport: "Football", price: "₹900/hr", rating: 4.9, reviews: 48, img: FOOTBALL_IMG, badge: "🔥 Trending" },
  { id: 2, name: "Cover Drive Pitch",   location: "Ashok Nagar, Nashik", sport: "Cricket",  price: "₹950/hr", rating: 4.8, reviews: 62, img: CRICKET_IMG,  badge: "⭐ Top Rated" },
  { id: 3, name: "Victory Court",       location: "Nashik Road",         sport: "Basketball", price: "₹700/hr", rating: 4.7, reviews: 31, img: BASKETBALL_IMG, badge: "🆕 New" },
];

const UPCOMING_TOURNAMENTS = [
  { id: 1, name: "Nashik Premier League 2026", sport: "Cricket", date: "12 July 2026", teams: "12/16", prize: "₹25,000", entry: "₹3,000", img: CRICKET_IMG },
  { id: 2, name: "Weekend Warriors Cup",       sport: "Football", date: "20 July 2026", teams: "6/8",  prize: "₹10,000", entry: "₹2,000", img: FOOTBALL_IMG },
];

const QUICK_ACTIONS = [
  { icon: FiSearch,   label: 'Browse Turfs',       sub: 'Find your game',    color: 'emerald', path: '/bookslot' },
  { icon: FiCalendar, label: 'My Bookings',        sub: 'View schedule',     color: 'cyan',    path: '/userprofile' },
  { icon: FiAward,    label: 'Tournaments',        sub: 'Join competitions', color: 'amber',   path: '/tournaments' },
  { icon: FiStar,     label: 'Loyalty Rewards',   sub: '1,250 points',      color: 'violet',  path: '/userprofile' },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("User"));
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [bookings, setBookings] = useState([]);

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

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const getUser = async () => {
      try {
        const res = await FetchUser(userId);
        setUser(res?.user);
      } catch (e) { console.log("User fetch:", e?.message); }
    };
    const getBookings = async () => {
      try {
        const res = await GetUserBookingsService();
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        }
      } catch (e) { console.log("Bookings fetch:", e?.message); }
    };
    getUser();
    getBookings();
  }, []);

  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    cyan:    'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    amber:   'bg-amber-500/10 text-amber-500 border-amber-500/20',
    violet:  'bg-violet-500/10 text-violet-500 border-violet-500/20',
  };

  const displayName = user?.fullName || user?.name || 'Athlete';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-24">

      {/* ══════════════════════════════════
           HERO BANNER
         ══════════════════════════════════ */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={HERO_BG} alt="Sports" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl hidden sm:flex items-center justify-center text-white font-black text-lg select-none bg-gradient-to-br ${
                user?.avatar ? 'bg-slate-100 dark:bg-slate-800' : getAvatarColor(displayName)
              }`}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(displayName)
                )}
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold">{greeting}, {displayName} 👋</p>
                <h1 className="text-3xl md:text-4xl font-black text-white">Your Sports Hub</h1>
              </div>
            </div>

            <p className="text-slate-400 text-sm max-w-lg mb-5">
              Discover premium turfs, join tournaments, and track your athletic journey — all in one place.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate('/bookslot')}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm cursor-pointer"
              >
                <FiSearch size={14} /> Find a Turf Now
              </button>
              <button
                onClick={() => navigate('/tournaments')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-2.5 px-5 rounded-xl backdrop-blur-sm transition-all text-sm cursor-pointer"
              >
                <FiAward size={14} /> Browse Tournaments
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8 relative z-10">

        {/* ══════════════════════════════════
             QUICK ACTIONS
           ══════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(action.path)}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900/80 border shadow-md hover:shadow-lg transition-all text-left cursor-pointer group ${colorMap[action.color].split(' ').slice(2).join(' ')} border-slate-200/50 dark:border-slate-800`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${colorMap[action.color].split(' ').slice(0, 2).join(' ')}`}>
                  <Icon size={18} />
                </div>
                <p className="font-black text-slate-900 dark:text-white text-sm">{action.label}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{action.sub}</p>
              </motion.button>
            );
          })}
        </div>

        {/* ══════════════════════════════════
             ATHLETE STATS
           ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FiActivity className="text-emerald-500" /> Your Athlete Stats
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-800">
            {[
              { icon: HiTicket,     label: 'Sessions Booked', value: bookings.length,      color: 'emerald' },
              { icon: FiHeart,      label: 'Favorite Sport',  value: user?.favoriteSport || 'Not Set', color: 'rose'    },
              { icon: FiAward,      label: 'Loyalty Points',  value: (user?.loyaltyPoints || 0).toLocaleString(),   color: 'amber'   },
              { icon: HiOutlineFire, label: 'Active Streak',  value: bookings.length > 0 ? 'Active' : '0 Weeks', color: 'orange'  },
            ].map((s, i) => {
              const Icon = s.icon;
              const iconColors = { emerald: 'text-emerald-500', rose: 'text-rose-500', amber: 'text-amber-500', orange: 'text-orange-500' };
              return (
                <div key={i} className="p-5 text-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <Icon className={`mx-auto mb-2 text-xl ${iconColors[s.color]}`} />
                  <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════
             FEATURED TURFS
           ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">🏟️ Featured Arenas Near You</h2>
            <button
              onClick={() => navigate('/bookslot')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              View All <FiArrowRight size={11} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_TURFS.map((turf, idx) => (
              <motion.div
                key={turf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + idx * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/turfview/${turf.id}`)}
                className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img src={turf.img} alt={turf.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-black bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                    {turf.badge}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-black bg-slate-900/60 text-white backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                    {turf.sport}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <p className="text-white font-black text-sm">{turf.name}</p>
                    <p className="text-emerald-300 font-black text-sm">{turf.price}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <FiMapPin size={11} className="text-emerald-500" /> {turf.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiStar size={11} className="text-amber-400 fill-amber-400" />
                    <span className="font-black text-slate-900 dark:text-white text-xs">{turf.rating}</span>
                    <span className="text-slate-400 text-[10px]">({turf.reviews})</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════
             UPCOMING TOURNAMENTS
           ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">🏆 Upcoming Tournaments</h2>
            <button
              onClick={() => navigate('/tournaments')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              View All <FiArrowRight size={11} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {UPCOMING_TOURNAMENTS.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 + idx * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate('/tournaments')}
                className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer group"
              >
                <div className="flex h-28 overflow-hidden">
                  <div className="relative w-36 shrink-0">
                    <img src={t.img} alt={t.sport} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white dark:to-slate-900" />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm leading-tight">{t.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <FiCalendar size={10} className="text-emerald-500" /> {t.date}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 text-xs">
                        <span className="text-slate-500">Teams: <span className="font-black text-slate-900 dark:text-white">{t.teams}</span></span>
                        <span className="text-slate-500">Prize: <span className="font-black text-emerald-500">{t.prize}</span></span>
                      </div>
                      <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-black">
                        Entry: {t.entry}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════════════════════
             PROMOTIONAL BANNER
           ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
          onClick={() => navigate('/bookslot')}
        >
          <img src={TOURNAMENT_BG} alt="Promotion" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-slate-900/70 flex items-center px-8">
            <div className="flex-1">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Limited Offer</p>
              <h3 className="text-xl font-black text-white">Book your first turf slot — 20% OFF 🎉</h3>
              <p className="text-slate-400 text-sm mt-1">Use code <span className="text-emerald-400 font-black">FIRST20</span> at checkout</p>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all shrink-0">
              Book Now
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default UserDashboard;
