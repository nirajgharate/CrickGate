import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCalendar, HiBookmark, HiStar } from 'react-icons/hi';

export default function ProfileQuickAction() {
    const navigate = useNavigate();

    return (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-lg space-y-4 transition-colors duration-300">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Quick Actions
            </h3>
            
            <div className="space-y-3">
                <button 
                    onClick={() => navigate('/bookslot')}
                    className="w-full flex items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-emerald-500/5 border border-slate-200/40 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer text-left"
                >
                    <div className="w-10 h-10 rounded-xl mr-3 flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <HiCalendar size={20} />
                    </div>
                    <span className="font-bold text-slate-805 dark:text-slate-200 text-sm">Book New Turf</span>
                </button>

                <button 
                    className="w-full flex items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-emerald-500/5 border border-slate-200/40 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer text-left"
                >
                    <div className="w-10 h-10 rounded-xl mr-3 flex items-center justify-center bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                        <HiBookmark size={20} />
                    </div>
                    <span className="font-bold text-slate-805 dark:text-slate-200 text-sm">Saved Turfs</span>
                </button>

                <button 
                    className="w-full flex items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-emerald-500/5 border border-slate-200/40 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer text-left"
                >
                    <div className="w-10 h-10 rounded-xl mr-3 flex items-center justify-center bg-amber-500/10 text-amber-500 shrink-0">
                        <HiStar size={20} />
                    </div>
                    <span className="font-bold text-slate-805 dark:text-slate-200 text-sm">Redeem Points</span>
                </button>
            </div>
        </div>
    );
}
