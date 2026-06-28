import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tournaments } from '../../data/Tournament';
import { useNavigate } from 'react-router-dom';
import { GetAllTournamentsService } from '../../services/tournament.services';
import tournamentHero from '../../assets/turfgate_tournament_bg.png';

const Tournaments = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [tournamentsList, setTournamentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const data = await GetAllTournamentsService(filter);
        if (data.success && data.tournaments && data.tournaments.length > 0) {
          setTournamentsList(data.tournaments);
        } else {
          setTournamentsList(tournaments.filter(t => filter === 'all' || t.sport.toLowerCase() === filter));
        }
      } catch (err) {
        setTournamentsList(tournaments.filter(t => filter === 'all' || t.sport.toLowerCase() === filter));
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [filter]);

  const sports = ['all', 'cricket', 'football', 'basketball'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-20">
      
      {/* Hero Banner Section */}
      <section 
        className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.95)), url(${tournamentHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-4xl space-y-4">
          <motion.span 
            className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Championship Arena
          </motion.span>
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Compete in Elite Tournaments
          </motion.h1>
          <motion.p 
            className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Register your team, showcase your skills, and battle for massive prize pools on premium local turfs.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        
        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-3">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setFilter(sport)}
              className={`capitalize text-xs sm:text-sm font-bold py-2.5 px-6 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm ${
                filter === sport 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/25 scale-102' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {sport === 'all' ? 'All Sports' : sport}
            </button>
          ))}
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tournamentsList.map((tournament, index) => (
            <motion.div
              key={tournament._id || tournament.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className="group overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-lg flex flex-col justify-between transition-all duration-300"
            >
              {/* Image Section */}
              <div className="h-56 relative overflow-hidden shrink-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${tournament.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                    {tournament.category}
                  </span>
                  <span className="text-xs font-bold bg-slate-950/80 text-white px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
                    {tournament.sport}
                  </span>
                </div>

                {/* Prize Pool Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs uppercase text-slate-300 font-semibold tracking-wider">Prize Pool</p>
                  <p className="text-2xl font-extrabold text-emerald-400">
                    ₹{((tournament.prizePool?.first || 0) + (tournament.prizePool?.second || 0) + (tournament.prizePool?.third || 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tournament.name}
                  </h3>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 shrink-0">📅</span>
                      <span className="font-semibold truncate">{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 shrink-0">⏰</span>
                      <span className="truncate">{tournament.tournamentTime}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <span className="text-emerald-500 shrink-0">📍</span>
                      <span className="truncate font-semibold">{tournament.location}</span>
                    </div>
                  </div>

                  {/* Rules and Team Info */}
                  <div className="bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200/40 dark:border-slate-800/40 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Team Size:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{tournament.teamComposition}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Deadline:</span>
                      <span className="text-red-500 dark:text-red-400 font-bold">{tournament.registrationDeadline}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => navigate(`/tournamentsregistration/${tournament._id || tournament.id}`)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-50 dark:hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center text-sm"
                  >
                    Register Team
                  </button>
                  <button 
                    onClick={() => navigate(`/tournamentsregistration/${tournament._id || tournament.id}`)}
                    className="flex-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3.5 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center text-sm"
                  >
                    View Prize Split
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {tournamentsList.length === 0 && (
          <motion.div 
            className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-5xl block mb-4">🏆</span>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Tournaments Listed</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              We couldn't find any active tournaments for this sport. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;