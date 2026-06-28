import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import signinBg from '../assets/turfgate_signin_bg.png';
import TurfGateLogo from '../components/TurfGateLogo';

const ForgetPassword = () => {
    const [formData, setFormData] = useState({
        email: ''
    });
    const [loading, setLoading] = useState(false);

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
            // Simulating API request
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success("Reset link sent! Please check your email.");
            console.log('Forgot password request:', formData);
        } catch (error) {
            toast.error("Failed to send reset link. Try again.");
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
                className="max-w-md w-full space-y-6 rounded-3xl p-8 z-10 bg-white/10 dark:bg-slate-900/35 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-white">
                        Reset Password
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Enter your email address and we will send you a secure link to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-white">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-4 py-3 bg-white/5 border border-white/15 placeholder-slate-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            placeholder="Enter your email address"
                        />
                    </div>

                    {/* Reset Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        className={`w-full py-3.5 px-4 font-bold rounded-xl text-white transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {loading ? "Sending..." : "Send Reset Link"}
                    </motion.button>

                    {/* Back to Login */}
                    <div className="text-center">
                        <Link
                            to="/signin"
                            className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            &larr; Back to Sign In
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgetPassword;