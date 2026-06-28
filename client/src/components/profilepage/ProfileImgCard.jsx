import React, { useEffect, useState } from 'react';
import { FetchUser } from '../../services/user.services';
import {
    HiUser,
    HiMail,
    HiPhone,
    HiStar,
    HiTicket,
    HiCamera
} from 'react-icons/hi';

export default function ProfileImgCard() {
    const id = JSON.parse(localStorage.getItem("User"));
    const [user, setUser] = useState();

    const getUser = async (id) => {
        try {
            const res = await FetchUser(id);
            setUser(res?.user);
        } catch (err) {
            console.log(err.response?.data?.message);
        }
    };

    useEffect(() => {
        getUser(id);
    }, [id]);

    return (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-lg overflow-hidden mb-8 transition-colors duration-300">
            <div className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0">
                    
                    {/* Profile Image Section */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/20 dark:border-emerald-500/35 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                            <HiUser className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <button className="absolute bottom-1 right-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white p-2.5 rounded-full shadow-lg transition-colors cursor-pointer border border-white/20">
                            <HiCamera className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 md:ml-8 text-center md:text-left space-y-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                                {user?.name || "TurfGate Athlete"}
                            </h1>

                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start mt-2 gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <HiMail className="text-emerald-500 text-base" />
                                    <span>{user?.email || "athlete@turfgate.com"}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <HiPhone className="text-emerald-500 text-base" />
                                    <span>{user?.phone ? `+91 ${user.phone}` : "Add contact details"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                            
                            <div className="text-center sm:text-left p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 flex items-center gap-4 transition-all duration-300">
                                <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <HiTicket size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                                        {user?.totalBookings || 0}
                                    </div>
                                    <div className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
                                        Total Bookings
                                    </div>
                                </div>
                            </div>

                            <div className="text-center sm:text-left p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 flex items-center gap-4 transition-all duration-300">
                                <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
                                    <HiStar size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                                        {user?.loyaltyPoints || 0}
                                    </div>
                                    <div className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
                                        Loyalty Points
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
