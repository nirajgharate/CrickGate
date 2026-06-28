import api from "../api/api";

// Fetch all listed tournaments
export const GetAllTournamentsService = async (sport) => {
    const res = await api.get("/tournament/all", { params: { sport } });
    return res.data;
};

// Fetch details for a tournament
export const GetTournamentDetailsService = async (tournamentId) => {
    const res = await api.get(`/tournament/${tournamentId}`);
    return res.data;
};

// Register team squad for a tournament
export const RegisterForTournamentService = async (registrationData) => {
    const res = await api.post("/tournament/register", registrationData);
    return res.data;
};

// Get registered tournaments for player
export const GetRegisteredTournamentsService = async () => {
    const res = await api.get("/tournament/myregistrations");
    return res.data;
};

// Create a new tournament (Admin/Owner only)
export const CreateTournamentService = async (tournamentData) => {
    const res = await api.post("/tournament/create", tournamentData);
    return res.data;
};

// Get tournaments listed by this owner
export const GetOwnerTournamentsService = async () => {
    const res = await api.get("/tournament/owner-tournaments");
    return res.data;
};
