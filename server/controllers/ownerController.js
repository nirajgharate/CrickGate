import Turf from "../models/turf.js";
import Booking from "../models/booking.js";
import BusinessProfile from "../models/businessProfile.js";
import Owner from "../models/owner.js";
import Review from "../models/review.js";


// Get dashboard statistics for a turf owner
export const GetDashboardStats = async (req, res) => {
    const ownerId = req.ownerId;
    
    // Fetch owner details
    const owner = await Owner.findById(ownerId).select("name avatar");

    // Find all turfs listed by this owner
    const myTurfs = await Turf.find({ ownerId });
    const turfIds = myTurfs.map(t => t._id);

    // Find bookings associated with these turfs
    const myBookings = await Booking.find({ turfId: { $in: turfIds } })
        .populate('userId', 'name email')
        .populate('turfId', 'name price');

    // Find reviews associated with these turfs
    const reviews = await Review.find({ turfId: { $in: turfIds } })
        .populate('userId', 'name')
        .populate('turfId', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    const recentReviewsMapped = reviews.map(r => ({
        id: r._id,
        turfName: r.turfId?.name || "Deleted Turf",
        userName: r.userId?.name || "Anonymous",
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }));

    // Aggregate statistics
    let totalRevenue = 0;
    let completedBookings = 0;
    const sportCounts = { cricket: 0, football: 0, basketball: 0 };

    // Generate the last 6 months dynamically (ending with current month)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthlyRevenue.push({
            month: monthNames[d.getMonth()],
            revenue: 0,
            monthIndex: d.getMonth(),
            year: d.getFullYear()
        });
    }

    myBookings.forEach(booking => {
        if (booking.status === 'completed') {
            totalRevenue += booking.price;
            completedBookings++;
            
            // Increment category (sport) based on turf details or names
            const turfName = booking.turfId?.name?.toLowerCase() || '';
            if (turfName.includes('cricket') || turfName.includes('pitch')) {
                sportCounts.cricket++;
            } else if (turfName.includes('basketball') || turfName.includes('court')) {
                sportCounts.basketball++;
            } else {
                sportCounts.football++; // default fallback
            }

            // Group revenue by month
            const bookingDate = new Date(booking.createdAt);
            const bookingMonth = bookingDate.getMonth();
            const bookingYear = bookingDate.getFullYear();

            const trendItem = monthlyRevenue.find(item => item.monthIndex === bookingMonth && item.year === bookingYear);
            if (trendItem) {
                trendItem.revenue += booking.price;
            }
        }
    });

    // Calculate dynamic occupancy rate (based on 30-day capacity of 8 slots/day per turf)
    let occupancyRate = 0;
    if (myTurfs.length > 0) {
        const totalSlots = myTurfs.length * 8 * 30;
        occupancyRate = Math.min(100, Math.round((completedBookings / totalSlots) * 100)) || 0;
    }

    // Dynamic sports distribution percentage calculation
    const totalSportsCount = sportCounts.cricket + sportCounts.football + sportCounts.basketball;
    const sportsDistribution = [
        { name: 'Cricket', value: totalSportsCount > 0 ? Math.round((sportCounts.cricket / totalSportsCount) * 100) : 0 },
        { name: 'Football', value: totalSportsCount > 0 ? Math.round((sportCounts.football / totalSportsCount) * 100) : 0 },
        { name: 'Basketball', value: totalSportsCount > 0 ? Math.round((sportCounts.basketball / totalSportsCount) * 100) : 0 }
    ];

    // Recent Bookings (limit to last 6)
    const recentBookings = myBookings
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 6)
        .map(b => ({
            id: b._id,
            turfName: b.turfId?.name || "Deleted Turf",
            userName: b.userId?.name || "Anonymous Player",
            date: b.date,
            timeSlot: b.timeSlot,
            amount: b.price,
            status: b.status,
            paymentMethod: b.paymentMethod
        }));

    // Calculate live occupancy for each turf owned by this owner
    const todayStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); // e.g. "22 Jun" or "20 Sep"
    const liveOccupancy = myTurfs.map(turf => {
        // Find bookings for this turf today
        const turfBookingsToday = myBookings.filter(b => 
            b.turfId?._id?.toString() === turf._id.toString() && 
            b.date === todayStr &&
            b.status !== 'cancelled'
        );

        let status = "Available";
        let player = "No active slot scheduled";
        let pct = 0;

        if (turfBookingsToday.length > 0) {
            const activeBooking = turfBookingsToday[0];
            status = "Booked Today";
            player = `${activeBooking.userId?.name || "Player"} @ ${activeBooking.timeSlot}`;
            pct = 100;
        }

        // Determine sport category based on turf name or area
        const turfNameLower = turf.name.toLowerCase();
        let sport = "Football";
        if (turfNameLower.includes("cricket") || turfNameLower.includes("pitch")) {
            sport = "Cricket";
        } else if (turfNameLower.includes("basketball") || turfNameLower.includes("court")) {
            sport = "Basketball";
        }

        // Parse images: if turf image is a JSON string of multiple urls, parse it and get the first one.
        let displayImg = turf.image;
        if (displayImg && displayImg.trim().startsWith('[') && displayImg.trim().endsWith(']')) {
            try {
                const parsed = JSON.parse(displayImg);
                if (parsed.length > 0) displayImg = parsed[0];
            } catch (e) {}
        }

        return {
            id: turf._id.toString(),
            turfName: turf.name,
            sport,
            status,
            player,
            pct,
            img: displayImg || turf.image
        };
    });

    res.status(200).json({
        success: true,
        owner,
        stats: {
            totalRevenue,
            bookingsCount: completedBookings,
            activeTurfsCount: myTurfs.length,
            occupancyRate,
            monthlyRevenueTrend: monthlyRevenue.map(item => ({ month: item.month, revenue: item.revenue })),
            sportsDistribution,
            recentBookings,
            recentReviews: recentReviewsMapped,
            liveOccupancy
        }
    });
};

// Add a new turf field
export const AddOwnerTurf = async (req, res) => {
    const ownerId = req.ownerId;
    const { name, location, price, Area, facilities, image, latitude, longitude } = req.body;

    if (!name || !location || !price || !image) {
        return res.status(400).json({ success: false, message: "Missing required turf details" });
    }

    const newTurf = new Turf({
        name,
        location,
        price,
        Area: Area || "General",
        facilities: facilities || [],
        image,
        ownerId,
        latitude: latitude || 20.00,
        longitude: longitude || 73.78
    });

    await newTurf.save();

    res.status(201).json({
        success: true,
        message: "Turf listed successfully!",
        turf: newTurf
    });
};

// Get all turfs owned by this owner
export const GetOwnerTurfs = async (req, res) => {
    const ownerId = req.ownerId;
    const turfs = await Turf.find({ ownerId });
    res.status(200).json({ success: true, turfs });
};

// Get bookings for all turfs owned by this owner
export const GetOwnerBookings = async (req, res) => {
    const ownerId = req.ownerId;
    const myTurfs = await Turf.find({ ownerId });
    const turfIds = myTurfs.map(t => t._id);

    const bookings = await Booking.find({ turfId: { $in: turfIds } })
        .populate('userId', 'name email phone')
        .populate('turfId', 'name price')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
};

// Get owner's business profile
export const GetOwnerProfile = async (req, res) => {
    const ownerId = req.ownerId;
    const owner = await Owner.findById(ownerId).select("-password");
    if (!owner) {
        return res.status(404).json({ success: false, message: "Owner not found" });
    }

    let profile = await BusinessProfile.findOne({ ownerId });
    
    // If not found, create or return default profile linked to Owner
    if (!profile) {
        profile = await BusinessProfile.create({
            ownerId,
            companyName: `${owner.name} Sports Ltd`,
            gstNumber: "27AAACT1234A1Z1",
            contactEmail: owner.email,
            contactPhone: owner.phone || "9876543210",
            address: owner.address || "Sport Complex Road, Pune, Maharashtra",
            bankName: "HDFC Bank",
            accountHolderName: owner.name,
            accountNumber: "50100293847581",
            ifscCode: "HDFC0000104",
            upiId: `${owner.name.toLowerCase().replace(/\s+/g, '')}@ybl`,
            latitude: 20.00,
            longitude: 73.78
        });
    }
    
    res.status(200).json({ success: true, owner, profile });
};

// Update owner's business profile
export const UpdateOwnerProfile = async (req, res) => {
    const ownerId = req.ownerId;
    const { 
        companyName, gstNumber, contactEmail, contactPhone, address, 
        bankName, accountHolderName, accountNumber, ifscCode, upiId,
        latitude, longitude,
        name, phone, avatar
    } = req.body;
    
    if (!companyName || !contactEmail || !contactPhone) {
        return res.status(400).json({ success: false, message: "Company name, email and phone are required" });
    }

    // Update Owner details if provided
    const ownerUpdate = {};
    if (name) ownerUpdate.name = name;
    if (phone) ownerUpdate.phone = phone;
    if (address) ownerUpdate.address = address;
    if (avatar !== undefined) ownerUpdate.avatar = avatar;

    if (Object.keys(ownerUpdate).length > 0) {
        await Owner.findByIdAndUpdate(ownerId, { $set: ownerUpdate });
    }
    
    const profile = await BusinessProfile.findOneAndUpdate(
        { ownerId },
        {
            $set: {
                companyName,
                gstNumber,
                contactEmail,
                contactPhone,
                address,
                bankName,
                accountHolderName,
                accountNumber,
                ifscCode,
                upiId,
                latitude: Number(latitude) || 20.00,
                longitude: Number(longitude) || 73.78
            }
        },
        { new: true, upsert: true }
    );
    
    const updatedOwner = await Owner.findById(ownerId).select("-password");

    res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        profile,
        owner: updatedOwner
    });
};

