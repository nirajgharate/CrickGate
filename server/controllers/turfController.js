import Turf from "../models/turf.js";

// Fetch all turfs (with optional search and sorting)
export const GetAllTurfs = async (req, res) => {
    const { search, area, latitude, longitude } = req.query;
    let query = {};

    if (search) {
        query.$or = [
            { name: new RegExp(search, 'i') },
            { location: new RegExp(search, 'i') }
        ];
    }

    if (area) {
        query.Area = new RegExp(area, 'i');
    }

    let turfs = await Turf.find(query).lean();

    if (latitude && longitude) {
        const userLat = Number(latitude);
        const userLng = Number(longitude);
        
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Radius of the earth in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2); 
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            return R * c; // Distance in km
        };

        turfs = turfs.map(t => {
            let distance = null;
            if (t.latitude !== undefined && t.longitude !== undefined && t.latitude !== null && t.longitude !== null) {
                distance = calculateDistance(userLat, userLng, t.latitude, t.longitude);
            }
            return { ...t, distance };
        });

        // Sort by distance (closest first)
        turfs.sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
    } else {
        // Default sort by rating
        turfs.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    res.status(200).json({ success: true, turfs });
};

// Fetch top rated turfs
export const GetTopRatedTurfs = async (req, res) => {
    const turfs = await Turf.find({}).sort({ rating: -1 }).limit(6);
    res.status(200).json({ success: true, turfs });
};

// Fetch turf details by ID
export const GetTurfDetails = async (req, res) => {
    const { turfId } = req.params;
    const turf = await Turf.findById(turfId).populate('ownerId', 'name email');

    if (!turf) {
        return res.status(404).json({ success: false, message: "Turf field not found" });
    }

    res.status(200).json({ success: true, turf });
};
