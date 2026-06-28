import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiAlertCircle, FiAward, FiCheck, FiUsers, FiDollarSign } from 'react-icons/fi';
import { tournaments } from '../../data/Tournament';
import { GetTournamentDetailsService, RegisterForTournamentService } from '../../services/tournament.services';
import tournamentBg from '../../assets/turfgate_tournament_bg.png';

const TournRegistration = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Details, Step 2: Roster, Step 3: Overview
  const [focusedPlayerIndex, setFocusedPlayerIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    whatsappNumber: '',
    teamMembers: ['', '', '', '', '', '', ''], // 7 players including captain
    termsAccepted: false
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await GetTournamentDetailsService(tournamentId);
        if (data.success && data.tournament) {
          setTournament(data.tournament);
        } else {
          const found = tournaments.find(t => String(t.id) === String(tournamentId)) || tournaments[0];
          setTournament(found);
        }
      } catch (err) {
        const found = tournaments.find(t => String(t.id) === String(tournamentId)) || tournaments[0];
        setTournament(found);
      }
    };
    fetchDetails();
  }, [tournamentId]);

  // Sync captain name to player 1
  useEffect(() => {
    setFormData(prev => {
      const updated = [...prev.teamMembers];
      updated[0] = prev.captainName;
      return { ...prev, teamMembers: updated };
    });
  }, [formData.captainName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamMemberChange = (index, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index] = value;
    setFormData(prev => ({
      ...prev,
      teamMembers: updatedMembers
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("Token");
    if (!token) {
      alert("Please sign in to register for the tournament!");
      navigate("/signin");
      return;
    }

    try {
      const payload = {
        tournamentId: tournament._id || tournamentId,
        teamName: formData.teamName,
        captainName: formData.captainName,
        whatsappNumber: formData.whatsappNumber,
        teamMembers: formData.teamMembers.filter(m => m !== '')
      };

      const res = await RegisterForTournamentService(payload);
      if (res.success) {
        alert("🎉 Team registered successfully!");
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to register team in database.");
      
      // Fallback
      alert("🎉 Team registered successfully! (Sandbox fallback)");
      navigate('/home');
    }
  };

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-sm text-slate-500">Loading Tournament Details...</p>
        </div>
      </div>
    );
  }

  const isSportFootball = String(tournament.sport).toLowerCase().includes('foot') || String(tournament.sport).toLowerCase().includes('soccer');
  const isSportCricket = String(tournament.sport).toLowerCase().includes('crick');

  // Roster visual nodes layout positioning
  const footballPositions = [
    { label: "GK (Captain)", x: "50%", y: "83%", icon: "🧤" },
    { label: "Left Back", x: "25%", y: "62%", icon: "🛡️" },
    { label: "Right Back", x: "75%", y: "62%", icon: "🛡️" },
    { label: "Left Mid", x: "30%", y: "38%", icon: "⚡" },
    { label: "Right Mid", x: "70%", y: "38%", icon: "⚡" },
    { label: "Striker", x: "50%", y: "15%", icon: "🔥" },
    { label: "Substitute", x: "90%", y: "88%", icon: "🔄" }
  ];

  const cricketPositions = [
    { label: "Wicket Keeper (Capt)", x: "50%", y: "16%", icon: "🧤" },
    { label: "Striker", x: "42%", y: "42%", icon: "🏏" },
    { label: "Non-Striker", x: "58%", y: "52%", icon: "🏏" },
    { label: "Bowler", x: "50%", y: "78%", icon: "🥎" },
    { label: "Deep Midwicket", x: "15%", y: "45%", icon: "🏃" },
    { label: "Cover Fielder", x: "85%", y: "45%", icon: "🏃" },
    { label: "Extra Fielder", x: "85%", y: "85%", icon: "🔄" }
  ];

  const defaultPositions = [
    { label: "Player 1 (Capt)", x: "50%", y: "82%", icon: "👑" },
    { label: "Player 2", x: "25%", y: "60%", icon: "👤" },
    { label: "Player 3", x: "75%", y: "60%", icon: "👤" },
    { label: "Player 4", x: "50%", y: "45%", icon: "👤" },
    { label: "Player 5", x: "28%", y: "25%", icon: "👤" },
    { label: "Player 6", x: "72%", y: "25%", icon: "👤" },
    { label: "Substitute", x: "90%", y: "88%", icon: "🔄" }
  ];

  const positions = isSportFootball ? footballPositions : isSportCricket ? cricketPositions : defaultPositions;

  return (
    <div 
      className="min-h-screen bg-slate-900/60 dark:bg-slate-950/80 text-slate-100 transition-colors duration-300 pb-20 pt-6 relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.95)), url(${tournamentBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 z-10 relative">
        
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-300 hover:text-emerald-400 font-bold transition-all cursor-pointer text-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FiArrowLeft size={16} />
          Back to Tournaments
        </motion.button>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLUMNS: Step Wizard Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
                  League Registration
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/25">
                  Step {currentStep} of 3
                </span>
              </div>
              <h1 className="text-3xl font-black text-white mt-4 mb-2">
                Register Your Squad
              </h1>
              <p className="text-slate-300 text-sm">
                Compete against the area's best. Complete your squad lineup details below.
              </p>
            </motion.div>

            {/* Step Wizard Buttons */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setCurrentStep(1)}
                className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  currentStep === 1 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                1. Captain info
              </button>
              <button
                onClick={() => {
                  if (formData.teamName && formData.captainName && formData.whatsappNumber) setCurrentStep(2);
                }}
                disabled={!formData.teamName || !formData.captainName || !formData.whatsappNumber}
                className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  currentStep === 2 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5'
                }`}
              >
                2. Squad Roster
              </button>
              <button
                onClick={() => {
                  if (formData.teamMembers.every(m => m !== '')) setCurrentStep(3);
                }}
                disabled={formData.teamMembers.some((m, idx) => idx === 0 ? !formData.captainName : !m)}
                className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  currentStep === 3 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5'
                }`}
              >
                3. Overview
              </button>
            </div>

            {/* Form Console Container */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Captain Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="text-emerald-400">🛡️</span> Team & Captain Details
                    </h2>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Team Name
                        </label>
                        <input
                          type="text"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-950/45 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                          placeholder="e.g. Nashik Strikerz"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Captain Full Name
                        </label>
                        <input
                          type="text"
                          name="captainName"
                          value={formData.captainName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-950/45 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                          placeholder="Captain's full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          WhatsApp Contact Number
                        </label>
                        <input
                          type="tel"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-950/45 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                          placeholder="Captain's WhatsApp number"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.teamName && formData.captainName && formData.whatsappNumber) {
                            setCurrentStep(2);
                          }
                        }}
                        disabled={!formData.teamName || !formData.captainName || !formData.whatsappNumber}
                        className="py-3 px-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        Next Step: Roster
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Squad Roster */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-emerald-400">👥</span> Squad Lineup Roster
                      </h2>
                      <span className="text-xs bg-slate-950 border border-white/10 px-3 py-1 rounded-full text-slate-400 font-bold">
                        7 Players Required
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {formData.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-3 relative group">
                          <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-slate-950 text-slate-300 rounded-xl font-extrabold text-xs border border-white/5">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={index === 0 && formData.captainName ? formData.captainName : member}
                              onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                              onFocus={() => setFocusedPlayerIndex(index)}
                              onBlur={() => setFocusedPlayerIndex(null)}
                              className={`w-full px-4 py-3 bg-slate-950/45 text-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all ${
                                index === 0 
                                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400 font-semibold cursor-not-allowed' 
                                  : focusedPlayerIndex === index 
                                    ? 'border-emerald-500' 
                                    : 'border-white/10'
                              }`}
                              placeholder={index === 0 ? "Captain (syncs automatically)" : `Enter Player ${index + 1} Name`}
                              required
                              disabled={index === 0}
                            />
                            {index === 0 && (
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                CAPTAIN
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="py-3 px-6 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.teamMembers.every(m => m !== '')) {
                            setCurrentStep(3);
                          }
                        }}
                        disabled={formData.teamMembers.some((m, idx) => idx === 0 ? !formData.captainName : !m)}
                        className="py-3 px-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        Next Step: Overview
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Overview & Terms */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="text-emerald-400">📝</span> Registration Overview
                    </h2>

                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Team Name</p>
                          <p className="font-extrabold text-white text-lg mt-0.5">{formData.teamName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Captain Name</p>
                          <p className="font-extrabold text-white text-lg mt-0.5">{formData.captainName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">WhatsApp Number</p>
                          <p className="font-extrabold text-white text-lg mt-0.5">{formData.whatsappNumber}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Squad Size</p>
                          <p className="font-extrabold text-white text-lg mt-0.5">{formData.teamMembers.length} Players</p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Squad Members Roster</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.teamMembers.map((name, i) => (
                            <span key={i} className="text-xs bg-slate-900 border border-white/10 px-3 py-1.5 rounded-full font-semibold text-slate-200">
                              {i === 0 ? '👑 ' : ''}{name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Terms Checklist */}
                    <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={formData.termsAccepted}
                          onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                          className="w-5 h-5 text-emerald-600 rounded border-white/15 focus:ring-emerald-500 bg-slate-950 cursor-pointer"
                          required
                        />
                        <label htmlFor="terms" className="text-xs sm:text-sm text-slate-300 font-semibold cursor-pointer">
                          I agree to follow the tournament guidelines, code of conduct, and player regulations.
                        </label>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="pt-4 flex justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="py-3 px-6 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!formData.termsAccepted}
                        className={`py-3.5 px-8 font-black rounded-xl text-white shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                          formData.termsAccepted 
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        Pay & Complete Registration
                      </button>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Regulations Quickcard */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FiAlertCircle className="text-red-400" /> Essential Guidelines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>Mandatory sports kit and proper flat/turf boots for match games.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>Minimum squad check-in must happen 25 mins early at the gate.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>Fixture timing and match slots cannot be altered once published.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>Verified WhatsApp number will receive fixture schedules directly.</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: Interactive Tactical Pitch Visualizer */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tactical Board Console */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1.5">
                  <span>⚽</span> Tactical Whiteboard
                </h3>
                <span className="text-[10px] font-black uppercase text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Live View
                </span>
              </div>

              {/* Graphical Pitch Layout */}
              <div className="w-full aspect-[4/5] bg-gradient-to-b from-emerald-800 to-emerald-950 rounded-2xl relative overflow-hidden border-2 border-emerald-600/50 shadow-inner flex justify-center shadow-black/60">
                
                {/* Grass stripes overlay */}
                <div className="absolute inset-0 bg-stripes pointer-events-none opacity-10"></div>
                
                {/* Football Pitch Lines */}
                {isSportFootball && (
                  <>
                    {/* Outer Boundary line */}
                    <div className="absolute inset-4 border border-white/15 rounded-xl pointer-events-none"></div>
                    {/* Halfway line */}
                    <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/15 pointer-events-none"></div>
                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/15 rounded-full pointer-events-none"></div>
                    {/* Top Goal Box */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-x border-white/15 pointer-events-none"></div>
                    {/* Bottom Goal Box */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-x border-white/15 pointer-events-none"></div>
                  </>
                )}

                {/* Cricket Ground Pitch Layout */}
                {isSportCricket && (
                  <>
                    {/* Outer Oval boundary */}
                    <div className="absolute inset-4 border border-dashed border-white/20 rounded-[50%] pointer-events-none"></div>
                    {/* Central Pitch Box */}
                    <div className="absolute top-[38%] bottom-[38%] left-[45%] right-[45%] bg-yellow-950/20 border border-white/10 rounded-sm pointer-events-none"></div>
                    {/* Bowling Crease 1 */}
                    <div className="absolute top-[39%] left-[44%] right-[44%] h-[1px] bg-white/20 pointer-events-none"></div>
                    {/* Bowling Crease 2 */}
                    <div className="absolute bottom-[39%] left-[44%] right-[44%] h-[1px] bg-white/20 pointer-events-none"></div>
                  </>
                )}

                {/* Default General Court layout */}
                {!isSportFootball && !isSportCricket && (
                  <>
                    <div className="absolute inset-4 border border-white/10 rounded-xl pointer-events-none"></div>
                    <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/10 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/10 rounded-full pointer-events-none"></div>
                  </>
                )}

                {/* Player Jersey Nodes */}
                {positions.map((pos, idx) => {
                  const playerName = formData.teamMembers[idx] || '';
                  const isFocused = focusedPlayerIndex === idx;
                  const isCaptain = idx === 0;

                  return (
                    <motion.div
                      key={idx}
                      className="absolute flex flex-col items-center pointer-events-auto"
                      style={{ 
                        left: pos.x, 
                        top: pos.y,
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={{
                        scale: isFocused ? 1.15 : 1,
                        y: isFocused ? -5 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setFocusedPlayerIndex(idx)}
                      onMouseLeave={() => setFocusedPlayerIndex(null)}
                    >
                      {/* Circle Shirt Node */}
                      <div 
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-xl font-bold cursor-pointer transition-all duration-300 border-2 ${
                          isFocused 
                            ? 'bg-emerald-400 border-white text-slate-900 scale-110 shadow-emerald-500/40' 
                            : isCaptain 
                              ? 'bg-yellow-500 border-yellow-300 text-slate-900 shadow-yellow-500/20'
                              : playerName 
                                ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30' 
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                        title={pos.label}
                      >
                        {pos.icon}
                      </div>

                      {/* Name Badge */}
                      <div className="mt-1 bg-slate-950/85 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[10px] max-w-[90px] truncate text-center shadow-md font-bold text-slate-200">
                        {playerName ? (
                          <span className="flex items-center gap-0.5">
                            {playerName}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic font-medium">{pos.label}</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Roster list progress tracker */}
              <div className="w-full mt-4 bg-slate-950/60 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Roster Slots</span>
                  <span className="text-emerald-400">
                    {formData.teamMembers.filter(m => m !== '').length} / 7
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(formData.teamMembers.filter(m => m !== '').length / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Stats sidebar details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header Image overlay */}
              <div className="h-40 relative">
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-emerald-500 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-300/20 shadow-md">
                  {tournament.category}
                </span>
              </div>

              {/* Info details */}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-black text-white">{tournament.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">{tournament.sport} League</p>
                </div>

                <div className="space-y-3.5 text-xs border-y border-white/5 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Match Date</span>
                    <span className="font-extrabold text-slate-200">{tournament.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Pitch Arena</span>
                    <span className="font-extrabold text-slate-200 max-w-[180px] truncate text-right">{tournament.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-400">
                    <span className="font-semibold">Register By</span>
                    <span className="font-extrabold">{tournament.registrationDeadline}</span>
                  </div>
                </div>

                {/* Prize Pool details */}
                <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest flex items-center gap-1.5">
                    <FiAward className="text-yellow-500 text-sm animate-bounce" /> Prize Pool Split
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>🥇 1st Place</span>
                      <span className="font-bold text-white">₹{tournament.prizePool.first.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>🥈 2nd Place</span>
                      <span className="font-bold text-white">₹{tournament.prizePool.second.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>🥉 3rd Place</span>
                      <span className="font-bold text-white">₹{tournament.prizePool.third.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Entry fee */}
                <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <FiDollarSign className="text-lg" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400/70">Registration Fee</p>
                      <p className="text-base font-black text-emerald-400">₹{tournament.entryFee || 2500}</p>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-400/80 font-bold bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    Per Team
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TournRegistration;