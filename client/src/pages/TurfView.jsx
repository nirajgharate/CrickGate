import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiLocationMarker, HiCalendar, HiClock, HiPhone, HiMail } from 'react-icons/hi';
import { FaParking, FaRestroom, FaFirstAid, FaTshirt, FaWater } from 'react-icons/fa';
import { topTurfs } from "../data/topTurfs";
import { GetTurfDetailsService } from "../services/turf.services";
import { CheckSlotAvailabilityService } from "../services/booking.services";
import { GetTurfReviewsService, AddReviewService } from "../services/review.services";

const TurfView = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [turf, setTurf] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [dates, setDates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUpcomingDates = () => {
      const list = [];
      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dayName = weekdays[d.getDay()];
        const dateString = `${d.getDate()} ${months[d.getMonth()]}`;
        list.push({ day: dayName, date: dateString });
      }
      return list;
    };
    const upcoming = getUpcomingDates();
    setDates(upcoming);
    if (upcoming.length > 0) {
      setSelectedDate(upcoming[0].date); // Auto-select today
    }
  }, []);

  const handleTurfBooking = (turfId) => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and time slot first!");
      return;
    }
    navigate(`/turfview/${turfId}/payment`, { state: { selectedDate, selectedTime, turfPrice: turf.price } });
  };

  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        setLoading(true);
        const data = await GetTurfDetailsService(id);
        if (data.success && data.turf) {
          setTurf(data.turf);
        } else {
          const found = topTurfs.find(t => t.id === Number.parseInt(id)) || topTurfs[0];
          setTurf(found);
        }
      } catch (err) {
        const found = topTurfs.find(t => t.id === Number.parseInt(id)) || topTurfs[0];
        setTurf(found);
      } finally {
        setLoading(false);
      }
    };
    fetchTurfDetails();
  }, [id]);

  useEffect(() => {
    if (!turf) return;
    const fetchReviews = async () => {
      try {
        const data = await GetTurfReviewsService(turf._id || id);
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.log("Failed to load reviews");
      }
    };
    fetchReviews();
  }, [turf, id]);

  useEffect(() => {
    if (!selectedDate || !turf) return;
    const fetchAvailability = async () => {
      try {
        const data = await CheckSlotAvailabilityService(turf._id || id, selectedDate);
        if (data.success && data.bookedSlots) {
          setBookedSlots(data.bookedSlots);
        }
      } catch (err) {
        console.log("Error checking slot availability");
      }
    };
    fetchAvailability();
  }, [selectedDate, turf, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("Token");
    if (!token) {
      alert("Please sign in to write a review!");
      return;
    }
    try {
      const turfDbId = turf._id || id;
      const data = await AddReviewService({
        turfId: turfDbId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      if (data.success) {
        alert("Review added successfully!");
        setNewReview({ rating: 5, comment: '' });
        const updated = await GetTurfReviewsService(turfDbId);
        if (updated.success) setReviews(updated.reviews);
        const turfDetails = await GetTurfDetailsService(id);
        if (turfDetails.success) setTurf(turfDetails.turf);
      }
    } catch (err) {
      const tempReview = {
        _id: String(Date.now()),
        rating: newReview.rating,
        comment: newReview.comment,
        userId: { name: "You (Player)" },
        createdAt: new Date().toISOString()
      };
      setReviews(prev => [tempReview, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      alert("Review added successfully! (Local Sandbox)");
    }
  };

  if (loading || !turf) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">Loading Arena Details...</p>
        </div>
      </div>
    );
  }

  const timeSlots = [
    { period: "Morning", time: "6:00 AM" },
    { period: "Morning", time: "8:00 AM" },
    { period: "Afternoon", time: "10:00 AM" },
    { period: "Afternoon", time: "12:00 PM" },
    { period: "Evening", time: "2:00 PM" },
    { period: "Evening", time: "4:00 PM" },
    { period: "Night", time: "6:00 PM" },
    { period: "Night", time: "8:00 PM" }
  ];

  // dates are dynamically generated starting from today in the useEffect above

  const facilities = [
    { name: "Parking Area", icon: FaParking },
    { name: "Restrooms", icon: FaRestroom },
    { name: "First Aid", icon: FaFirstAid },
    { name: "Changing Rooms", icon: FaTshirt },
    { name: "Drinking Water", icon: FaWater }
  ];

  const rules = [
    "Arrive 15 mins prior to your booked time.",
    "Start up at the start of your slot. Vacate the turf promptly when time is up.",
    "Full payment must be completed before the session starts.",
    "TurfGate is not responsible for any personal belongings lost or damaged.",
    "Smoking and alcohol are strictly prohibited inside the premises.",
    "Proper sports attire and turf shoes are mandatory.",
    "Any damage to property will be charged accordingly."
  ];

  const contactInfo = {
    phones: ["+91 9876452109", "+91 9876452110"],
    email: "contact@" + turf.name.toLowerCase().replace(/\s+/g, '') + ".com"
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-20 pt-6">
      
      {/* Visual Header Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Premium Arena
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3 mb-1">
                {turf.name}
              </h1>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-1.5">
                <HiLocationMarker className="text-emerald-500 shrink-0" />
                <span>{turf.location}</span>
              </div>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800 px-4 py-2 rounded-2xl">
              <HiStar className="text-amber-400 text-xl mr-1" />
              <span className="text-base font-black text-slate-800 dark:text-white">{turf.rating}</span>
              <span className="text-slate-400 dark:text-slate-500 text-xs ml-2">({reviews.length} verified reviews)</span>
            </div>
          </div>

          {/* Gallery Block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Picture */}
            <motion.div 
              className="lg:col-span-2 h-[260px] sm:h-[350px] md:h-[400px] rounded-3xl overflow-hidden border border-slate-200/20 dark:border-slate-800/80 shadow-2xl relative"
              whileHover={{ scale: 1.01 }}
            >
              <img
                src={turf.image}
                alt={turf.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
            </motion.div>

            {/* Side visual blocks */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-slate-100 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl h-full min-h-[120px] flex flex-col justify-center items-center text-center p-4">
                <span className="text-2xl mb-1">💡</span>
                <span className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">Lighting</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">Professional Floodlights</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl h-full min-h-[120px] flex flex-col justify-center items-center text-center p-4">
                <span className="text-2xl mb-1">🌿</span>
                <span className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">Grass turf</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">FIFA Certified Turf</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Booking Console */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: Form scheduling */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Rates */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>💰</span> Pricing Options
              </h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Standard Hours (Day):</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">{turf.price}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Peak Hours (6:00 PM - 10:00 PM):</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">₹1,100 / hr</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Weekends & Public Holidays:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">₹1,000 / hr</span>
                </div>
              </div>
            </motion.div>

            {/* Date Picker */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📅</span> Select Scheduling Date
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {dates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date.date)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                      selectedDate === date.date
                        ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold scale-102 shadow-emerald-500/5'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500">{date.day}</span>
                    <span className="text-sm font-black mt-1">{date.date}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Time Picker */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>⏰</span> Select Time Slot
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot, index) => {
                  const isBooked = bookedSlots.includes(slot.time);
                  return (
                    <button
                      key={index}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer text-center shadow-sm ${
                        isBooked
                          ? 'border-red-500/20 bg-red-550/5 dark:bg-red-500/5 text-red-550/40 dark:text-red-400/40 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                          ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold scale-102 shadow-emerald-500/5'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 block mb-0.5">{slot.period}</span>
                      <span className="text-sm font-black">{isBooked ? "Booked" : slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Actions button */}
            <motion.div
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Reserve Slot</p>
                {selectedDate && selectedTime ? (
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    Slot Selected: {selectedDate} at {selectedTime}
                  </p>
                ) : (
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">
                    Please select a date and slot timing
                  </p>
                )}
              </div>

              <button
                onClick={() => handleTurfBooking(turf._id || turf.id)}
                className="w-full sm:w-auto py-3.5 px-8 font-black rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                Book Now &bull; {turf.price}
              </button>
            </motion.div>

            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4"
            >
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Arena Guidelines</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>

          {/* RIGHT 1 COLUMN: Sidebar */}
          <div className="space-y-6">
            
            {/* Location Detail */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-lg space-y-4"
            >
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <HiLocationMarker className="text-emerald-500 text-lg" /> Location Details
              </h3>
              <div className="text-xs sm:text-sm space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <p className="font-bold text-slate-800 dark:text-white">{turf.name}</p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{turf.location}</p>
                {turf.Area && (
                  <span className="inline-block bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1">
                    {turf.Area}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Contact Detail */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-lg space-y-4"
            >
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span>📞</span> Contact Desk
              </h3>
              <div className="text-xs sm:text-sm space-y-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {contactInfo.phones.map((phone, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <HiPhone className="text-emerald-500 shrink-0 text-base" />
                    <span className="text-slate-600 dark:text-slate-300">{phone}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <HiMail className="text-emerald-500 shrink-0 text-base" />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{contactInfo.email}</span>
                </div>
              </div>
            </motion.div>

            {/* Facilities Detail */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-lg space-y-4"
            >
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span>🌿</span> Pitch Facilities
              </h3>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                {facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <fac.icon className="text-emerald-500 shrink-0 text-sm" />
                    <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold">{fac.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Reviews & Ratings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>⭐</span> Ratings & Player Feedback
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Submit Review Form */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Rating</label>
                  <select 
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/50 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
                  >
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="3">3 Stars - Good</option>
                    <option value="2">2 Stars - Fair</option>
                    <option value="1">1 Star - Poor</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Comments / Feedback</label>
                  <textarea
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Tell other players about the turf quality, lighting, and amenities..."
                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/50 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  Submit Feedback
                </button>
              </form>
            </div>

            {/* Reviews List Feed */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recent Reviews ({reviews.length})
              </h3>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {reviews.map((rev) => (
                  <div key={rev._id} className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100/40 dark:border-slate-800/50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                          {rev.userId?.name || "Anonymous Player"}
                        </p>
                        <div className="flex items-center text-amber-400 text-xs mt-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <HiStar key={i} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <span className="text-3xl">📝</span>
                    <p className="text-sm font-bold text-slate-400 mt-2">No Reviews Yet</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Be the first player to review this venue after booking!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default TurfView;