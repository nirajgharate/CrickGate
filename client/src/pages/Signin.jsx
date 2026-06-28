import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginService, OwnerLoginService } from '../services/auth.services';
import signinBg from '../assets/turfgate_signin_bg.png';
import TurfGateLogo from '../components/TurfGateLogo';

const Signin = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState('player');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const queryRole = searchParams.get('role');
        if (queryRole === 'admin' || queryRole === 'player') {
            setRole(queryRole);
        } else {
            // Fallback to localStorage choice or player
            const savedRole = localStorage.getItem('selected_role');
            if (savedRole) setRole(savedRole);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (role === 'admin') {
                // ── OWNER LOGIN (separate Owner collection) ──
                const res = await OwnerLoginService(formData);
                if (res.owner) {
                    toast.success("Welcome back, " + res.owner.name + "! 🏟️");
                    localStorage.setItem("User",     JSON.stringify(res.owner._id));
                    localStorage.setItem("UserRole", 'admin');
                    localStorage.setItem("OwnerData", JSON.stringify(res.owner));
                    if (res.token) localStorage.setItem("Token", res.token);
                    navigate("/owner/dashboard");
                }
            } else {
                // ── PLAYER LOGIN (User collection) ──
                const res = await LoginService(formData);
                if (res.user) {
                    toast.success("Logged in successfully!");
                    localStorage.setItem("User",     JSON.stringify(res.user._id));
                    localStorage.setItem("UserRole", res.user.role || 'player');
                    if (res.token) localStorage.setItem("Token", res.token);
                    navigate("/home");
                }
            }
        } catch (err) {
            const message = err.response?.data?.message;
            const status  = err.response?.status;

            if (status === 401) {
                toast.error(role === 'admin' ? "Owner account not found!" : "User not found!");
            } else if (status === 400) {
                toast.error("Invalid credentials! Check your password.");
            } else if (status === 409) {
                toast.error("Account already exists.");
            } else {
                toast.error(message || "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(2, 6, 23, 0.85)), url(${signinBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute top-8 left-8 z-10">
                <Link to="/home" className="flex items-center gap-2">
                    <TurfGateLogo size={34} />
                    <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">TurfGate</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-6 rounded-3xl p-8 z-10 bg-white/10 dark:bg-slate-900/35 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    {/* Role Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${role === 'admin' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {role === 'admin' ? 'Turf Owner / Admin' : 'Player / User'}
                    </span>
                    <h2 className="text-3xl font-extrabold text-white">
                        Sign In
                    </h2>
                    <p className="text-slate-300 text-sm">
                        Don't have an account?{' '}
                        <Link
                            to={`/signup?role=${role}`}
                            className={`font-bold transition-colors ${role === 'admin' ? 'text-cyan-400 hover:text-cyan-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                        >
                            Create Account
                        </Link>
                    </p>
                </div>

                {/* Role Selector Tabs */}
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setRole('player');
                            localStorage.setItem('selected_role', 'player');
                        }}
                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            role === 'player'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Player / User
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setRole('admin');
                            localStorage.setItem('selected_role', 'admin');
                        }}
                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            role === 'admin'
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Turf Owner
                    </button>
                </div>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-white">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/15 placeholder-slate-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-semibold text-white">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs text-slate-300 hover:text-emerald-400 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/15 placeholder-slate-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        className={`w-full py-3.5 px-4 font-bold rounded-xl text-white transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 ${
                            role === 'admin' 
                            ? 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/20' 
                            : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'
                        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {loading ? "Signing in..." : "Sign In"}
                    </motion.button>

                    {/* Divider */}
                    <div className="relative my-6 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <span className="relative px-3 bg-transparent text-xs text-slate-400 uppercase font-semibold">
                            or
                        </span>
                    </div>

                    {/* Social Login */}
                    <div className="flex justify-center space-x-4">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white cursor-pointer"
                        >
                          <FaGoogle className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white cursor-pointer"
                        >
                          <FaFacebook className="w-5 h-5" />
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Signin;