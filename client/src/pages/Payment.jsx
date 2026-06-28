import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCalendar, HiClock, HiChevronRight, HiCreditCard, HiCheckCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { topTurfs } from "../data/topTurfs";
import { GetTurfDetailsService } from "../services/turf.services";
import { CreateBookingService } from "../services/booking.services";

const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [turf, setTurf] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });
    const [focusCVV, setFocusCVV] = useState(false);
    
    // States for mock payment setup
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);

    // Compute dynamic pricing
    let parsedPrice = 900;
    if (turf && turf.price) {
        const num = turf.price.replace(/[^0-9]/g, '');
        if (num) parsedPrice = Number(num);
    }
    const platformFee = 50;
    const convenienceTax = 30;
    const totalAmount = parsedPrice + platformFee + convenienceTax;

    useEffect(() => {
        const fetchTurf = async () => {
            try {
                const data = await GetTurfDetailsService(id);
                if (data.success && data.turf) {
                    setTurf(data.turf);
                } else {
                    const found = topTurfs.find(t => String(t.id) === String(id)) || topTurfs[0];
                    setTurf(found);
                }
            } catch (err) {
                const found = topTurfs.find(t => String(t.id) === String(id)) || topTurfs[0];
                setTurf(found);
            }
        };
        fetchTurf();

        if (location.state) {
            setSelectedDate(location.state.selectedDate || '20 Sep');
            setSelectedTime(location.state.selectedTime || '7:00 PM');
        } else {
            setSelectedDate('20 Sep');
            setSelectedTime('7:00 PM');
        }
    }, [id, location.state]);

    const handlePayment = async () => {
        const token = localStorage.getItem("Token");
        if (!token) {
            toast.error("Please sign in to complete booking!");
            navigate("/signin");
            return;
        }

        // Mock validation bypass - always proceed to payment processing simulation
        try {
            setIsProcessing(true);
            setProcessingStep(0);
            
            const steps = [
                "Connecting to secure payment gateway...",
                "Authorizing transaction credentials...",
                "Locking in your selected turf slot...",
                "Confirming booking details with server..."
            ];

            const interval = setInterval(() => {
                setProcessingStep(prev => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    }
                    clearInterval(interval);
                    return prev;
                });
            }, 600);

            // Wait 2.5 seconds total
            await new Promise(resolve => setTimeout(resolve, 2500));
            clearInterval(interval);

            const bookingData = {
                turfId: turf._id || id,
                date: selectedDate,
                timeSlot: selectedTime,
                price: parsedPrice,
                paymentMethod: paymentMethod
            };

            const data = await CreateBookingService(bookingData);
            if (data.success) {
                setIsSuccess(true);
                toast.success("🎉 Booking Confirmed! Payment processed successfully.");
                await new Promise(resolve => setTimeout(resolve, 1800));
                navigate('/userprofile');
            }
        } catch (err) {
            console.error("Booking Error:", err);
            toast.error(err.response?.data?.message || "Failed to create booking in database.");
            setIsProcessing(false);
        }
    };

    const handleCardInputChange = (field, value) => {
        setCardDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        return parts.length ? parts.join(' ') : value;
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return value;
    };

    if (!turf) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">Loading checkout console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT 2 COLUMNS - Checkout console */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Header card */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-lg"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                Secure Checkout
                              </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-4 mb-2">Complete Your Booking</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Review slot details and finalize secure payment credentials.</p>
                        </motion.div>

                        {/* Payment Method selectors */}
                        <motion.section
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6"
                        >
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>💳</span> Select Payment Channel
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Card radio button */}
                                <div 
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                                        paymentMethod === 'card' 
                                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' 
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
                                    }`}
                                >
                                    <HiCreditCard size={20} className={paymentMethod === 'card' ? 'text-emerald-500' : 'text-slate-400'} />
                                    <span className="text-xs sm:text-sm font-semibold">Credit/Debit Card</span>
                                </div>

                                {/* UPI / GPay */}
                                <div 
                                    onClick={() => setPaymentMethod('gpay')}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                                        paymentMethod === 'gpay' 
                                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' 
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
                                    }`}
                                >
                                    <span className="text-sm">⚡</span>
                                    <span className="text-xs sm:text-sm font-semibold">Google Pay / UPI</span>
                                </div>

                                {/* Net Banking */}
                                <div 
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                                        paymentMethod === 'bank' 
                                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' 
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
                                    }`}
                                >
                                    <span className="text-sm">🏦</span>
                                    <span className="text-xs sm:text-sm font-semibold">Net Banking</span>
                                </div>
                            </div>

                            {/* Card credentials input with Visual card mockup */}
                            <AnimatePresence mode="wait">
                                {paymentMethod === 'card' && (
                                    <motion.div
                                        key="card-form"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/80"
                                    >
                                        
                                        {/* Dynamic debit card mockup */}
                                        <div className="w-full flex justify-center py-4">
                                            <motion.div 
                                                className={`w-full max-w-[340px] h-[190px] rounded-2xl p-6 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden transition-all duration-500 bg-gradient-to-br ${
                                                    focusCVV 
                                                        ? 'from-slate-800 via-slate-800 to-slate-900 border border-slate-700' 
                                                        : 'from-emerald-600 via-teal-700 to-cyan-700 border border-emerald-500/20'
                                                }`}
                                                animate={{ rotateY: focusCVV ? 180 : 0 }}
                                                style={{ perspective: 1000 }}
                                            >
                                                {/* Back Side of the Card */}
                                                {focusCVV ? (
                                                    <div className="flex flex-col justify-between h-full w-full rotate-y-180">
                                                        <div className="w-full h-8 bg-slate-950 -mx-6 mt-1" />
                                                        <div className="flex justify-end items-center gap-2 mt-4">
                                                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">CVC</span>
                                                            <div className="bg-white text-slate-900 px-3 py-1 rounded font-mono font-black text-sm tracking-wider">
                                                                {cardDetails.cvc || '***'}
                                                            </div>
                                                        </div>
                                                        <div className="text-[8px] text-slate-400 tracking-wider">
                                                            Authorized Signature. Non transferable.
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Front Side of the Card */
                                                    <div className="flex flex-col justify-between h-full w-full">
                                                        <div className="flex justify-between items-start">
                                                            <div className="text-xs uppercase font-extrabold tracking-widest opacity-80">TurfGate Pay</div>
                                                            <div className="text-xl font-black italic">VISA</div>
                                                        </div>
                                                        <div className="my-auto font-mono text-lg tracking-widest font-black py-2">
                                                            {cardDetails.number || '•••• •••• •••• ••••'}
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <div>
                                                                <p className="text-[9px] uppercase tracking-widest opacity-60">Cardholder</p>
                                                                <p className="font-extrabold tracking-wide uppercase truncate max-w-[170px]">
                                                                    {cardDetails.name || 'Your Name'}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[9px] uppercase tracking-widest opacity-60">Expires</p>
                                                                <p className="font-extrabold tracking-wide">{cardDetails.expiry || 'MM/YY'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Input fields */}
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={cardDetails.name}
                                                    onChange={(e) => handleCardInputChange('name', e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardDetails.number}
                                                    onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
                                                    className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                                                    maxLength={19}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        Expiry Date (MM/YY)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={cardDetails.expiry}
                                                        onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                                                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                                                        maxLength={5}
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                        CVC / CVV
                                                    </label>
                                                    <input
                                                        type="password"
                                                        placeholder="***"
                                                        value={cardDetails.cvc}
                                                        onChange={(e) => handleCardInputChange('cvc', e.target.value.replace(/\D/g, ''))}
                                                        onFocus={() => setFocusCVV(true)}
                                                        onBlur={() => setFocusCVV(false)}
                                                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                                                        maxLength={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Gpay / UPI selected placeholder */}
                            {paymentMethod === 'gpay' && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/30 border border-dashed border-slate-200 dark:border-slate-800/80 space-y-4"
                                >
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center">
                                        You will be redirected to your default UPI application (GPay, PhonePe, Paytm) to approve the request of <span className="font-bold text-slate-900 dark:text-white">₹{totalAmount}</span>.
                                    </p>
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            UPI ID / Virtual Payment Address
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. mobileNumber@upi or name@okaxis"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Net banking selected placeholder */}
                            {paymentMethod === 'bank' && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/30 border border-dashed border-slate-200 dark:border-slate-800/80 space-y-4"
                                >
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center">
                                        Select your bank below to authenticate through secure internet banking portals.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {[
                                            { code: 'sbi', name: 'State Bank of India', icon: '🏛️' },
                                            { code: 'hdfc', name: 'HDFC Bank', icon: '💎' },
                                            { code: 'icici', name: 'ICICI Bank', icon: '🦁' },
                                            { code: 'axis', name: 'Axis Bank', icon: '📈' },
                                            { code: 'kotak', name: 'Kotak Bank', icon: '👑' },
                                        ].map((b) => (
                                            <div
                                                key={b.code}
                                                onClick={() => setSelectedBank(b.code)}
                                                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                                    selectedBank === b.code
                                                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold scale-102 shadow-sm'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'
                                                }`}
                                            >
                                                <span className="text-xl mb-1">{b.icon}</span>
                                                <span className="text-[10px] sm:text-xs font-semibold leading-tight">{b.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.section>

                        {/* Pay Button Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <button
                                onClick={handlePayment}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                Pay Securely &bull; ₹{totalAmount}
                            </button>
                        </motion.div>
                    </div>

                    {/* RIGHT 1 COLUMN - Booking summary sidebar */}
                    <div className="space-y-6">
                        
                        {/* Booking Summary Card */}
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-lg space-y-6"
                        >
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <span>📋</span> Booking Details
                            </h2>

                            <div className="flex gap-4 items-center border-b border-slate-100 dark:border-slate-800/80 pb-4">
                                <img
                                    src={turf.image}
                                    alt={turf.name}
                                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200/40 dark:border-slate-800 shrink-0"
                                />
                                <div className="min-w-0">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">{turf.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{turf.location}</p>
                                    
                                    <div className="flex gap-3 items-center mt-2 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-950/40 px-2.5 py-1 rounded-lg w-fit border border-slate-200/20">
                                        <HiCalendar className="text-emerald-500" />
                                        <span>{selectedDate}</span>
                                        <span className="text-slate-300">&bull;</span>
                                        <HiClock className="text-emerald-500" />
                                        <span>{selectedTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-3 text-xs sm:text-sm">
                                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                    <span>Turf Booking (1 hour)</span>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{turf.price}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                    <span>Platform Service Fee</span>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">₹50</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <span>Convenience Tax</span>
                                    <span className="font-extrabold text-slate-800 dark:text-slate-200">₹30</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 text-slate-900 dark:text-white">
                                    <span className="font-bold text-base">Total Amount</span>
                                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">₹{totalAmount}</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* Rules sidebar */}
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-lg space-y-4"
                        >
                            <h2 className="text-base font-bold text-slate-800 dark:text-white">Guidelines</h2>
                            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold shrink-0">•</span>
                                    <span>Please arrive 15 minutes before the session starts.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold shrink-0">•</span>
                                    <span>Cancellations are permitted up to 24h beforehand.</span>
                                </li>
                            </ul>
                        </motion.section>

                    </div>

                </div>

            </div>

            {/* Processing and Success Overlays */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-white"
                    >
                        {!isSuccess ? (
                            <div className="space-y-6 max-w-md">
                                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-slate-800/80 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-3xl animate-pulse">🔒</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black">Processing Payment</h3>
                                    <p className="text-slate-400 text-sm">Please do not refresh or close this tab.</p>
                                </div>
                                <motion.div 
                                    key={processingStep}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-xl text-emerald-400 font-bold text-xs uppercase tracking-wider w-fit mx-auto"
                                >
                                    {[
                                        "Connecting to secure payment gateway...",
                                        "Authorizing transaction credentials...",
                                        "Locking in your selected turf slot...",
                                        "Confirming booking details with server..."
                                    ][processingStep]}
                                </motion.div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-6 max-w-md"
                            >
                                <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/35 border border-emerald-300/30">
                                    <HiCheckCircle className="text-slate-950 text-5xl" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-emerald-400">Payment Successful!</h3>
                                    <h4 className="text-xl font-bold text-white">🎉 Booking Confirmed</h4>
                                    <p className="text-slate-400 text-sm mt-2">Redirecting you to your bookings dashboard...</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Payment;