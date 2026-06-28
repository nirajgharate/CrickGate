import mongoose from 'mongoose';

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: String, // e.g. "₹900 per hr"
        required: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    image: {
        type: String, // Path to local asset or remote URL
        required: true
    },
    Area: {
        type: String,
        trim: true
    },
    facilities: {
        type: [String], // Array of facilities like "Parking", "Restrooms"
        default: []
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    latitude: {
        type: Number,
        default: 20.00
    },
    longitude: {
        type: Number,
        default: 73.78
    }
}, { timestamps: true });

export default mongoose.model('Turf', turfSchema);
