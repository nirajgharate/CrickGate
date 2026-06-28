import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBriefcase, FiCreditCard, FiMail, FiPhone, FiMapPin, 
  FiEdit3, FiSave, FiAlertCircle, FiCheckCircle, FiCompass, FiMap,
  FiShield, FiTrendingUp, FiAward, FiLink, FiCamera, FiX, FiUser, FiUploadCloud
} from 'react-icons/fi';
import { HiOutlineBadgeCheck, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { GetOwnerProfileService, UpdateOwnerProfileService, GetOwnerBookingsService, GetOwnerTurfsService } from '../../services/owner.services';
import { UploadSingleImageService } from '../../services/upload.services';

// Real imagery
const PROFILE_BG   = "https://images.unsplash.com/photo-1540747913346-19212a4cf528?w=1600&q=85&fit=crop";
const OWNER_AVATAR = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&fit=crop&crop=face";
const HDFC_LOGO    = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/512px-HDFC_Bank_Logo.svg.png";

const OwnerProfile = () => {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('business'); // 'business' | 'bank' | 'payouts'

  const [profile, setProfile] = useState({
    companyName: 'TurfGate Arena Group',
    gstNumber: '27AAACT1234A1Z1',
    contactEmail: 'owner@turfgate.com',
    contactPhone: '9876543210',
    address: 'Sport Complex Road, Pimpalgaon Bahula, Nashik',
    bankName: 'HDFC Bank',
    accountHolderName: 'TurfGate Arena Group',
    accountNumber: '50100293847581',
    ifscCode: 'HDFC0000104',
    upiId: 'turfgate@ybl',
    latitude: 20.00,
    longitude: 73.78
  });

  const [profileBookings, setProfileBookings] = useState([]);
  const [activeTurfsCount, setActiveTurfsCount] = useState(0);

  const generateSettlements = (bookingsList) => {
    const completed = bookingsList.filter(b => b.status === 'completed');
    if (completed.length === 0) return [];
    
    const sorted = [...completed].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return sorted.map((b) => {
      const date = new Date(b.createdAt);
      const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return {
        id: b._id,
        date: dateStr,
        amount: b.price,
        bank: profile.bankName ? `${profile.bankName} (•••• ${profile.accountNumber?.slice(-4) || '7581'})` : 'HDFC Bank (•••• 7581)',
        status: 'processed',
        ref: `TXN${b._id?.slice(-8).toUpperCase()}`
      };
    });
  };

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
        toast.info("☁️ Uploading merchant profile photo...");
        const res = await UploadSingleImageService(reader.result, "crickslot/avatars");
        if (res.success && res.url) {
          setProfile(prev => ({ ...prev, avatar: res.url }));
          toast.success("Profile photo uploaded!");
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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await GetOwnerProfileService();
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          ...(data.profile || {}),
          ownerName: data.owner?.name || '',
          ownerPhone: data.owner?.phone || '',
          avatar: data.owner?.avatar || '',
          isVerified: data.owner?.isVerified || false,
          latitude: data.profile?.latitude || 20.00,
          longitude: data.profile?.longitude || 73.78
        }));
      }

      // Fetch bookings to calculate real stats and settlements
      try {
        const bookingsData = await GetOwnerBookingsService();
        if (bookingsData.success && bookingsData.bookings) {
          setProfileBookings(bookingsData.bookings);
        }
      } catch (err) {
        console.log("Error loading bookings for profile stats:", err);
      }

      // Fetch turfs count
      try {
        const turfsData = await GetOwnerTurfsService();
        if (turfsData.success && turfsData.turfs) {
          setActiveTurfsCount(turfsData.turfs.length);
        }
      } catch (err) {
        console.log("Error loading turfs for profile stats:", err);
      }

    } catch (err) {
      console.log("Using mock business profile context (offline mode)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleCoordinateChange = (name, value) => {
    setProfile(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setProfile(prev => ({
          ...prev,
          latitude: parseFloat(latitude.toFixed(6)),
          longitude: parseFloat(longitude.toFixed(6))
        }));
        toast.info("📍 Coordinates pinned! Running reverse address lookup...");
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          if (res.data && res.data.display_name) {
            setProfile(prev => ({ ...prev, address: res.data.display_name }));
            toast.success("Address resolved successfully!");
          }
        } catch (err) {
          toast.warning("Coordinates updated, but failed to resolve readable address.");
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        toast.error("Failed to detect location. Please check browser permissions.");
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSave = async () => {
    if (!profile.companyName || !profile.contactEmail || !profile.contactPhone) {
      toast.error("Company Name, Email, and Phone are required.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...profile,
        name: profile.ownerName,
        phone: profile.ownerPhone,
        avatar: profile.avatar
      };
      const res = await UpdateOwnerProfileService(payload);
      if (res.success) {
        toast.success(res.message || "Profile updated successfully!");
        setEditMode(false);
        fetchProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile.");
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  // Shared input class
  const inputCls = "w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm placeholder-slate-400 transition-all";
  const valueCls = "w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-100/50 dark:border-slate-800/50 text-sm font-semibold";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Syncing merchant registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-24">

      {/* ═══ CINEMATIC PROFILE HERO ═══ */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={PROFILE_BG} alt="Sports arena aerial" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        {/* Overlay content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-end gap-5 w-full"
          >
            {/* Owner avatar with badge */}
            <div className="relative shrink-0 group">
              <input 
                type="file" 
                id="ownerAvatarInput" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
                className="hidden" 
                disabled={!editMode || uploadingAvatar} 
              />
              <div 
                onClick={() => editMode && document.getElementById('ownerAvatarInput').click()}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 bg-gradient-to-br ${
                  profile.avatar ? 'bg-slate-100 dark:bg-slate-800' : getAvatarColor(profile.ownerName || profile.companyName)
                } flex items-center justify-center text-white font-black text-xl md:text-2xl tracking-wider select-none ${editMode ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''}`}
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Owner" className="w-full h-full object-cover animate-fade-in" />
                ) : (
                  getInitials(profile.ownerName || profile.companyName)
                )}
                {editMode && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <FiUploadCloud className="w-6 h-6 text-white animate-pulse" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 flex items-center justify-center shadow-md">
                <FiCheckCircle size={14} className="text-white" />
              </div>
            </div>

            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    🏟️ Merchant Profile
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black text-white mt-2">{profile.companyName}</h1>
                  <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                    <FiMapPin size={11} className="text-emerald-400" />
                    {profile.address.split(',').slice(0, 2).join(',')}
                  </p>
                </div>
                <button
                  onClick={() => { if (editMode) handleSave(); else setEditMode(true); }}
                  disabled={saving}
                  className={`flex items-center gap-2 font-black py-2.5 px-5 rounded-xl transition-all text-sm cursor-pointer shadow-lg ${
                    editMode
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm'
                  }`}
                >
                  {editMode ? (<><FiSave size={14} />{saving ? "Saving..." : "Save Changes"}</>) : (<><FiEdit3 size={14} />Edit Profile</>)}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6 relative z-10">

        {/* ═══ STAT BANNER ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {(() => {
            const completedBookings = profileBookings.filter(b => b.status === 'completed');
            const totalRevenue = completedBookings.reduce((sum, b) => sum + b.price, 0);
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const thisMonthRevenue = completedBookings
              .filter(b => {
                const d = new Date(b.createdAt);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
              })
              .reduce((sum, b) => sum + b.price, 0);

            return [
              { icon: FiTrendingUp, label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'emerald' },
              { icon: FiAward,      label: 'Active Arenas', value: `${activeTurfsCount} Turf${activeTurfsCount !== 1 ? 's' : ''}`, color: 'cyan' },
              { icon: FiShield,     label: 'KYC Status',    value: profile.isVerified ? 'Verified' : 'Pending',  color: 'violet' },
              { icon: FiCreditCard, label: 'Payouts This Month', value: `₹${thisMonthRevenue.toLocaleString()}`, color: 'amber' }
            ];
          })().map((s, i) => {
            const Icon = s.icon;
            const colorMap = {
              emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
              cyan:    'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
              violet:  'bg-violet-500/10 text-violet-500 border-violet-500/20',
              amber:   'bg-amber-500/10 text-amber-500 border-amber-500/20'
            };
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className={`flex items-center gap-3 p-4 rounded-2xl border bg-white dark:bg-slate-900/80 shadow-md ${colorMap[s.color].split(' ').slice(2).join(' ')} border-slate-200/50 dark:border-slate-800`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorMap[s.color].split(' ').slice(0, 2).join(' ')}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ═══ NOTICE ALERT ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3"
        >
          <FiAlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <span className="font-black">Settlement Notice:</span> Verify your banking account numbers and geo-location markers meticulously. Payout earnings are disbursed every Monday morning to these coordinates.
          </p>
        </motion.div>

        {/* ═══ TAB BAR ═══ */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl w-full max-w-md border border-slate-200/40 dark:border-slate-800">
          {[
            { key: 'business', label: '🏢 Business' },
            { key: 'bank',     label: '🏦 Payments' },
            { key: 'payouts',  label: '💸 Payouts' }
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

        {/* ═══ TAB CONTENT ═══ */}
        <AnimatePresence mode="wait">

          {/* ── BUSINESS TAB ── */}
          {activeTab === 'business' && (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Company Info */}
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <HiOutlineOfficeBuilding className="text-emerald-500 text-lg" />
                  <h2 className="font-black text-slate-900 dark:text-white">Company Details</h2>
                </div>

                <div className="p-6 space-y-4">
                  {[
                    { label: 'Merchant / Owner Name', name: 'ownerName', type: 'text', icon: FiUser },
                    { label: 'Company / Trade Name', name: 'companyName', type: 'text', icon: FiBriefcase },
                    { label: 'GST Identification Number', name: 'gstNumber', type: 'text', icon: FiShield, hint: 'e.g. 27AAACT1234A1Z1' },
                    { label: 'Operational Email', name: 'contactEmail', type: 'email', icon: FiMail },
                    { label: 'Operational Phone', name: 'contactPhone', type: 'tel', icon: FiPhone },
                    { label: 'Owner Contact Phone', name: 'ownerPhone', type: 'tel', icon: FiPhone },
                  ].map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.name} className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Icon size={10} />
                          {field.label}
                        </label>
                        {editMode ? (
                          <input
                            type={field.type}
                            name={field.name}
                            value={profile[field.name]}
                            onChange={handleChange}
                            placeholder={field.hint}
                            className={inputCls}
                          />
                        ) : (
                          <p className={valueCls}>{profile[field.name] || '—'}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Location */}
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiMap className="text-emerald-500 text-lg" />
                    <h2 className="font-black text-slate-900 dark:text-white">Business Location</h2>
                  </div>
                  {editMode && (
                    <button
                      onClick={handleDetectLocation}
                      disabled={detecting}
                      className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      <FiCompass size={11} className={detecting ? 'animate-spin' : ''} />
                      {detecting ? 'Detecting GPS...' : '📍 Use My Location'}
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  {/* Live Map */}
                  <div className="w-full rounded-xl overflow-hidden border border-slate-200/40 dark:border-slate-700/60 shadow-inner">
                    <div className="bg-emerald-500/5 border-b border-emerald-500/10 px-3 py-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Live Map: {profile.latitude.toFixed(4)}°N, {profile.longitude.toFixed(4)}°E
                      </span>
                    </div>
                    <iframe
                      title="Business Location Map"
                      width="100%"
                      height="220"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${profile.longitude - 0.015}%2C${profile.latitude - 0.012}%2C${profile.longitude + 0.015}%2C${profile.latitude + 0.012}&layer=mapnik&marker=${profile.latitude}%2C${profile.longitude}`}
                      className="w-full"
                    />
                  </div>

                  {/* Coordinates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Latitude</label>
                      {editMode ? (
                        <input type="number" step="0.000001" value={profile.latitude}
                          onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                          className={inputCls} />
                      ) : (
                        <p className={valueCls + " font-mono text-xs"}>{profile.latitude.toFixed(6)}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Longitude</label>
                      {editMode ? (
                        <input type="number" step="0.000001" value={profile.longitude}
                          onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                          className={inputCls} />
                      ) : (
                        <p className={valueCls + " font-mono text-xs"}>{profile.longitude.toFixed(6)}</p>
                      )}
                    </div>
                  </div>

                  {/* Physical address */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Physical Address</label>
                    {editMode ? (
                      <textarea name="address" rows={2} value={profile.address} onChange={handleChange}
                        className={inputCls + " resize-none"} />
                    ) : (
                      <p className={valueCls + " leading-relaxed"}>{profile.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BANK TAB ── */}
          {activeTab === 'bank' && (
            <motion.div
              key="bank"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Bank Card */}
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <FiCreditCard className="text-emerald-500 text-lg" />
                  <h2 className="font-black text-slate-900 dark:text-white">Payout Bank Account</h2>
                </div>

                {/* Visual bank card */}
                <div className="p-6">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-xl mb-6 p-5 flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 80% 20%, #10b981 0%, transparent 50%)' }} />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-black">Payout Account</p>
                        <p className="text-white font-black text-sm mt-0.5">{profile.bankName}</p>
                      </div>
                      <img src={HDFC_LOGO} alt="Bank" className="h-7 opacity-80" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs tracking-[0.2em] font-mono">
                        •••• •••• {profile.accountNumber?.slice(-4) || '0000'}
                      </p>
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <p className="text-[8px] text-slate-500 uppercase tracking-wider">Account Holder</p>
                          <p className="text-white font-bold text-xs">{profile.accountHolderName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] text-slate-500 uppercase tracking-wider">IFSC</p>
                          <p className="text-white font-bold text-xs">{profile.ifscCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    {[
                      { label: 'Bank Institution',    name: 'bankName',          type: 'text' },
                      { label: 'Account Holder Name', name: 'accountHolderName', type: 'text' },
                      { label: 'Account Number',      name: 'accountNumber',     type: 'text' },
                      { label: 'IFSC Code',           name: 'ifscCode',          type: 'text' },
                      { label: 'UPI Handle',          name: 'upiId',             type: 'text', hint: 'business@upi' },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{field.label}</label>
                        {editMode ? (
                          <input
                            type={field.type}
                            name={field.name}
                            value={profile[field.name]}
                            onChange={handleChange}
                            placeholder={field.hint}
                            className={inputCls + (field.name === 'ifscCode' ? ' uppercase' : '')}
                          />
                        ) : (
                          <p className={valueCls}>
                            {field.name === 'accountNumber'
                              ? `•••• •••• ${profile.accountNumber?.slice(-4) || '—'}`
                              : (profile[field.name] || '—')
                            }
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KYC & Verification */}
              <div className="space-y-5">
                {/* KYC Verified card */}
                <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <FiShield size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white">KYC Verified</h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Full settlement access granted</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {['Identity Verified', 'Bank Account Linked', 'GST Registration Confirmed', 'Payout Settlement Active'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <FiCheckCircle size={14} className="text-emerald-500 shrink-0" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Payouts', value: '₹95,900', sub: 'Lifetime received', color: 'emerald' },
                    { label: 'UPI Handle', value: profile.upiId || '—', sub: 'Direct deposits', color: 'cyan' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {(() => {
                          const completedBookings = profileBookings.filter(b => b.status === 'completed');
                          const totalRevenue = completedBookings.reduce((sum, b) => sum + b.price, 0);
                          return s.label === 'Total Payouts' ? `₹${totalRevenue.toLocaleString()}` : s.value;
                        })()}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                      <p className="text-[9px] text-slate-400 mt-1">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PAYOUTS TAB ── */}
          {activeTab === 'payouts' && (
            <motion.div
              key="payouts"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-500" /> Payout Settlement History
                </h2>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                  Weekly Ledger
                </span>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800">
                {(() => {
                  const completedBookings = profileBookings.filter(b => b.status === 'completed');
                  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.price, 0);
                  const currentMonth = new Date().getMonth();
                  const currentYear = new Date().getFullYear();
                  const thisMonthRevenue = completedBookings
                    .filter(b => {
                      const d = new Date(b.createdAt);
                      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                    })
                    .reduce((sum, b) => sum + b.price, 0);

                  return [
                    { label: 'Total Received', value: `₹${totalRevenue.toLocaleString()}` },
                    { label: 'This Month',     value: `₹${thisMonthRevenue.toLocaleString()}` },
                    { label: 'Pending',        value: '₹0'      }
                  ];
                })().map((s, i) => (
                  <div key={i} className="px-6 py-4 text-center">
                    <p className="text-lg font-black text-slate-900 dark:text-white">{s.value}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {(() => {
                  const settlementsList = generateSettlements(profileBookings);
                  if (settlementsList.length === 0) {
                    return (
                      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                        <p className="text-sm font-bold">No payouts processed yet</p>
                        <p className="text-xs mt-1 text-slate-400">Payouts are generated from completed turf bookings.</p>
                      </div>
                    );
                  }
                  return settlementsList.slice(0, 5).map((settle) => (
                    <div key={settle.id} className="flex items-center justify-between px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                          <FiCreditCard size={16} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-sm">₹{settle.amount.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{settle.date}</p>
                          <p className="text-[9px] text-slate-400 font-mono">Ref: {settle.ref}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-455">
                          {settle.status}
                        </span>
                        <p className="text-[9px] text-slate-400 mt-1.5">{settle.bank}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {(() => {
                  const settlementsList = generateSettlements(profileBookings);
                  return (
                    <>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {settlementsList.length > 0 ? `Showing last ${Math.min(5, settlementsList.length)} settlements` : 'No settlements'}
                      </span>
                      {settlementsList.length > 0 && (
                        <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                          Download Full Report →
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default OwnerProfile;
