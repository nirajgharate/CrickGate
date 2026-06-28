import React from 'react';
import { motion } from 'framer-motion';
import { tournaments } from '../../data/Tournament'; 
import { useNavigate } from 'react-router-dom';

export const TournamentSection = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/tournaments');
  };

  const toptournaments = tournaments.slice(0, 3);

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Competitive Leagues</span>
          <motion.h2
            className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Active Tournaments
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toptournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-md flex flex-col h-full transition-all duration-300"
            >
              <div
                className="h-64 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${tournament.image})` }}
              ></div>

              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tournament.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 uppercase tracking-wider font-semibold">{tournament.sport}</p>
                </div>
                <button 
                  className="w-full bg-emerald-600 dark:bg-emerald-500 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-350 cursor-pointer shadow-md shadow-emerald-500/10"
                  onClick={() => navigate(`/tournamentsregistration/${tournament.id}`)}
                >
                  Register Team
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <button 
            className="px-8 py-3.5 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-900/60 text-slate-800 dark:text-slate-200 font-bold rounded-2xl transition-all duration-300 cursor-pointer text-sm"
            onClick={handleExplore}
          >
            EXPLORE ALL TOURNAMENTS
          </button>
        </div>
      </div>
    </section>
  );
};