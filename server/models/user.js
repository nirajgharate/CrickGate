import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName:{
        type : String
    },
    address :{
        type : String
    },
    favoriteSport:{
        type : String
    },
    phone:{
        type : Number
    },
    dob:{
        type: Date
    },
    totalBookings:{
        type: Number,
        default: 15
    },
    loyaltyPoints:{
        type: Number,
        default: 1200
    },
    role: {
        type: String,
        enum: ['player', 'admin'],
        default: 'player'
    },
    avatar: {
        type: String,
        default: ''
    }
});

export default mongoose.model('User', userSchema);