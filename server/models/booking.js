import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    turfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // e.g. "20 Sep" or "2026-09-20"
        required: true
    },
    timeSlot: {
        type: String, // e.g. "6:00 PM" or "6:00 PM - 8:00 PM"
        required: true
    },
    price: {
        type: Number, // Numeric price for calculation, e.g. 900
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'gpay', 'bank'],
        default: 'card'
    }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
