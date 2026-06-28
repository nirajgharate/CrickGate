import Tournament from "../models/tournament.js";
import TournamentRegistration from "../models/tournamentRegistration.js";
import Owner from "../models/owner.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// Create a new tournament (Owner only — uses ownerAuthMiddleware in routes)
export const CreateTournament = async (req, res) => {
    const ownerId = req.ownerId; // set by ownerAuthMiddleware

    const { name, sport, date, location, category, entryFee, prizePool, teamComposition, tournamentTime, registrationDeadline, maxTeams, image, latitude, longitude } = req.body;

    if (!name || !sport || !date || !location || !category || !registrationDeadline || !image) {
        return res.status(400).json({ success: false, message: "Missing required tournament fields" });
    }

    const newTournament = new Tournament({
        name,
        sport,
        date,
        location,
        category,
        entryFee: entryFee || 0,
        prizePool: prizePool || { first: 0, second: 0, third: 0 },
        teamComposition: teamComposition || "7 players",
        tournamentTime: tournamentTime || "Day-Night",
        registrationDeadline,
        maxTeams: maxTeams || 16,
        image,
        ownerId,
        latitude: latitude || 20.00,
        longitude: longitude || 73.78
    });

    await newTournament.save();

    res.status(201).json({
        success: true,
        message: "Tournament listed successfully!",
        tournament: newTournament
    });
};

// Get all tournaments (public, optionally filtered by sport)
export const GetAllTournaments = async (req, res) => {
    const { sport } = req.query;
    let query = {};
    if (sport && sport !== 'all') {
        query.sport = new RegExp(`^${sport}$`, 'i');
    }

    const tournaments = await Tournament.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tournaments });
};

// Get tournament details by ID (public)
export const GetTournamentDetails = async (req, res) => {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
        return res.status(404).json({ success: false, message: "Tournament not found" });
    }

    res.status(200).json({ success: true, tournament });
};

// Register team for a tournament (player action, uses regular authMiddleware)
export const RegisterForTournament = async (req, res) => {
    const userId = req.userId;
    const { tournamentId, teamName, captainName, whatsappNumber, teamMembers } = req.body;

    if (!tournamentId || !teamName || !captainName || !whatsappNumber) {
        return res.status(400).json({ success: false, message: "Missing required registration details" });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
        return res.status(404).json({ success: false, message: "Tournament not found" });
    }

    if (tournament.registeredTeamsCount >= tournament.maxTeams) {
        return res.status(400).json({ success: false, message: "Tournament roster slots are full!" });
    }

    const existingReg = await TournamentRegistration.findOne({
        tournamentId,
        $or: [{ teamName }, { captainName }]
    });

    if (existingReg) {
        return res.status(400).json({ success: false, message: "Team Name or Captain Name already registered for this tournament!" });
    }

    const registration = new TournamentRegistration({
        tournamentId,
        userId,
        teamName,
        captainName,
        whatsappNumber,
        teamMembers: teamMembers || []
    });

    await registration.save();

    tournament.registeredTeamsCount += 1;
    await tournament.save();

    res.status(201).json({
        success: true,
        message: "Team registered for tournament successfully!",
        registration
    });
};

// Get registered tournaments for a player
export const GetRegisteredTournaments = async (req, res) => {
    const userId = req.userId;
    const registrations = await TournamentRegistration.find({ userId })
        .populate('tournamentId')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, registrations });
};

// Get tournaments created by this owner
export const GetOwnerTournaments = async (req, res) => {
    const ownerId = req.ownerId;
    const tournaments = await Tournament.find({ ownerId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tournaments });
};
