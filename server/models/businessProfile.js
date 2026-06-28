import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    gstNumber: {
        type: String,
        trim: true,
        default: ""
    },
    contactEmail: {
        type: String,
        required: true,
        trim: true
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true,
        default: ""
    },
    bankName: {
        type: String,
        trim: true,
        default: ""
    },
    accountHolderName: {
        type: String,
        trim: true,
        default: ""
    },
    accountNumber: {
        type: String,
        trim: true,
        default: ""
    },
    ifscCode: {
        type: String,
        trim: true,
        default: ""
    },
    upiId: {
        type: String,
        trim: true,
        default: ""
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

export default mongoose.model('BusinessProfile', businessProfileSchema);
