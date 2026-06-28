// CrickSlotUI.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiCalendar } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { topTurfs } from "../data/topTurfs";
import { tournaments } from "../data/Tournament";
import { reviews } from "../data/Review";
import HeroSection from '../components/herosection';
import adBanner from "../assets/turfgate_ad_banner.png";
import About from "../assets/about.png";
import {faqs} from "../data/FAQuestion";
import RatingStars from '../components/common/RatingStars';
import { Button } from '../components/common/Button';
import { FilterBar } from '../components/landing/FilterBar';
import TopRatedTurfs from '../components/landing/TopRatedTurfs';
import { TournamentSection } from '../components/landing/TournamentSection';

const ArenaBanner = () => {
  return (
    <div className="w-full mb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[280px] md:h-[420px] border border-slate-200/10 dark:border-slate-800/80">
        <img
          src={adBanner}
          alt="TurfGate Facilities"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 space-y-4 max-w-xl text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
            Next-Gen Facilities
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight text-white">
            Where Champions Train and Play
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Discover professionally maintained box cricket nets, 5-a-side and 7-a-side soccer turfs, and premium multisport indoor courts.
          </p>
        </div>
      </div>
    </div>
  );
};

// ========================== About Section ==========================
const AboutSection = () => {
  const benefits = [
    {
      icon: "⚡",
      title: "Instant Reservations",
      desc: "No phone calls, no delays. Find an open slot, select your time, and secure the turf instantly with real-time sync."
    },
    {
      icon: "🏆",
      title: "Active Leagues",
      desc: "Join competitive local tournaments. Register your squad, track live matches, and compete for weekly cash prize pools."
    },
    {
      icon: "🎁",
      title: "Loyalty Multipliers",
      desc: "Earn TurfGate rewards points with every single match. Accumulate points to redeem free slot bookings or team gear."
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content Side */}
          <div className="lg:w-1/2 w-full space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Why TurfGate?</span>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              A premium arena booking platform designed for <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">players</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              We handpick premium multi-sport fields with top-tier artificial turf grass, floodlights, changing rooms, and convenient parking spaces. Spend less time planning, more time playing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500">✓</span> Professional 5-a-side fields
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500">✓</span> Top-grade box cricket nets
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500">✓</span> 24/7 Floodlight matches
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500">✓</span> Secure payments
              </div>
            </div>
          </div>

          {/* Grid Cards Side */}
          <div className="lg:w-1/2 w-full grid grid-cols-1 gap-6">
            {benefits.map((b, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 6 }}
                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md flex gap-5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/25 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-1">{b.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};



// ========================== Review ==========================
const Review = () => {
  return (
    <section className="py-20 bg-slate-100/50 dark:bg-slate-950/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          What our customers say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 shadow-lg transition-colors duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-extrabold mr-4">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{review.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{review.date}</p>
                </div>
              </div>
              <RatingStars rating={review.rating} />
              <p className="text-slate-600 dark:text-slate-300 mt-4 line-clamp-3 leading-relaxed text-sm">{review.comment}</p>
              <button className="text-emerald-600 dark:text-emerald-400 font-bold mt-3 hover:underline text-sm cursor-pointer">
                Read More
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ========================== Near Me ==========================
const NearMe = () => {
  const ashokNagarTurfs = topTurfs.filter(turf => turf.Area === "Ashok nagar").slice(0, 3);

  // Add this function to handle turf clicks
  const handleTurfClick = (turfId) => {
    console.log('Turf clicked:', turfId);
  };

  return (
    <section className="py-20 px-5 w-full max-w-[1500px] mx-auto transition-colors duration-300">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Turfs in Ashok Nagar
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Discover the best turfs in Ashok Nagar area
        </p>
      </div>

      {/* Only Images - Limited to 3 */}
      {ashokNagarTurfs.length > 0 ? (
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {ashokNagarTurfs.map((turf, index) => {
            const isCenter = index === 1; // Middle card
            const isSide = index === 0 || index === 2; // Side cards
            
            let sizeClass = '';
            if (isCenter) {
              sizeClass = 'w-[500px] h-[350px]';
            } else if (isSide) {
              sizeClass = 'w-[300px] h-[220px]';
            } else {
              sizeClass = 'w-[280px] h-[200px]';
            }

            return (
              <button
                key={turf.id}
                className={`
                  rounded-3xl overflow-hidden transition-all duration-300 ease-in-out cursor-pointer
                  border-none outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                  ${sizeClass}
                  ${isCenter ? 'shadow-[0_20px_40px_rgba(0,0,0,0.2)]' : 'shadow-[0_10px_25px_rgba(0,0,0,0.1)]'}
                `}
                style={{
                  backgroundImage: `url(${turf.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = isCenter 
                    ? '0 20px 40px rgba(0,0,0,0.2)' 
                    : '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onClick={() => handleTurfClick(turf.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTurfClick(turf.id);
                  }
                }}
                aria-label={`View ${turf.name} turf in ${turf.location}`}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-500">
          <p>No turfs found in Ashok Nagar area.</p>
        </div>
      )}
    </section>
  );
};

// ========================== FAQ Section ==========================
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Show only first 5 FAQs initially, show all when "See All" is clicked
  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/10 px-5 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about turf bookings, payments, and guidelines.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {displayedFaqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-200 dark:border-slate-800/80 last:border-b-0 pb-4">
              <button
                className="w-full text-left py-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/30 px-4 rounded-xl transition-all duration-200"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex-1">
                    {faq.question}
                  </h3>
                  <span className={`
                    text-2xl font-light text-emerald-500 dark:text-emerald-400 transition-transform duration-300 shrink-0
                    ${openIndex === index ? 'rotate-45' : 'rotate-0'}
                  `}>
                    +
                  </span>
                </div>
                
                {/* Answer inside the button but only when expanded */}
                {openIndex === index && (
                  <div 
                    id={`faq-content-${index}`}
                    className="mt-4 pl-0 bg-transparent rounded-lg"
                  >
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* See All / Show Less Button */}
        {faqs.length > 5 && (
          <div className="text-center mt-10">
            <Button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-md shadow-emerald-500/10"
            >
              {showAll ? 'Show Less' : 'See All Questions'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

// ========================== Contact Section ==========================
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Get in Touch
        </motion.h2>

        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-800/80 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-4">Contact Info</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Have questions about hosting leagues or custom bookings? Shoot us a message or email.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                  <HiLocationMarker className="text-xl" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Address</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">123 Sports Complex, Ashok Nagar, Nashik</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                  <HiCalendar className="text-xl" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Email</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">support@turfgate.com</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-3 pt-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaWhatsapp].map((Icon, idx) => (
                  <motion.a 
                    key={idx}
                    whileHover={{ scale: 1.1, y: -2 }} 
                    className="bg-white dark:bg-slate-800 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors duration-300"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <Button type="submit" variant="primary" className="w-full py-3">Send Message</Button>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
};

// ========================== Main Component ==========================
const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <HeroSection />
      <FilterBar />
      <TopRatedTurfs />
      <ArenaBanner />
      <TournamentSection />
      <AboutSection />
      <NearMe />
      <Review />
      <FAQSection />
      <ContactSection />
    </div>
  );
};

export default Landing;