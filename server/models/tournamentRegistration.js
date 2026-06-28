import mongoose from 'mongoose';

const tournamentRegistrationSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamName: {
        type: String,
        required: true,
        trim: true
    },
    captainName: {
        type: String,
        required: true,
        trim: true
    },
    whatsappNumber: {
        type: String,
        required: true,
        trim: true
    },
    teamMembers: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export default mongoose.model('TournamentRegistration', tournamentRegistrationSchema);
