import api from "../api/api";

// Fetch owner dashboard statistics
export const GetOwnerStatsService = async () => {
    const res = await api.get("/owner/stats");
    return res.data;
};

// Add a new turf field
export const AddOwnerTurfService = async (turfData) => {
    const res = await api.post("/owner/addturf", turfData);
    return res.data;
};

// Get all turfs listed by this owner
export const GetOwnerTurfsService = async () => {
    const res = await api.get("/owner/myturfs");
    return res.data;
};

// Get bookings for all turfs listed by this owner
export const GetOwnerBookingsService = async () => {
    const res = await api.get("/owner/bookings");
    return res.data;
};

// Fetch owner's business and bank settlement profile
export const GetOwnerProfileService = async () => {
    const res = await api.get("/owner/profile");
    return res.data;
};

// Update owner's business and bank settlement profile
export const UpdateOwnerProfileService = async (profileData) => {
    const res = await api.post("/owner/profile", profileData);
    return res.data;
};
