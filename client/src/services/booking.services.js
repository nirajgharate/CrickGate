import api from "../api/api";

// Create a booking
export const CreateBookingService = async (bookingData) => {
    const res = await api.post("/booking/create", bookingData);
    return res.data;
};

// Get active player bookings
export const GetUserBookingsService = async () => {
    const res = await api.get("/booking/mybookings");
    return res.data;
};

// Cancel a booking slot
export const CancelBookingService = async (bookingId) => {
    const res = await api.post(`/booking/cancel/${bookingId}`);
    return res.data;
};

// Check slot availability for turf & date
export const CheckSlotAvailabilityService = async (turfId, date) => {
    const res = await api.get("/booking/availability", { params: { turfId, date } });
    return res.data;
};
