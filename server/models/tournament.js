import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sport: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    entryFee: {
        type: Number,
        default: 0
    },
    prizePool: {
        first: { type: Number, default: 0 },
        second: { type: Number, default: 0 },
        third: { type: Number, default: 0 }
    },
    teamComposition: {
        type: String,
        default: "11 players"
    },
    tournamentTime: {
        type: String,
        default: "Day-Night"
    },
    registrationDeadline: {
        type: String,
        required: true
    },
    maxTeams: {
        type: Number,
        default: 16
    },
    registeredTeamsCount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
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

export default mongoose.model('Tournament', tournamentSchema);
