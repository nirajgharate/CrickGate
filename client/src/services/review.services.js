import api from "../api/api";

// Submit a review and rating for a turf field
export const AddReviewService = async (reviewData) => {
    const res = await api.post("/review/add", reviewData);
    return res.data;
};

// Get all reviews for a turf field
export const GetTurfReviewsService = async (turfId) => {
    const res = await api.get(`/review/turf/${turfId}`);
    return res.data;
};
