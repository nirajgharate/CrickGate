import express from "express";
import wrapAsync from "../wrapAsync.js";
import { 
    CreateTournament, 
    GetAllTournaments, 
    GetTournamentDetails, 
    RegisterForTournament, 
    GetRegisteredTournaments,
    GetOwnerTournaments
} from "../controllers/tournamentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import ownerAuthMiddleware from "../middlewares/ownerAuthMiddleware.js";

const router = express.Router();

router.post("/create", ownerAuthMiddleware, wrapAsync(CreateTournament));
router.get("/all", wrapAsync(GetAllTournaments));
router.get("/myregistrations", authMiddleware, wrapAsync(GetRegisteredTournaments));
router.get("/owner-tournaments", ownerAuthMiddleware, wrapAsync(GetOwnerTournaments));
router.get("/:tournamentId", wrapAsync(GetTournamentDetails));
router.post("/register", authMiddleware, wrapAsync(RegisterForTournament));

export default router;
