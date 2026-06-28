import api from "../api/api";

// Fetch all turfs
export const GetAllTurfsService = async (search, area, latitude, longitude) => {
    const res = await api.get("/turf/all", { params: { search, area, latitude, longitude } });
    return res.data;
};

// Fetch top rated turfs
export const GetTopRatedTurfsService = async () => {
    const res = await api.get("/turf/top-rated");
    return res.data;
};

// Fetch details for a specific turf
export const GetTurfDetailsService = async (turfId) => {
    const res = await api.get(`/turf/${turfId}`);
    return res.data;
};
