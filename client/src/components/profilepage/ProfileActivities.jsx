import React from 'react';

export default function ProfileActivities() {
    const activities = [
        { type: 'booking', text: 'Booked Battle Ground Turf', time: '2 hours ago', icon: '✓', color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' },
        { type: 'points', text: 'Earned 50 loyalty points', time: 'Yesterday', icon: '⭐', color: 'bg-amber-500/10 text-amber-500 border border-amber-500/20' },
        { type: 'team', text: 'Joined Mumbai Strikers', time: '3 days ago', icon: '👥', color: 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' },
        { type: 'achievement', text: 'Unlocked Power Hitter badge', time: '1 week ago', icon: '🏆', color: 'bg-purple-500/10 text-purple-500 border border-purple-500/20' },
    ];

    return (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-lg space-y-4 transition-colors duration-300">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Activity
            </h3>
            
            <div className="space-y-3.5">
                {activities.map((activity, index) => (
                    <div 
                        key={index} 
                        className="flex items-start p-2 rounded-xl hover:bg-slate-100/30 dark:hover:bg-slate-950/20 transition-all duration-200 cursor-pointer"
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-xs font-black shrink-0 ${activity.color}`}>
                            {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{activity.text}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{activity.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
