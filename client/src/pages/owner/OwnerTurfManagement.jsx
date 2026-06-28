import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiMapPin, FiDollarSign, FiActivity, FiCheck, FiX, 
  FiInfo, FiTrash, FiCamera, FiChevronLeft, FiChevronRight, 
  FiCalendar, FiAward, FiUsers, FiClock, FiUploadCloud, FiCompass 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { GetOwnerTurfsService, AddOwnerTurfService, GetOwnerBookingsService } from '../../services/owner.services';
import { GetAllTournamentsService, CreateTournamentService } from '../../services/tournament.services';
import { UploadTurfImagesService, UploadSingleImageService } from '../../services/upload.services';
import footballImg from '../../assets/turfgate_football.png';
import cricketImg from '../../assets/turfgate_cricket.png';
import basketballImg from '../../assets/turfgate_basketball.png';

// Sub-component for Turf Card Carousel
const TurfCard = ({ turf, onClickCard, onClickViewCalendar }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Backward-compatible image parser
  const getPhotos = (imageField) => {
    if (!imageField) return [];
    try {
      if (imageField.trim().startsWith('[') && imageField.trim().endsWith(']')) {
        return JSON.parse(imageField);
      }
    } catch (e) {
      // Fallback
    }
    return [imageField];
  };

  const photos = getPhotos(turf.image);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={onClickCard}
      className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-200/40 dark:border-slate-800/80 shadow-lg overflow-hidden flex flex-col h-full hover:border-emerald-500/30 hover:shadow-emerald-500/5 transition-all duration-350 cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="h-48 bg-slate-950 relative shrink-0 group">
        <img
          src={photos[currentIdx] || footballImg}
          alt={turf.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent pointer-events-none" />

        {/* Carousel controls */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <FiChevronRight size={16} />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-3 right-3 flex gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentIdx === i ? 'bg-emerald-400 w-3' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Category tag */}
        <span className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 uppercase tracking-wider">
          {turf.Area || "Arena"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {turf.name}
          </h3>
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
            <FiMapPin className="text-emerald-500 mr-1.5 shrink-0" />
            <span className="truncate">{turf.location}</span>
          </div>
        </div>

        {/* Facilities details */}
        <div className="flex flex-wrap gap-1.5 py-1">
          {turf.facilities && turf.facilities.length > 0 ? (
            turf.facilities.slice(0, 4).map((fac, i) => (
              <span key={i} className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-200/10">
                {fac}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-400 italic">No specific facilities declared</span>
          )}
          {turf.facilities && turf.facilities.length > 4 && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-455 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/10">
              +{turf.facilities.length - 4} more
            </span>
          )}
        </div>
        
        {/* Pricing and Action */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Rental Tariff</span>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-tight">
              {turf.price}
            </p>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClickViewCalendar();
            }}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer z-10"
          >
            View Calendar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const OwnerTurfManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('arenas'); // 'arenas' | 'tournaments' | 'bookings'
  const [turfs, setTurfs] = useState([]);
  const [tournamentsList, setTournamentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(new Date());
  const [selectedTurfId, setSelectedTurfId] = useState(null);
  const allTimeSlots = ['6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, date: null });
    }
    for (let day = 1; day <= numberOfDays; day++) {
      const cellDate = new Date(year, month, day);
      cells.push({ day, date: cellDate });
    }
    return cells;
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const getFormattedDateStr = (date) => {
    if (!date) return '';
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const [isTurfModalOpen, setIsTurfModalOpen] = useState(false);
  const [isTournModalOpen, setIsTournModalOpen] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Turf Form State
  const [turfFormData, setTurfFormData] = useState({
    name: '',
    location: '',
    priceAmount: '900',
    priceUnit: 'per hr',
    Area: '',
    sportCategory: 'football',
    facilities: [],
    photos: [],        // preview base64s for display
    photoFiles: [],    // actual File objects for upload
    latitude: null,
    longitude: null
  });

  // Tournament Form Wizard State
  const [tournStep, setTournStep] = useState(1);
  const [tournFormData, setTournFormData] = useState({
    name: '',
    sport: 'Football',
    date: '',
    locationId: '', // links to owned turf
    category: 'Open',
    entryFee: '2500',
    prizeFirst: '20000',
    prizeSecond: '10000',
    prizeThird: '5000',
    teamComposition: '7 players',
    tournamentTime: 'Day-Night',
    registrationDeadline: '',
    maxTeams: '16',
    logo: ''
  });

  const availableFacilities = [
    'Floodlights', 'Parking', 'Restrooms', 'Drinking Water', 
    'Locker Rooms', 'First Aid', 'Cafeteria', 'Shower'
  ];

  const sportImageMap = {
    football: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=80&fit=crop',
    cricket: 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=1000&q=80&fit=crop',
    basketball: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?w=1000&q=80&fit=crop',
    tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1000&q=80&fit=crop',
    badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1000&q=80&fit=crop'
  };

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      
      // Fetch turfs
      const turfData = await GetOwnerTurfsService();
      let activeTurfs = [];
      if (turfData.success && turfData.turfs) {
        activeTurfs = turfData.turfs;
        setTurfs(turfData.turfs);
      } else {
        // Mock fallback
        activeTurfs = getMockTurfs();
        setTurfs(activeTurfs);
      }

      // Fetch tournaments
      const tournData = await GetAllTournamentsService();
      if (tournData.success && tournData.tournaments) {
        const ownerId = JSON.parse(localStorage.getItem("User"));
        const filtered = tournData.tournaments.filter(t => String(t.ownerId) === String(ownerId));
        setTournamentsList(filtered);
      } else {
        setTournamentsList(getMockTournaments());
      }
      
      // Fetch bookings
      try {
        const bookingsData = await GetOwnerBookingsService();
        if (bookingsData.success && bookingsData.bookings) {
          setBookings(bookingsData.bookings);
        }
      } catch (bookErr) {
        console.log("Could not load bookings:", bookErr);
      }

      // Pre-select location for tournament if owner has a turf
      if (activeTurfs.length > 0) {
        setTournFormData(prev => ({ ...prev, locationId: activeTurfs[0]._id }));
      }

    } catch (err) {
      console.log("Offline mode: Loading baseline turf and tournament listings.");
      const mockT = getMockTurfs();
      setTurfs(mockT);
      setTournamentsList(getMockTournaments());
      if (mockT.length > 0) {
        setTournFormData(prev => ({ ...prev, locationId: mockT[0]._id }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const getMockTurfs = () => [
    {
      _id: "1",
      name: "Battle Ground Arena",
      location: "Pimpalgaon Bahula, Nashik",
      price: "₹900 per hr",
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=80&fit=crop',
      Area: "Ashok nagar",
      facilities: ["Parking", "Restrooms", "Floodlights", "Drinking Water"]
    },
    {
      _id: "2",
      name: "Cover Drive Pitch",
      location: "Pimpalgaon Bahula, Nashik",
      price: "₹950 per hr",
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?w=1000&q=80&fit=crop',
      Area: "Ashok nagar",
      facilities: ["Parking", "Restrooms", "Locker Rooms", "Drinking Water"]
    }
  ];

  const getMockTournaments = () => [
    {
      _id: "t1",
      name: "Nashik Premier League 2026",
      sport: "Cricket",
      date: "12 July 2026",
      location: "Cover Drive Pitch, Nashik",
      category: "Open Category",
      entryFee: 3000,
      prizePool: { first: 25000, second: 12000, third: 5000 },
      teamComposition: "11 players",
      tournamentTime: "Day-Night",
      registrationDeadline: "05 July 2026",
      maxTeams: 16,
      registeredTeamsCount: 12,
      image: cricketImg
    }
  ];

  // Auto-detect current location using Geolocation API
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setTurfFormData(prev => ({ ...prev, latitude, longitude }));
        toast.info('📍 Location pinned! Fetching address...');
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`
          );
          if (res.data?.display_name) {
            setTurfFormData(prev => ({ ...prev, location: res.data.display_name }));
            toast.success('Address auto-filled!');
          }
        } catch {
          toast.warning('Could not resolve address. Coordinates saved.');
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        toast.error('Location access denied. Please enable browser permissions.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // File to Base64 Reader — stores both preview (base64) + file objects
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(base64s => {
      setTurfFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...base64s],
        photoFiles: [...prev.photoFiles, ...files]
      }));
    });
  };

  const removeTurfPhoto = (index) => {
    setTurfFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photoFiles: prev.photoFiles.filter((_, i) => i !== index)
    }));
  };

  const handleFacilityToggle = (facility) => {
    const isChecked = turfFormData.facilities.includes(facility);
    const newFacilities = isChecked
      ? turfFormData.facilities.filter(f => f !== facility)
      : [...turfFormData.facilities, facility];
    
    setTurfFormData({
      ...turfFormData,
      facilities: newFacilities
    });
  };

  // Submit Turf — uploads photos to Cloudinary then saves turf
  const handleTurfSubmit = async (e) => {
    e.preventDefault();
    if (!turfFormData.name || !turfFormData.location || !turfFormData.priceAmount) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      let finalImage;

      // Upload photos to Cloudinary if owner uploaded any
      if (turfFormData.photos.length > 0) {
        setUploadingPhotos(true);
        toast.info("☁️ Uploading photos to cloud storage...");
        try {
          const uploadRes = await UploadTurfImagesService(turfFormData.photos);
          if (uploadRes.success && uploadRes.urls.length > 0) {
            // Store array as JSON string for backward compatibility
            finalImage = JSON.stringify(uploadRes.urls);
            toast.success(`✅ ${uploadRes.urls.length} photo(s) uploaded successfully!`);
          } else {
            // Fallback to sport image if upload fails silently
            finalImage = sportImageMap[turfFormData.sportCategory] || footballImg;
          }
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
          toast.warning("Photo upload failed — using sport preset image. You can add real photos later.");
          finalImage = sportImageMap[turfFormData.sportCategory] || footballImg;
        } finally {
          setUploadingPhotos(false);
        }
      } else {
        // No photos uploaded — use sport category default
        finalImage = sportImageMap[turfFormData.sportCategory] || footballImg;
      }

      const formattedPrice = `₹${turfFormData.priceAmount} ${turfFormData.priceUnit}`;

      const payload = {
        name: turfFormData.name,
        location: turfFormData.location,
        price: formattedPrice,
        Area: turfFormData.Area || "General",
        facilities: turfFormData.facilities,
        image: finalImage,
        latitude: turfFormData.latitude || 20.00,
        longitude: turfFormData.longitude || 73.78
      };

      const res = await AddOwnerTurfService(payload);
      if (res.success) {
        toast.success(res.message || "Turf listed successfully!");
        setIsTurfModalOpen(false);
        // Reset Form
        setTurfFormData({
          name: '', location: '', priceAmount: '900', priceUnit: 'per hr',
          Area: '', sportCategory: 'football', facilities: [],
          photos: [], photoFiles: [], latitude: null, longitude: null
        });
        fetchOwnerData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list turf field");
      
      // Sandbox fallback — show locally without database
      const tempId = String(Date.now());
      const finalImage = turfFormData.photos.length > 0
        ? turfFormData.photos[0]  // show first preview
        : sportImageMap[turfFormData.sportCategory] || footballImg;
      const formattedPrice = `₹${turfFormData.priceAmount} ${turfFormData.priceUnit}`;

      const newLocalTurf = {
        _id: tempId,
        name: turfFormData.name,
        location: turfFormData.location,
        price: formattedPrice,
        rating: 5.0,
        image: finalImage,
        Area: turfFormData.Area || "General",
        facilities: turfFormData.facilities,
        latitude: turfFormData.latitude || 20.00,
        longitude: turfFormData.longitude || 73.78
      };
      
      setTurfs(prev => [newLocalTurf, ...prev]);
      toast.success("Turf listed successfully! (Sandbox fallback)");
      setIsTurfModalOpen(false);
      setTurfFormData({
        name: '', location: '', priceAmount: '900', priceUnit: 'per hr',
        Area: '', sportCategory: 'football', facilities: [],
        photos: [], photoFiles: [], latitude: null, longitude: null
      });
    }
  };

  // Tournament File upload
  const handleTournamentLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setTournFormData(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Tournament
  const handleTournSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the selected turf to extract location name
      const selectedTurf = turfs.find(t => String(t._id) === String(tournFormData.locationId));
      const venueLocation = selectedTurf ? `${selectedTurf.name}, ${selectedTurf.location}` : "TurfGate Arena NAS";

      let finalLogo = tournFormData.logo;
      if (finalLogo && finalLogo.startsWith('data:image')) {
        toast.info("☁️ Uploading tournament banner to cloud storage...");
        try {
          const uploadRes = await UploadSingleImageService(finalLogo, "crickslot/tournaments");
          if (uploadRes.success && uploadRes.url) {
            finalLogo = uploadRes.url;
            toast.success("✅ Tournament banner uploaded successfully!");
          }
        } catch (uploadErr) {
          console.error("Cloudinary tournament banner upload error:", uploadErr);
          toast.warning("Banner upload failed — using preset placeholder.");
          finalLogo = ""; // fall back
        }
      }

      const payload = {
        name: tournFormData.name,
        sport: tournFormData.sport,
        date: tournFormData.date,
        location: venueLocation,
        category: tournFormData.category,
        entryFee: Number(tournFormData.entryFee),
        prizePool: {
          first: Number(tournFormData.prizeFirst),
          second: Number(tournFormData.prizeSecond),
          third: Number(tournFormData.prizeThird)
        },
        teamComposition: tournFormData.teamComposition,
        tournamentTime: tournFormData.tournamentTime,
        registrationDeadline: tournFormData.registrationDeadline,
        maxTeams: Number(tournFormData.maxTeams),
        image: finalLogo || (String(tournFormData.sport).toLowerCase().includes('crick') ? cricketImg : footballImg)
      };

      const res = await CreateTournamentService(payload);
      if (res.success) {
        toast.success(res.message || "League listed successfully!");
        setIsTournModalOpen(false);
        setTournStep(1);
        setTournFormData({
          name: '', sport: 'Football', date: '', locationId: turfs[0]?._id || '',
          category: 'Open', entryFee: '2500', prizeFirst: '20000',
          prizeSecond: '10000', prizeThird: '5000', teamComposition: '7 players',
          tournamentTime: 'Day-Night', registrationDeadline: '', maxTeams: '16', logo: ''
        });
        fetchOwnerData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list tournament");

      // Sandbox Fallback
      const tempId = String(Date.now());
      const selectedTurf = turfs.find(t => String(t._id) === String(tournFormData.locationId));
      const venueLocation = selectedTurf ? `${selectedTurf.name}, ${selectedTurf.location}` : "TurfGate Arena NAS";
      
      const newLocalTourn = {
        _id: tempId,
        name: tournFormData.name,
        sport: tournFormData.sport,
        date: tournFormData.date,
        location: venueLocation,
        category: tournFormData.category,
        entryFee: Number(tournFormData.entryFee),
        prizePool: {
          first: Number(tournFormData.prizeFirst),
          second: Number(tournFormData.prizeSecond),
          third: Number(tournFormData.prizeThird)
        },
        teamComposition: tournFormData.teamComposition,
        tournamentTime: tournFormData.tournamentTime,
        registrationDeadline: tournFormData.registrationDeadline,
        maxTeams: Number(tournFormData.maxTeams),
        registeredTeamsCount: 0,
        image: tournFormData.logo || (String(tournFormData.sport).toLowerCase().includes('crick') ? cricketImg : footballImg)
      };

      setTournamentsList(prev => [newLocalTourn, ...prev]);
      toast.success("Tournament listed successfully! (Sandbox fallback)");
      setIsTournModalOpen(false);
      setTournStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Console & Tab Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Merchant Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
              Venue & Leagues Manager
            </h1>
          </div>

          <div className="flex gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-md">
            <button
              onClick={() => setActiveTab('arenas')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'arenas'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/15'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Turf Arenas ({turfs.length})
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'tournaments'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/15'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Leagues & Tournaments ({tournamentsList.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/15'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Bookings Calendar ({bookings.length})
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 flex gap-4 items-start shadow-md">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <FiInfo size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              {activeTab === 'arenas' ? "Active Arena Listings" : activeTab === 'tournaments' ? "Tournament Hub" : "Bookings Calendar Grid"}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeTab === 'arenas' 
                ? "Upload real photos of your grounds to attract players. Drag multiple photos into the file uploader to render interactive carousels."
                : activeTab === 'tournaments'
                ? "Host competitive tournaments on your listed courts. Collect team entry fees, declare prize pools, and manage team roster limits directly."
                : "Select dates on the interactive calendar to track all active player slots, rental tariffs, and completed bank settlement payouts dynamically."
              }
            </p>
          </div>
        </div>

        {/* Tab Controls Action */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {activeTab === 'arenas' ? "My Listed Fields" : activeTab === 'tournaments' ? "Organized Tournaments" : "Bookings Calendar"}
          </h2>

          {activeTab !== 'bookings' ? (
            <button
              onClick={() => activeTab === 'arenas' ? setIsTurfModalOpen(true) : setIsTournModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-md shadow-emerald-500/15 cursor-pointer text-sm"
            >
              <FiPlus size={16} />
              {activeTab === 'arenas' ? "Register Turf" : "Organize League"}
            </button>
          ) : (
            <button
              onClick={fetchOwnerData}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-slate-800 dark:text-white border border-slate-200/50 dark:border-slate-800/80 font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-sm cursor-pointer text-sm"
            >
              <FiActivity size={16} className="text-emerald-500 animate-pulse" />
              Refresh Bookings
            </button>
          )}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Syncing database assets...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* TAB 1: Turf Arenas Grid */}
            {activeTab === 'arenas' && (
              <motion.div
                key="arenas-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {turfs.map((turf) => (
                  <TurfCard 
                    key={turf._id} 
                    turf={turf} 
                    onClickCard={() => navigate(`/turfview/${turf._id}`)}
                    onClickViewCalendar={() => {
                      setSelectedTurfId(turf._id);
                      setActiveTab('bookings');
                    }}
                  />
                ))}

                {turfs.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto shadow-md">
                    <FiActivity size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800 dark:text-white">No Arenas Listed</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 px-6">
                      Register your playing pitches, upload high-quality real-world images, and start collecting bookings.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: Tournaments Grid */}
            {activeTab === 'tournaments' && (
              <motion.div
                key="tourn-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {tournamentsList.map((tourn) => {
                  const regPercent = Math.round((tourn.registeredTeamsCount / tourn.maxTeams) * 100) || 0;
                  return (
                    <motion.div
                      key={tourn._id}
                      whileHover={{ y: -6 }}
                      onClick={() => navigate(`/tournamentsregistration/${tourn._id}`)}
                      className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-200/40 dark:border-slate-800/80 shadow-lg overflow-hidden flex flex-col h-full hover:border-emerald-500/30 transition-all duration-350 cursor-pointer"
                    >
                      {/* Cover Photo */}
                      <div className="h-40 relative shrink-0 bg-slate-950">
                        <img
                          src={tourn.image || footballImg}
                          alt={tourn.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                        <span className="absolute bottom-4 left-4 bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {tourn.category}
                        </span>
                      </div>

                      {/* Info Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                            {tourn.name}
                          </h3>
                          <p className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
                            🏆 {tourn.sport} Tournament
                          </p>
                        </div>

                        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex justify-between">
                            <span>📅 Date:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{tourn.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>📍 Arena:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">{tourn.location}</span>
                          </div>
                          <div className="flex justify-between text-red-500">
                            <span>⏱️ Register By:</span>
                            <span className="font-bold">{tourn.registrationDeadline}</span>
                          </div>
                        </div>

                        {/* Progress Roster */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-500">
                            <span>Roster Registration</span>
                            <span>{tourn.registeredTeamsCount} / {tourn.maxTeams} Teams</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${regPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Pricing details */}
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200/20 dark:border-slate-800/40 flex items-center justify-between text-xs pt-3 mt-2 shrink-0">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Prize Pool</span>
                            <p className="font-black text-slate-900 dark:text-white">₹{tourn.prizePool?.first?.toLocaleString() || "N/A"}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Entry Fee</span>
                            <p className="font-black text-emerald-600 dark:text-emerald-400">₹{tourn.entryFee}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {tournamentsList.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto shadow-md">
                    <FiAward size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800 dark:text-white">No Tournaments Listed</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 px-6">
                      Organize local bracket leagues, configure cash prize payouts, and recruit team squads directly to your turf grounds.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: Bookings Calendar View */}
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Bookings Summary KPIs */}
                {(() => {
                  const filteredTotal = bookings.filter(b => !selectedTurfId || b.turfId?._id?.toString() === selectedTurfId.toString());
                  const filteredEarnings = filteredTotal.reduce((sum, b) => b.status === 'completed' ? sum + b.price : sum, 0);

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-md flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 uppercase font-black tracking-wider">Total Bookings</span>
                          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            {filteredTotal.length}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {selectedTurfId ? "For the selected turf" : "Across all registered fields"}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/25">
                          <FiCalendar size={20} />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-md flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 uppercase font-black tracking-wider">Total Earnings</span>
                          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            ₹{filteredEarnings.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {selectedTurfId ? "For the selected turf" : "Settled via linked bank accounts"}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/25">
                          <FiDollarSign size={20} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
                {selectedTurfId && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                      <p className="text-sm font-bold text-slate-800 dark:text-cyan-400">
                        Calendar filtered for turf: <span className="underline font-black">{turfs.find(t => String(t._id) === String(selectedTurfId))?.name || "Selected Turf"}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedTurfId(null)}
                      className="text-xs font-black uppercase text-red-500 bg-red-500/10 hover:bg-red-550/20 px-3.5 py-1.5 rounded-xl border border-red-555/20 cursor-pointer transition-all"
                    >
                      Clear Filter
                    </button>
                  </motion.div>
                )}

                {/* Calendar Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Calendar Widget Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-md h-fit">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                      <h3 className="font-black text-slate-900 dark:text-white text-base">
                        {calendarDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevMonth}
                          className="p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <FiChevronLeft size={16} />
                        </button>
                        <button
                          onClick={handleNextMonth}
                          className="p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <FiChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Weekdays row */}
                    <div className="grid grid-cols-7 text-center text-xs font-black text-slate-400 dark:text-slate-500 mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {getDaysInMonth(calendarDate).map((cell, idx) => {
                        if (!cell.day) {
                          return <div key={`empty-${idx}`} />;
                        }

                        const dateStr = getFormattedDateStr(cell.date);
                        const isSelected = getFormattedDateStr(selectedCalendarDay) === dateStr;
                        const dayBookings = bookings.filter(b => b.date === dateStr && b.status !== 'cancelled' && (!selectedTurfId || b.turfId?._id?.toString() === selectedTurfId.toString()));
                        const hasBookings = dayBookings.length > 0;

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedCalendarDay(cell.date)}
                            className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/25'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-300'
                            }`}
                          >
                            <span className="text-sm font-bold">{cell.day}</span>
                            {hasBookings && (
                              <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                                isSelected ? 'bg-white' : 'bg-emerald-500 animate-pulse'
                              }`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bookings Details Panel */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 shadow-md flex flex-col min-h-[350px]">
                    <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                          Daily Schedule
                        </span>
                        <h3 className="font-black text-slate-900 dark:text-white text-lg mt-2">
                          {selectedCalendarDay.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                        {bookings.filter(b => b.date === getFormattedDateStr(selectedCalendarDay) && (!selectedTurfId || b.turfId?._id?.toString() === selectedTurfId.toString())).length} Booking(s) listed
                      </span>
                    </div>

                    {/* Time Slot Timeline Grid */}
                    <div className="mb-6 space-y-3">
                      <h4 className="text-xs uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">
                        Time Slots Availability
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {allTimeSlots.map((slot) => {
                          const selectedDateStr = getFormattedDateStr(selectedCalendarDay);
                          const booking = bookings.find(b => b.date === selectedDateStr && b.timeSlot === slot && b.status !== 'cancelled' && (!selectedTurfId || b.turfId?._id?.toString() === selectedTurfId.toString()));
                          return (
                            <div
                              key={slot}
                              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between h-20 shadow-sm ${
                                booking
                                  ? 'border-red-500/25 bg-red-500/5 dark:bg-red-500/5 text-red-600 dark:text-red-400'
                                  : 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200">{slot}</span>
                                <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                  booking ? 'bg-red-500/10 text-red-550 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {booking ? 'Booked' : 'Available'}
                                </span>
                              </div>
                              {booking ? (
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate mt-1">
                                  {booking.userId?.name || "Anonymous"} · {booking.turfId?.name || "Turf"}
                                </p>
                              ) : (
                                <span className="text-[9px] text-slate-400 dark:text-slate-500">Unreserved slot</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bookings table list */}
                    <div className="flex-1 overflow-x-auto">
                      {(() => {
                        const selectedDateStr = getFormattedDateStr(selectedCalendarDay);
                        const filteredBookings = bookings.filter(b => b.date === selectedDateStr && (!selectedTurfId || b.turfId?._id?.toString() === selectedTurfId.toString()));

                        if (filteredBookings.length === 0) {
                          return (
                            <div className="h-full flex flex-col justify-center items-center py-12 text-center">
                              <span className="text-4xl mb-2">📅</span>
                              <h4 className="font-bold text-slate-800 dark:text-white">No Bookings Scheduled</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                                There are no turf reservations listed for this date. Check another calendar date or share your turf page with players to receive bookings.
                              </p>
                            </div>
                          );
                        }

                        return (
                          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                <th className="pb-3">Player</th>
                                <th className="pb-3">Field Name</th>
                                <th className="pb-3">Time Slot</th>
                                <th className="pb-3 text-right">Price</th>
                                <th className="pb-3 text-center">Status</th>
                                <th className="pb-3 text-center">Payment</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                              {filteredBookings.map((b) => (
                                <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                  <td className="py-3.5 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-cyan-600/10 text-cyan-500 font-black text-xs flex items-center justify-center shrink-0 border border-cyan-500/20">
                                      {(b.userId?.name || "Player").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                                        {b.userId?.name || "Anonymous"}
                                      </p>
                                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                                        {b.userId?.email || "No email listed"}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="py-3.5 text-slate-700 dark:text-slate-300 font-bold">
                                    {b.turfId?.name || "Deleted Turf"}
                                  </td>
                                  <td className="py-3.5 text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                      <FiClock size={12} className="text-slate-400" />
                                      <span className="font-semibold text-xs text-slate-600 dark:text-slate-400">{b.timeSlot}</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 text-right font-black text-slate-900 dark:text-white">
                                    ₹{b.price}
                                  </td>
                                  <td className="py-3.5 text-center">
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                      b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                      b.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    }`}>
                                      {b.status}
                                    </span>
                                  </td>
                                  <td className="py-3.5 text-center">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                      {b.paymentMethod || "Card"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}

        {/* MODAL 1: Register Turf Arena Form */}
        <AnimatePresence>
          {isTurfModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsTurfModalOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-2xl w-full max-w-xl z-10 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Register Turf Field</h3>
                  <button 
                    onClick={() => setIsTurfModalOpen(false)}
                    className="p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Form body */}
                <form onSubmit={handleTurfSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
                  
                  {/* Name & Sport */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Field Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={turfFormData.name}
                        onChange={(e) => setTurfFormData({ ...turfFormData, name: e.target.value })}
                        placeholder="e.g. Battle Ground Arena"
                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sport Category</label>
                      <select 
                        value={turfFormData.sportCategory} 
                        onChange={(e) => setTurfFormData({ ...turfFormData, sportCategory: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
                      >
                        <option value="football">Football</option>
                        <option value="cricket">Cricket</option>
                        <option value="basketball">Basketball</option>
                      </select>
                    </div>
                  </div>

                  {/* 📍 Location Section */}
                  <div className="space-y-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiMapPin size={14} className="text-emerald-500" />
                        <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Turf Location *</label>
                      </div>
                      <button
                        type="button"
                        onClick={detectCurrentLocation}
                        disabled={detectingLocation}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-sm shadow-emerald-500/20"
                      >
                        <FiCompass size={11} className={detectingLocation ? 'animate-spin' : ''} />
                        {detectingLocation ? 'Detecting GPS...' : '📍 Use My Location'}
                      </button>
                    </div>

                    <input 
                      type="text" 
                      required 
                      value={turfFormData.location}
                      onChange={(e) => setTurfFormData({ ...turfFormData, location: e.target.value })}
                      placeholder="Enter address or click 'Use My Location' to auto-fill"
                      className="w-full px-4 py-3 bg-white/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/60 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />

                    {/* Coordinate Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Latitude</label>
                        <input
                          type="number"
                          step="0.000001"
                          value={turfFormData.latitude || ''}
                          onChange={(e) => setTurfFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || null }))}
                          placeholder="e.g. 19.9975"
                          className="w-full px-3 py-2.5 bg-white/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Longitude</label>
                        <input
                          type="number"
                          step="0.000001"
                          value={turfFormData.longitude || ''}
                          onChange={(e) => setTurfFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || null }))}
                          placeholder="e.g. 73.7898"
                          className="w-full px-3 py-2.5 bg-white/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                        />
                      </div>
                    </div>

                    {/* Live OpenStreetMap Preview — shows when coordinates are available */}
                    {turfFormData.latitude && turfFormData.longitude && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full rounded-xl overflow-hidden border border-emerald-500/30 shadow-lg"
                      >
                        <div className="bg-emerald-600/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              Live Map Pin
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {turfFormData.latitude.toFixed(5)}°N, {turfFormData.longitude.toFixed(5)}°E
                          </span>
                        </div>
                        <iframe
                          title="Turf Location Map"
                          width="100%"
                          height="200"
                          frameBorder="0"
                          scrolling="no"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${turfFormData.longitude - 0.007}%2C${turfFormData.latitude - 0.005}%2C${turfFormData.longitude + 0.007}%2C${turfFormData.latitude + 0.005}&layer=mapnik&marker=${turfFormData.latitude}%2C${turfFormData.longitude}`}
                          className="w-full"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Area & Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Neighborhood</label>
                      <input 
                        type="text" 
                        value={turfFormData.Area}
                        onChange={(e) => setTurfFormData({ ...turfFormData, Area: e.target.value })}
                        placeholder="e.g. Ashok Nagar"
                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hourly Rate (₹) *</label>
                      <input 
                        type="number" 
                        required 
                        value={turfFormData.priceAmount}
                        onChange={(e) => setTurfFormData({ ...turfFormData, priceAmount: e.target.value })}
                        placeholder="900"
                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Billing Unit</label>
                      <select 
                        value={turfFormData.priceUnit} 
                        onChange={(e) => setTurfFormData({ ...turfFormData, priceUnit: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
                      >
                        <option value="per hr">per hour</option>
                        <option value="per slot">per slot</option>
                        <option value="per match">per match</option>
                      </select>
                    </div>
                  </div>

                  {/* ☁️ Cloudinary Photo Upload */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Turf Photos — Cloud Storage
                      </label>
                      {turfFormData.photos.length > 0 && (
                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                          ☁️ {turfFormData.photos.length} photo(s) ready to upload
                        </span>
                      )}
                    </div>
                    <div className="border-2 border-dashed border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-colors relative flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-950/35 group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <FiUploadCloud size={32} className="text-slate-400 dark:text-slate-500 mb-2 group-hover:text-emerald-500 transition-colors" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Drag & drop or click to choose photos</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB each — stored on Cloudinary CDN</p>
                    </div>

                    {/* Photo Previews */}
                    {turfFormData.photos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2.5 pt-1">
                        {turfFormData.photos.map((photo, i) => (
                          <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200/30 group shadow-sm">
                            <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200" />
                            <button
                              type="button"
                              onClick={() => removeTurfPhoto(i)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 cursor-pointer shadow opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FiX size={11} />
                            </button>
                            {i === 0 && (
                              <span className="absolute bottom-1 left-1 bg-emerald-500 text-slate-950 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Facilities & Amenities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableFacilities.map((fac) => {
                        const isChecked = turfFormData.facilities.includes(fac);
                        return (
                          <div 
                            key={fac}
                            onClick={() => handleFacilityToggle(fac)}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer transition-colors text-xs font-bold select-none ${
                              isChecked 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                            }`}>
                              {isChecked && <FiCheck size={10} />}
                            </span>
                            {fac}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex gap-3 justify-end shrink-0">
                    <button 
                      type="button" 
                      onClick={() => setIsTurfModalOpen(false)}
                      className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={uploadingPhotos}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/10 cursor-pointer transition-all flex items-center gap-2"
                    >
                      {uploadingPhotos ? (
                        <>
                          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 00-10 10h4z"/>
                          </svg>
                          Uploading Photos...
                        </>
                      ) : 'Publish Listing'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 2: Create Tournament Multi-step Wizard */}
        <AnimatePresence>
          {isTournModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsTournModalOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-2xl w-full max-w-xl z-10 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Organize Tournament League</h3>
                    <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Step {tournStep} of 3</p>
                  </div>
                  <button 
                    onClick={() => { setIsTournModalOpen(false); setTournStep(1); }}
                    className="p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleTournSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
                  <AnimatePresence mode="wait">
                    
                    {/* WIZARD STEP 1: Basic settings */}
                    {tournStep === 1 && (
                      <motion.div 
                        key="step-1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">1. League Details</h4>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tournament / League Name *</label>
                          <input 
                            type="text" required
                            value={tournFormData.name}
                            onChange={(e) => setTournFormData({ ...tournFormData, name: e.target.value })}
                            placeholder="e.g. Winter Cup Soccer League"
                            className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sport Type</label>
                            <select
                              value={tournFormData.sport}
                              onChange={(e) => setTournFormData({ ...tournFormData, sport: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
                            >
                              <option value="Football">Football / Soccer</option>
                              <option value="Cricket">Cricket</option>
                              <option value="Basketball">Basketball</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">League Category</label>
                            <input 
                              type="text" required
                              value={tournFormData.category}
                              onChange={(e) => setTournFormData({ ...tournFormData, category: e.target.value })}
                              placeholder="e.g. Under-19, Open Group"
                              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Match Schedule Date *</label>
                            <input 
                              type="date" required
                              value={tournFormData.date}
                              onChange={(e) => setTournFormData({ ...tournFormData, date: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Match Timings</label>
                            <select
                              value={tournFormData.tournamentTime}
                              onChange={(e) => setTournFormData({ ...tournFormData, tournamentTime: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
                            >
                              <option value="Day-Night">Day-Night</option>
                              <option value="Morning (7:00 AM - 12:00 PM)">Morning</option>
                              <option value="Evening (4:00 PM - 10:00 PM)">Evening</option>
                              <option value="Full Day">Full Day</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => { if (tournFormData.name && tournFormData.date) setTournStep(2); }}
                            disabled={!tournFormData.name || !tournFormData.date}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Next Step
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* WIZARD STEP 2: Venue and payouts */}
                    {tournStep === 2 && (
                      <motion.div 
                        key="step-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">2. Venue & Financials</h4>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Select Arena Venue *</label>
                          <select
                            value={tournFormData.locationId}
                            onChange={(e) => setTournFormData({ ...tournFormData, locationId: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
                          >
                            {turfs.map(t => (
                              <option key={t._id} value={t._id}>{t.name} ({t.location})</option>
                            ))}
                            {turfs.length === 0 && <option value="">No arenas listed - listing to default area</option>}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Team Roster limit</label>
                            <input 
                              type="text" 
                              value={tournFormData.teamComposition}
                              onChange={(e) => setTournFormData({ ...tournFormData, teamComposition: e.target.value })}
                              placeholder="e.g. 7 players"
                              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Max Teams *</label>
                            <input 
                              type="number" required
                              value={tournFormData.maxTeams}
                              onChange={(e) => setTournFormData({ ...tournFormData, maxTeams: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Entry Fee per Team (₹) *</label>
                            <input 
                              type="number" required
                              value={tournFormData.entryFee}
                              onChange={(e) => setTournFormData({ ...tournFormData, entryFee: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Roster Deadline Date *</label>
                            <input 
                              type="date" required
                              value={tournFormData.registrationDeadline}
                              onChange={(e) => setTournFormData({ ...tournFormData, registrationDeadline: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-100/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200/40 dark:border-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                          </div>
                        </div>

                        {/* Prizes splits */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/40 dark:border-slate-800 rounded-2xl space-y-3">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cash Prizes split (₹)</h5>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block">🥇 1st Place</label>
                              <input 
                                type="number" 
                                value={tournFormData.prizeFirst}
                                onChange={(e) => setTournFormData({ ...tournFormData, prizeFirst: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg border border-slate-200/40 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block">🥈 2nd Place</label>
                              <input 
                                type="number" 
                                value={tournFormData.prizeSecond}
                                onChange={(e) => setTournFormData({ ...tournFormData, prizeSecond: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg border border-slate-200/40 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block">🥉 3rd Place</label>
                              <input 
                                type="number" 
                                value={tournFormData.prizeThird}
                                onChange={(e) => setTournFormData({ ...tournFormData, prizeThird: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg border border-slate-200/40 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-between gap-3">
                          <button
                            type="button" onClick={() => setTournStep(1)}
                            className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Back
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { if (tournFormData.registrationDeadline && tournFormData.entryFee) setTournStep(3); }}
                            disabled={!tournFormData.registrationDeadline || !tournFormData.entryFee}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Next Step
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* WIZARD STEP 3: Banner photo and confirmation */}
                    {tournStep === 3 && (
                      <motion.div 
                        key="step-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">3. League Banner</h4>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tournament Banner / Cover Photo</label>
                          <div className="border-2 border-dashed border-slate-200/60 dark:border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-colors relative flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-950/35">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleTournamentLogoUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <FiUploadCloud size={32} className="text-slate-400 dark:text-slate-500 mb-2" />
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Choose Tournament Banner image</p>
                            <p className="text-xs text-slate-400 mt-1">Recommended 16:9 ratio landscape photo</p>
                          </div>

                          {/* Image preview */}
                          {tournFormData.logo && (
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200/30 max-w-sm mx-auto shadow-md">
                              <img src={tournFormData.logo} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setTournFormData(prev => ({ ...prev, logo: '' }))}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 cursor-pointer shadow"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex justify-between gap-3 shrink-0">
                          <button
                            type="button" onClick={() => setTournStep(2)}
                            className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Back
                          </button>
                          
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-emerald-500/10"
                          >
                            Publish Tournament
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default OwnerTurfManagement;
