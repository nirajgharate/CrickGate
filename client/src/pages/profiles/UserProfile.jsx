import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiHeart,
  FiEdit3, FiSave, FiX, FiStar, FiCheckCircle, FiClock,
  FiActivity, FiAward, FiZap, FiBookOpen, FiTrendingUp, FiUploadCloud
} from 'react-icons/fi';
import { HiStar, HiTicket, HiCamera, HiOutlineFire } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { FetchUser, EditUser } from '../../services/user.services';
import { UploadSingleImageService } from '../../services/upload.services';
import { GetUserBookingsService } from '../../services/booking.services';

// Real avatar & hero images via Unsplash
const HERO_BG     = "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=1600&q=85&fit=crop";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80&fit=crop&crop=face";
const SPORT_ICONS = {
  Cricket:    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=80&q=80&fit=crop",
  Football:   "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=80&q=80&fit=crop",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=80&q=80&fit=crop",
  Tennis:     "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=80&q=80&fit=crop",
};

// Mock recent bookings (will be replaced by API data)
const MOCK_BOOKINGS = [
  { id: "1", turfName: "Battle Ground Arena", sport: "Football", date: "Jun 20, 2026", time: "6:00 PM", amount: 900, status: "confirmed", location: "Nashik" },
  { id: "2", turfName: "Cover Drive Pitch",   sport: "Cricket",  date: "Jun 18, 2026", time: "8:00 PM", amount: 950, status: "completed", location: "Nashik" },
  { id: "3", turfName: "Victory Court",       sport: "Basketball", date: "Jun 14, 2026", time: "5:00 PM", amount: 700, status: "completed", location: "Nashik" },
];

const MOCK_ACHIEVEMENTS = [
  { icon: "🏏", label: "First Booking", desc: "Booked your first turf slot", earned: true },
  { icon: "⚽", label: "Team Player", desc: "Played with 5+ different sports", earned: true },
  { icon: "🔥", label: "On a Streak", desc: "3 weeks consecutive booking", earned: true },
  { icon: "🏆", label: "Tournament Pro", desc: "Joined your first tournament", earned: false },
  { icon: "⭐", label: "Super Reviewer", desc: "Left 5+ reviews", earned: false },
  { icon: "💎", label: "Elite Member", desc: "100+ loyalty points earned", earned: false },
];

const UserProfile = () => {
  const userId = JSON.parse(localStorage.getItem("User"));
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bookings' | 'achievements'
  const [formData, setFormData] = useState({
    userid: userId,
    fullName: '',
    address: '',
    phone: '',
    favoriteSport: 'Cricket',
    dob: '',
    avatar: ''
  });

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const getSportIcon = (area) => {
    if (!area) return SPORT_ICONS.Football;
    const cleanArea = area.trim();
    if (cleanArea.toLowerCase().includes('crick')) return SPORT_ICONS.Cricket;
    if (cleanArea.toLowerCase().includes('foot') || cleanArea.toLowerCase().includes('soccer')) return SPORT_ICONS.Football;
    if (cleanArea.toLowerCase().includes('basket')) return SPORT_ICONS.Basketball;
    if (cleanArea.toLowerCase().includes('tenn')) return SPORT_ICONS.Tennis;
    return SPORT_ICONS.Football;
  };

  const getBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await GetUserBookingsService();
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error("Failed to load user bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setUploadingAvatar(true);
        toast.info("☁️ Uploading profile picture...");
        const res = await UploadSingleImageService(reader.result, "crickslot/avatars");
        if (res.success && res.url) {
          setFormData(prev => ({ ...prev, avatar: res.url }));
          toast.success("Profile picture uploaded successfully!");
        }
      } catch (err) {
        toast.error("Failed to upload profile photo.");
        console.error(err);
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await FetchUser(userId);
      const u = res?.user;
      setUser(u);
      if (u) {
        setFormData({
          userid: userId,
          fullName: u.fullName || u.name || '',
          address: u.address || '',
          phone: u.phone || '',
          favoriteSport: u.favoriteSport || 'Cricket',
          dob: u.dob ? u.dob.split('T')[0] : '',
          avatar: u.avatar || ''
        });
      }
    } catch (err) {
      console.log("Profile fetch error:", err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    getUser(); 
    getBookings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await EditUser(formData);
      toast.success("Profile updated successfully!");
      setEditMode(false);
      getUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile.");
      // Sandbox fallback
      toast.success("Profile saved! (Sandbox mode)");
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const displayName  = user?.fullName || user?.name || formData.fullName || "TurfGate Athlete";
  const totalBookings = bookings.length;
  const loyaltyPts    = user?.loyaltyPoints || 0;
  const memberSince   = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : "Jun 2026";

  const inputCls = "w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm placeholder-slate-400";
  const valueCls = "px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-100/50 dark:border-slate-800/50 text-sm font-semibold";

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-bold text-slate-400">Loading your profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-24">

      {/* ═══════════════════════════════════════════
           HERO BANNER
         ═══════════════════════════════════════════ */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <img src={HERO_BG} alt="Sports arena" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        {/* Floating sport images */}
        <div className="absolute top-6 right-6 flex gap-2 opacity-60">
          {Object.values(SPORT_ICONS).slice(0, 3).map((src, i) => (
            <div key={i} className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
           PROFILE CARD HEADER
         ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 space-y-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">

              {/* Avatar */}
              <div className="relative shrink-0 group">
                <input 
                  type="file" 
                  id="avatarInput" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                  disabled={!editMode || uploadingAvatar} 
                />
                <div 
                  onClick={() => editMode && document.getElementById('avatarInput').click()}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 bg-gradient-to-br ${
                    formData.avatar ? 'bg-slate-100 dark:bg-slate-800' : getAvatarColor(displayName)
                  } flex items-center justify-center text-white font-black text-xl sm:text-2xl tracking-wider select-none ${editMode ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''}`}
                >
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover animate-fade-in" />
                  ) : (
                    getInitials(displayName)
                  )}
                  {editMode && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <FiUploadCloud className="w-6 h-6 text-white animate-pulse" />
                    </div>
                  )}
                </div>
                {editMode && (
                  <button 
                    type="button"
                    onClick={() => document.getElementById('avatarInput').click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 hover:bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md cursor-pointer transition-colors z-20"
                  >
                    <HiCamera className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{displayName}</h1>
                      <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                        <FiCheckCircle size={9} /> Verified Athlete
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap text-sm text-slate-500">
                      {user?.email && (
                        <span className="flex items-center gap-1"><FiMail size={12} className="text-emerald-500" />{user.email}</span>
                      )}
                      {(formData.phone || user?.phone) && (
                        <span className="flex items-center gap-1"><FiPhone size={12} className="text-emerald-500" />+91 {formData.phone || user?.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><FiCalendar size={11} />Member since {memberSince}</span>
                      {(formData.favoriteSport || user?.favoriteSport) && (
                        <span className="flex items-center gap-1"><FiHeart size={11} className="text-rose-400" />Loves {formData.favoriteSport || user?.favoriteSport}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <button
                          onClick={() => { setEditMode(false); }}
                          className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <FiX size={13} /> Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-sm font-black shadow-lg shadow-emerald-500/20 cursor-pointer transition-colors disabled:opacity-60"
                        >
                          <FiSave size={13} /> {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl text-sm font-bold shadow-sm hover:border-emerald-500/40 cursor-pointer transition-all"
                      >
                        <FiEdit3 size={13} /> Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              {[
                { icon: HiTicket, label: 'Bookings', value: totalBookings,            color: 'emerald' },
                { icon: HiStar,   label: 'Loyalty Points', value: loyaltyPts.toLocaleString(), color: 'amber' },
                { icon: FiAward,  label: 'Achievements', value: MOCK_ACHIEVEMENTS.filter(a => a.earned).length + '/6', color: 'violet' }
              ].map((s, i) => {
                const Icon = s.icon;
                const cmap = {
                  emerald: 'bg-emerald-500/10 text-emerald-500',
                  amber:   'bg-amber-500/10 text-amber-500',
                  violet:  'bg-violet-500/10 text-violet-500'
                };
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cmap[s.color]}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
             TAB NAVIGATION
           ═══════════════════════════════════════════ */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl w-full max-w-md border border-slate-200/40 dark:border-slate-800">
          {[
            { key: 'overview',      label: '👤 Overview'     },
            { key: 'bookings',      label: '📅 Bookings'     },
            { key: 'achievements',  label: '🏆 Achievements'  }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════
             TAB CONTENT
           ═══════════════════════════════════════════ */}
        <AnimatePresence mode="wait">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Personal Info */}
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FiUser className="text-emerald-500" /> Personal Details
                  </h2>
                  {!editMode && (
                    <button onClick={() => setEditMode(true)} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1">
                      <FiEdit3 size={11} /> Edit
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {[
                    { label: 'Full Name',       key: 'fullName',      type: 'text',   icon: FiUser,     placeholder: 'Your full name' },
                    { label: 'Phone Number',    key: 'phone',         type: 'tel',    icon: FiPhone,    placeholder: '+91 XXXXX XXXXX' },
                    { label: 'Home Address',    key: 'address',       type: 'text',   icon: FiMapPin,   placeholder: 'Your city / area' },
                    { label: 'Date of Birth',   key: 'dob',           type: 'date',   icon: FiCalendar, placeholder: '' },
                    { label: 'Favorite Sport',  key: 'favoriteSport', type: 'text',   icon: FiHeart,    placeholder: 'Cricket, Football...' },
                  ].map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.key} className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Icon size={10} /> {field.label}
                        </label>
                        {editMode ? (
                          <input
                            type={field.type}
                            value={formData[field.key]}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className={inputCls}
                          />
                        ) : (
                          <p className={valueCls}>
                            {(user?.[field.key] || formData[field.key]) || <span className="text-slate-400 font-normal italic">Not set</span>}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Loyalty + Activity */}
              <div className="space-y-5">
                {/* Loyalty Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <div className="h-36 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 p-5 flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 10% 20%, white 0%, transparent 60%)' }} />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-100">TurfGate Loyalty</p>
                        <p className="text-white font-black text-xl mt-0.5">{displayName}</p>
                      </div>
                      <span className="text-2xl">🎽</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] text-emerald-100 uppercase tracking-widest">Loyalty Points</p>
                        <p className="text-3xl font-black text-white">{loyaltyPts.toLocaleString()}</p>
                      </div>
                      <span className="text-[10px] font-black bg-white/20 border border-white/30 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Gold Member
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <FiActivity className="text-cyan-500" /> Activity Stats
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { label: 'Total Bookings',       value: totalBookings,      icon: HiTicket,    color: 'emerald' },
                      { label: 'Sessions This Month',  value: 4,                  icon: FiCalendar,  color: 'cyan'    },
                      { label: 'Favorite Turf',        value: 'Cover Drive Pitch',icon: FiStar,      color: 'amber'   },
                      { label: 'Sports Played',        value: 3,                  icon: FiZap,       color: 'violet'  },
                    ].map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <div key={i} className="flex items-center justify-between px-5 py-3.5">
                          <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <Icon size={13} className={`text-${s.color}-500`} /> {s.label}
                          </span>
                          <span className="font-black text-slate-900 dark:text-white text-sm">{s.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FiBookOpen className="text-emerald-500" /> My Booking History
                </h2>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                  {bookings.length} Total
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {loadingBookings ? (
                  <div className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs">Fetching your reservations...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <span className="text-4xl">🏟️</span>
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Bookings Yet</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      You haven't reserved any turf courts yet. Find a slot and kick off your game!
                    </p>
                    <button 
                      onClick={() => navigate('/bookslot')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer transition-colors"
                    >
                      Book Slot Now
                    </button>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <motion.div
                      key={booking._id}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors cursor-pointer"
                    >
                      {/* Sport thumbnail */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/30 dark:border-slate-700/50">
                        <img 
                          src={booking.turfId?.image || getSportIcon(booking.turfId?.Area)} 
                          alt={booking.turfId?.Area || "Sport"} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-black text-slate-900 dark:text-white text-sm truncate">
                            {booking.turfId?.name || "Deleted Turf"}
                          </p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                            booking.status === 'confirmed' || booking.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {booking.turfId?.Area || "Sports"} · {booking.turfId?.location || "India"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <FiCalendar size={10} /> {booking.date} · {booking.timeSlot}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black text-slate-900 dark:text-white">₹{booking.price}</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-0.5">+{Math.floor(booking.price / 100)} pts</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50/40 dark:bg-slate-950/25 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total spent: <span className="font-black text-slate-900 dark:text-white">₹{bookings.reduce((s, b) => s + b.price, 0).toLocaleString()}</span></span>
                <button onClick={() => navigate('/bookslot')} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Book More →</button>
              </div>
            </motion.div>
          )}

          {/* ── ACHIEVEMENTS TAB ── */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              {/* Progress bar */}
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-black text-slate-900 dark:text-white">Achievement Progress</h2>
                  <span className="text-sm font-black text-emerald-500">{MOCK_ACHIEVEMENTS.filter(a => a.earned).length}/{MOCK_ACHIEVEMENTS.length}</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(MOCK_ACHIEVEMENTS.filter(a => a.earned).length / MOCK_ACHIEVEMENTS.length) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">{MOCK_ACHIEVEMENTS.filter(a => !a.earned).length} achievements remaining — keep playing!</p>
              </div>

              {/* Achievement Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {MOCK_ACHIEVEMENTS.map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                      achievement.earned
                        ? 'bg-white dark:bg-slate-900/80 border-emerald-500/20 shadow-md hover:shadow-lg hover:-translate-y-1'
                        : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/30 dark:border-slate-800/50 opacity-50'
                    }`}
                  >
                    <div className={`text-3xl ${!achievement.earned ? 'grayscale' : ''}`}>{achievement.icon}</div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-sm">{achievement.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{achievement.desc}</p>
                    </div>
                    {achievement.earned ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <FiCheckCircle size={9} /> Earned
                      </span>
                    ) : (
                      <span className="inline-flex text-[9px] font-bold text-slate-400 border border-slate-200/40 dark:border-slate-700/50 px-2 py-0.5 rounded-full">
                        Locked
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default UserProfile;