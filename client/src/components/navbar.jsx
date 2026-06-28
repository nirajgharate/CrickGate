import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { FcBusinessman } from "react-icons/fc";
import { useTheme } from '../context/ThemeContext';
import { GetOwnerProfileService } from '../services/owner.services';
import { FetchUser } from '../services/user.services';
import TurfGateLogo from './TurfGateLogo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const getInitials = (name) => {
    if (!name) return "TG";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return "from-emerald-500 to-teal-600";
    const colors = [
      "from-emerald-500 to-teal-600",
      "from-cyan-500 to-blue-600",
      "from-indigo-500 to-purple-600",
      "from-pink-500 to-rose-600",
      "from-amber-500 to-orange-600"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("User"));
    const role = localStorage.getItem("UserRole");
    setUser(userId);
    const admin = role === "admin";
    setIsAdmin(admin);

    if (userId) {
      const loadProfile = async () => {
        try {
          if (admin) {
            const data = await GetOwnerProfileService();
            if (data.success && data.owner) {
              setProfileData(data.owner);
            }
          } else {
            const data = await FetchUser(userId);
            if (data.success && data.user) {
              setProfileData(data.user);
            }
          }
        } catch (err) {
          console.error("Error loading navbar profile:", err);
        }
      };
      loadProfile();
    }
  }, []);

  const playerNavItems = [
    { name: 'Book your slot', href: '/bookslot' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'About us', href: '/home#about' },
    { name: 'Contact', href: '/home#contact' }
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/owner/dashboard' },
    { name: 'Manage Turfs', href: '/owner/turfs' },
    { name: 'Business Profile', href: '/owner/profile' }
  ];

  const navItems = isAdmin ? adminNavItems : playerNavItems;

  const handleLogout = () => {
    toast.success("Logged out successfully");
    localStorage.removeItem("User");
    localStorage.removeItem("UserRole");
    localStorage.removeItem("Token");
    setUser(null);
    setIsAdmin(false);
    setProfileData(null);
    navigate("/");
  };

  const Button = ({ children = "", variant = "primary", size = "md", className = "", ...props }) => {
    const baseClasses = "font-semibold rounded-xl transition-all duration-300 focus:outline-none flex items-center justify-center cursor-pointer";

    const variants = {
      primary: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-md shadow-emerald-500/20",
      secondary: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40",
      outline: "border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg"
    };

    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="w-full flex justify-center sticky top-4 z-50 px-4 md:px-8 mb-4">
      <nav className="w-full max-w-7xl border border-slate-200/40 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg transition-all duration-300 rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-black/20">
        <div className="px-6 md:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="shrink-0 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to={isAdmin ? "/owner/dashboard" : "/home"} className="flex items-center gap-2">
                <TurfGateLogo size={34} />
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                  TurfGate
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                  whileHover={{ scale: 1.03 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.button>

              {user ? (
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="secondary" onClick={handleLogout}>
                    Logout
                  </Button>
                  <Link
                    to={isAdmin ? "/owner/profile" : "/userprofile"}
                    className="relative shrink-0 cursor-pointer hover:scale-105 transition duration-200"
                  >
                    {profileData?.avatar ? (
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <img src={profileData.avatar} alt="User Profile" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(profileData?.name || '')} flex items-center justify-center text-white font-black text-xs tracking-wider border border-white/10 shadow-sm`}>
                        {getInitials(profileData?.name || '')}
                      </div>
                    )}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => navigate("/signin")}>
                    Sign In
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu and theme buttons */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Theme toggle mobile */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-emerald-500 focus:outline-none"
              >
                {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-b-3xl border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-300"
          >
            <div className="px-6 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-emerald-500 block px-3 py-2 rounded-lg text-base font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              {user ? (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <Link
                    to={isAdmin ? "/owner/profile" : "/userprofile"}
                    className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {profileData?.avatar ? (
                      <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <img src={profileData.avatar} alt="User Profile" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(profileData?.name || '')} flex items-center justify-center text-white font-black text-xs tracking-wider border border-white/10 shadow-sm`}>
                        {getInitials(profileData?.name || '')}
                      </div>
                    )}
                    <span>View Profile</span>
                  </Link>
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate("/signin"); setIsMenuOpen(false); }}>
                    Log In
                  </Button>
                  <Button variant="primary" size="sm" className="w-full" onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;