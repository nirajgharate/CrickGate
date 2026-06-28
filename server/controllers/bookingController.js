import Booking from "../models/booking.js";
import Turf from "../models/turf.js";

// Create a new booking
export const CreateBooking = async (req, res) => {
    const userId = req.userId;
    const { turfId, date, timeSlot, price, paymentMethod } = req.body;

    if (!turfId || !date || !timeSlot || !price) {
        return res.status(400).json({ success: false, message: "Missing required booking fields" });
    }

    // Check if slot already booked
    const existingBooking = await Booking.findOne({
        turfId,
        date,
        timeSlot,
        status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
        return res.status(400).json({ success: false, message: "This slot is already booked!" });
    }

    const newBooking = new Booking({
        turfId,
        userId,
        date,
        timeSlot,
        price,
        paymentMethod: paymentMethod || 'card',
        status: 'completed'
    });

    await newBooking.save();

    res.status(201).json({
        success: true,
        message: "Booking confirmed successfully!",
        booking: newBooking
    });
};

// Get bookings for the authenticated user
export const GetUserBookings = async (req, res) => {
    const userId = req.userId;
    const bookings = await Booking.find({ userId })
        .populate('turfId')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
};

// Cancel a booking
export const CancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.userId.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized to cancel this booking" });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled successfully", booking });
};

// Check slot availability
export const CheckAvailability = async (req, res) => {
    const { turfId, date } = req.query;

    if (!turfId || !date) {
        return res.status(400).json({ success: false, message: "Turf ID and Date are required" });
    }

    const bookings = await Booking.find({
        turfId,
        date,
        status: { $ne: 'cancelled' }
    });

    const bookedSlots = bookings.map(b => b.timeSlot);

    res.status(200).json({ success: true, bookedSlots });
};
