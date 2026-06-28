import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SignupService, OwnerSignupService } from '../services/auth.services';
import signinBg from '../assets/turfgate_signin_bg.png';
import TurfGateLogo from '../components/TurfGateLogo';

const SignUp = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState('player');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const queryRole = searchParams.get('role');
        if (queryRole === 'admin' || queryRole === 'player') {
            setRole(queryRole);
        } else {
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
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        try {
            setLoading(true);

            if (role === 'admin') {
                // ── OWNER SIGNUP (separate Owner collection) ──
                const signupData = {
                    name:            formData.name,
                    email:           formData.email,
                    password:        formData.password,
                    confirmPassword: formData.confirmPassword,
                    businessName:    formData.name + ' Sports',
                };
                const res = await OwnerSignupService(signupData);
                if (res.success || res.owner) {
                    toast.success("Owner account created! Welcome to TurfGate 🏟️");
                    localStorage.setItem("User",      JSON.stringify(res.owner._id));
                    localStorage.setItem("UserRole",  'admin');
                    localStorage.setItem("OwnerData", JSON.stringify(res.owner));
                    if (res.token) localStorage.setItem("Token", res.token);
                    navigate("/owner/dashboard");
                }
            } else {
                // ── PLAYER SIGNUP (User collection) ──
                const signupData = { ...formData, role: 'player' };
                const res = await SignupService(signupData);
                if (res.success || res.user) {
                    toast.success("Account created successfully!");
                    localStorage.setItem("User",     JSON.stringify(res.user._id));
                    localStorage.setItem("UserRole", res.user?.role || 'player');
                    if (res.token) localStorage.setItem("Token", res.token);
                    navigate("/home");
                }
            }
        } catch (error) {
            console.log("Error during registration:", error);
            toast.error(error.response?.data?.message || "Registration failed. Try again.");
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
            {/* Top-left Brand Logo */}
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
                className="max-w-md w-full space-y-6 rounded-3xl p-8 z-10 bg-white/10 dark:bg-slate-900/35 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl my-6"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    {/* Role Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${role === 'admin' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {role === 'admin' ? 'Register Turf Owner' : 'Register Player'}
                    </span>
                    <h2 className="text-3xl font-extrabold text-white">
                        Create Account
                    </h2>
                    <p className="text-slate-300 text-sm">
                        Already have an account?{' '}
                        <Link
                            to={`/signin?role=${role}`}
                            className={`font-bold transition-colors ${role === 'admin' ? 'text-cyan-400 hover:text-cyan-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                        >
                            Sign In
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

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-semibold text-white">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/15 placeholder-slate-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
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
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-semibold text-white">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/15 placeholder-slate-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            placeholder="Create password"
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-1">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/15 placeholder-slate-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            placeholder="Confirm password"
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        className={`w-full py-3.5 px-4 font-bold rounded-xl text-white transition-all duration-300 mt-4 cursor-pointer flex justify-center items-center gap-2 ${
                            role === 'admin' 
                            ? 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/20' 
                            : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'
                        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {loading ? "Registering..." : "Create Account"}
                    </motion.button>

                    {/* Divider */}
                    <div className="relative my-4 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <span className="relative px-3 bg-transparent text-xs text-slate-400 uppercase font-semibold">
                            or
                        </span>
                    </div>

                    {/* Social Registration */}
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

export default SignUp;