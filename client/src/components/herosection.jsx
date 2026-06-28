import { motion } from 'framer-motion';
import heroBackground from '../assets/turfgate_hero_bg.png';
import { HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';
import { FiCalendar, FiMapPin } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 overflow-hidden transition-colors duration-300">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Left Column - Content */}
      <motion.div
        className="flex-1 space-y-8 text-left z-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <HiOutlineSparkles className="animate-spin text-sm" style={{ animationDuration: '4s' }} />
          The Future of Turf Bookings
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
          Find Your Pitch.<br />
          <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
            Own the Night.
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
          TurfGate connects you to premium local cricket and football pitches with instant automated scheduling, live slot availability, and zero-hassle confirmation.
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <HiOutlineLightningBolt className="text-emerald-500 text-base" /> Instant Slots
          </div>
          <div className="flex items-center gap-1.5">
            <HiOutlineShieldCheck className="text-emerald-500 text-base" /> Secure Checkout
          </div>
          <div className="flex items-center gap-1.5">
            <FiMapPin className="text-emerald-500 text-base" /> Near Ashok Nagar
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-2">
          <motion.a
            href="/bookslot"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center gap-2 cursor-pointer"
          >
            Find a Pitch
          </motion.a>
          <motion.a
            href="/tournaments"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-200 font-extrabold text-base rounded-2xl flex items-center gap-2 cursor-pointer"
          >
            View Leagues
          </motion.a>
        </div>
      </motion.div>

      {/* Right Column - Graphical Interactive Arena Preview */}
      <motion.div
        className="flex-1 w-full relative z-10 flex justify-center items-center"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
      >
        {/* Arena Frame */}
        <div className="relative w-full max-w-lg aspect-[4/3] rounded-[32px] overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-2xl shadow-slate-900/10 dark:shadow-black/40">
          <img 
            src={heroBackground} 
            alt="TurfGate Futuristic Stadium Arena"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          {/* Glassmorphic Widget Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Booking floating widget */}
          <motion.div 
            className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/70 dark:bg-slate-950/70 border border-white/20 dark:border-slate-800/40 backdrop-blur-md shadow-xl flex items-center justify-between"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                ⚽
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">Champions Pitch 1</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Ashok Nagar • Available Now</p>
              </div>
            </div>
            <a 
              href="/bookslot"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
            >
              Book
            </a>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;