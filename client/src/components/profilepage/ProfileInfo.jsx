import { useEffect, useState, React } from 'react';
import { EditUser, FetchUser } from '../../services/user.services';
import { HiUser, HiMail, HiPhone, HiCalendar, HiLocationMarker, HiPencil, HiCheck } from 'react-icons/hi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfileInfo() {
    const id = JSON.parse(localStorage.getItem("User"));

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        userid: id,
        fullName: '',
        address: '',
        phone: '',
        favoriteSport: '',
        dob: null,
    });

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

    const handleEditClick = () => {
        setFormData({
            userid: id,
            fullName: user?.fullName || '',
            address: user?.address || '',
            phone: user?.phone || '',
            favoriteSport: user?.favoriteSport || '',
            dob: user?.dob ? new Date(user.dob) : null,
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await EditUser(formData);
            setIsEditing(false);
            getUser(id); // refresh updated data
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-lg overflow-hidden transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>👤</span> Profile Details
                </h2>

                {isEditing ? (
                    <button
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/10 cursor-pointer border border-white/10"
                        onClick={handleSave}
                    >
                        <HiCheck />
                        Save Changes
                    </button>
                ) : (
                    <button
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-700 dark:border-slate-800 transition-colors cursor-pointer"
                        onClick={handleEditClick}
                    >
                        <HiPencil size={14} />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Info */}
                    <div className="space-y-6">
                        <h3 className="text-base font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
                            Personal Information
                        </h3>

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    {isEditing ? (
                                        <input
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, fullName: e.target.value })
                                            }
                                            className="pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all w-full"
                                        />
                                    ) : (
                                        <div className="pl-12 pr-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 border border-slate-200/20 dark:border-slate-800 text-sm">
                                            {user?.fullName || "—"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    <div className="pl-12 pr-4 py-3 rounded-xl bg-slate-100/55 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 border border-slate-200/10 dark:border-slate-800 text-sm cursor-not-allowed select-none">
                                        {user?.email}
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    {isEditing ? (
                                        <input
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, phone: e.target.value })
                                            }
                                            className="pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all w-full"
                                        />
                                    ) : (
                                        <div className="pl-12 pr-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 border border-slate-200/20 dark:border-slate-800 text-sm">
                                            {user?.phone ? `+91 ${user.phone}` : "—"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DOB */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Date of Birth
                                </label>
                                <div className="relative">
                                    <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10" />
                                    {isEditing ? (
                                        <DatePicker
                                            selected={formData.dob}
                                            onChange={(date) =>
                                                setFormData({ ...formData, dob: date })
                                            }
                                            dateFormat="MMMM d, yyyy"
                                            maxDate={new Date()}
                                            showYearDropdown
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={80}
                                            className="pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all w-full"
                                        />
                                    ) : (
                                        <div className="pl-12 pr-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 border border-slate-200/20 dark:border-slate-800 text-sm">
                                            {user?.dob
                                                ? new Date(user.dob).toLocaleDateString("en-US", {
                                                      year: "numeric",
                                                      month: "long",
                                                      day: "numeric",
                                                  })
                                                : "—"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side (Sports Preferences & Address) */}
                    <div className="space-y-6 md:mt-8">
                        <h3 className="hidden md:block text-base font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider pb-2 border-b border-transparent">
                            &nbsp;
                        </h3>

                        <div className="space-y-4">
                            {/* Favorite Sport */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Favorite Sport
                                </label>
                                {isEditing ? (
                                    <select
                                        value={formData.favoriteSport}
                                        onChange={(e) =>
                                            setFormData({ ...formData, favoriteSport: e.target.value })
                                        }
                                        className="px-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all w-full"
                                    >
                                        <option value="">Select sport</option>
                                        <option value="Cricket">Cricket</option>
                                        <option value="Football">Football</option>
                                        <option value="Badminton">Badminton</option>
                                        <option value="Tennis">Tennis</option>
                                        <option value="Basketball">Basketball</option>
                                    </select>
                                ) : (
                                    <div className="px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 border border-slate-200/20 dark:border-slate-800 text-sm">
                                        {user?.favoriteSport || "—"}
                                    </div>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Home Address
                                </label>
                                <div className="relative">
                                    <HiLocationMarker className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" />
                                    {isEditing ? (
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) =>
                                                setFormData({ ...formData, address: e.target.value })
                                            }
                                            rows={4}
                                            className="pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all w-full resize-none"
                                        />
                                    ) : (
                                        <div className="pl-12 pr-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 border border-slate-200/20 dark:border-slate-800 text-sm min-h-[110px] leading-relaxed">
                                            {user?.address || "—"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
