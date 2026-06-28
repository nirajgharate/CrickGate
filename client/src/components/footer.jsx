import React from "react";
import { FaFacebook, FaPhone, FaTwitter } from "react-icons/fa";
import { RiFeedbackFill, RiInstagramFill, RiMailFill } from "react-icons/ri";
import TurfGateLogo from './TurfGateLogo';


const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo / Brand */}
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TurfGateLogo size={38} />
                <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  TurfGate
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Premium turf booking platform. Fuel your passion, own the pitch.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                <RiInstagramFill size={24} />
              </a>
              <a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          {/* Column 1 - Services */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Our Services
            </h3>
            <a href="/" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm">
              Home
            </a>
            <a href="/bookslot" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm">
              Book Turf
            </a>
            <a href="/tournaments" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm">
              Tournaments
            </a>
          </div>

          {/* Column 2 - Support */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Support
            </h3>
            <a href="/about" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm">
              About Us
            </a>
            <a href="/faq" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm">
              FAQ
            </a>
            <a href="/terms" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm">
              Terms & Conditions
            </a>
          </div>

          {/* Column 3 - Contact */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Contact
            </h3>
            <a
              href="mailto:support@turfgate.com"
              className="flex items-center gap-2 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm"
            >
              <RiMailFill size={20} /> support@turfgate.com
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm"
            >
              <FaPhone size={16} /> +91 9876543210
            </a>
            <a
              href="/feedback"
              className="flex items-center gap-2 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors text-sm"
            >
              <RiFeedbackFill size={18} /> Feedback
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-200 dark:border-slate-800/60 my-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 TurfGate. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

