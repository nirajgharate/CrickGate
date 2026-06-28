import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLocationMarker } from 'react-icons/hi';
import { topTurfs } from '../../data/topTurfs';
import RatingStars from '../common/RatingStars';
import { Button } from '../common/Button';

const TopRatedTurfs = () => {
  const navigate = useNavigate();
  
  // Filter top-rated turfs (rating >= 4.5) and take only 3
  const topRatedTurfs = topTurfs
    .filter(turf => turf.rating >= 4.5)
    .slice(0, 3);

  const handleBookClick = (turfId, e) => {
    e.stopPropagation(); // Prevent card click if any
    navigate(`/turfview/${turfId}`);
  };

  return (
    <section id="book" className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Handpicked</span>
            <motion.h2
              className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Top Rated Turfs
            </motion.h2>
          </div>
          <Link to="/bookslot">
            <motion.span
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              See All &gt;
            </motion.span>
          </Link>
        </div>

        {/* Turf Cards Grid - Only 3 top-rated turfs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topRatedTurfs.map((turf, index) => (
            <Link key={turf.id} to={`/turfview/${turf.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800/80 cursor-pointer flex flex-col h-full transition-all duration-300"
              >
                {/* Turf Image */}
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${turf.image})` }}></div>

                {/* Turf Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{turf.name}</h3>
                    <div className="flex items-center text-slate-500 dark:text-slate-400 mb-3">
                      <HiLocationMarker className="text-emerald-500 mr-2 shrink-0" />
                      <span className="text-sm line-clamp-1">{turf.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-5 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                      <RatingStars rating={turf.rating} />
                      <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{turf.price}</span>
                    </div>
                    
                    <button 
                      className="w-full bg-emerald-600 dark:bg-emerald-500 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-300 cursor-pointer shadow-md shadow-emerald-500/10"
                      onClick={(e) => handleBookClick(turf.id, e)}
                    >
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Show message if no top-rated turfs found */}
        {topRatedTurfs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No top-rated turfs found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopRatedTurfs;