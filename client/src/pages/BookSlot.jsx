import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiLocationMarker } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { topTurfs } from "../data/topTurfs";
import { GetAllTurfsService } from "../services/turf.services";
import RatingStars from '../components/common/RatingStars';
import slotBannerBg from '../assets/turfgate_hero_bg.png';

const BookSlot = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const navigate = useNavigate();

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser!");
      return;
    }
    setIsFindingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);
        setIsFindingLocation(false);
        toast.success("📍 Location acquired! Showing nearby turfs first.");
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsFindingLocation(false);
        alert("Location access denied or timed out. Please allow location permissions in your browser.");
      },
      { enableHighAccuracy: true, timeout: 8500 }
    );
  };

  const handleClearLocation = () => {
    setLatitude(null);
    setLongitude(null);
  };

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const data = await GetAllTurfsService(searchTerm, undefined, latitude, longitude);
        if (data.success && data.turfs && data.turfs.length > 0) {
          setTurfs(data.turfs);
        } else {
          setTurfs(topTurfs.filter(t => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.location.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        }
      } catch (err) {
        setTurfs(topTurfs.filter(t => 
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.location.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, [searchTerm, latitude, longitude]);

  const handleTurfClick = (turfId) => {
    navigate(`/turfview/${turfId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-20">
      
      {/* Book Slot Hero Header */}
      <section 
        className="relative h-[280px] md:h-[350px] flex flex-col justify-center items-center text-center px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.95)), url(${slotBannerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-4xl space-y-3 z-10">
          <motion.span 
            className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Real-Time Scheduling
          </motion.span>
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Book Your Turf Slot
          </motion.h1>
          <motion.p 
            className="text-slate-300 max-w-xl mx-auto text-xs sm:text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Instantly reserve the best local artificial grass pitches and court netting. No calls, secure checkout, 24/7 floodlight access.
          </motion.p>
        </div>
      </section>

      {/* Floating Search Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl rounded-3xl p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 text-2xl" />
              <input
                type="text"
                placeholder="Search by turf name, location, or neighborhood..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base sm:text-lg transition-all"
              />
            </div>
            <button
              onClick={handleFindNearby}
              disabled={isFindingLocation}
              className={`px-6 py-4 rounded-2xl font-black transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 border shadow-md shrink-0 ${
                latitude && longitude
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <span className="text-base">📍</span>
              {isFindingLocation ? 'Locating...' : (latitude && longitude) ? 'Nearby Active' : 'Find Nearby'}
            </button>
            {(latitude && longitude) && (
              <button
                onClick={handleClearLocation}
                className="px-5 py-4 rounded-2xl font-black bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs sm:text-sm cursor-pointer transition-all shrink-0"
                title="Clear location filter"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Turf Listings */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Turf Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {turfs.map((turf, index) => (
              <motion.div
                key={turf._id || turf.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                whileHover={{ y: -6 }}
                className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-200/40 dark:border-slate-800/80 shadow-lg overflow-hidden flex flex-col h-full hover:border-emerald-500/30 hover:shadow-emerald-500/5 transition-all duration-350 cursor-pointer"
                onClick={() => handleTurfClick(turf._id || turf.id)}
              >
                {/* Turf Image */}
                <div 
                  className="h-52 bg-cover bg-center relative shrink-0"
                  style={{ backgroundImage: `url(${turf.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  
                  {/* Category Indicator Tag */}
                  {turf.Area && (
                    <span className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 uppercase tracking-wider">
                      {turf.Area}
                    </span>
                  )}

                  {/* Geolocation Distance Badge */}
                  {turf.distance !== undefined && turf.distance !== null && (
                    <span className="absolute top-4 right-4 bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow border border-white/10">
                      📍 {turf.distance.toFixed(1)} km away
                    </span>
                  )}
                </div>

                {/* Turf Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-emerald-500 transition-colors">
                      {turf.name}
                    </h3>
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                      <HiLocationMarker className="text-emerald-500 mr-2 shrink-0 text-lg" />
                      <span className="text-sm line-clamp-1">{turf.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                      <RatingStars rating={turf.rating} />
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{turf.price}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold transition-all duration-300 cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center text-sm">
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results Message */}
          {turfs.length === 0 && (
            <motion.div
              className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-md max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <HiSearch className="text-5xl text-slate-300 dark:text-slate-600 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-extrabold text-slate-700 dark:text-slate-300 mb-1">No Turfs Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm px-4">
                We couldn't find any match for "{searchTerm}". Adjust your search or browse our available list.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookSlot;