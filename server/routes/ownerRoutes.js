import express from "express";
import wrapAsync from "../wrapAsync.js";
import { 
    GetDashboardStats, 
    AddOwnerTurf, 
    GetOwnerTurfs, 
    GetOwnerBookings, 
    GetOwnerProfile, 
    UpdateOwnerProfile 
} from "../controllers/ownerController.js";
import ownerAuthMiddleware from "../middlewares/ownerAuthMiddleware.js";

const router = express.Router();

// All owner routes are protected by ownerAuthMiddleware
// Only tokens with role: 'owner' are allowed
router.get("/stats",    ownerAuthMiddleware, wrapAsync(GetDashboardStats));
router.post("/addturf", ownerAuthMiddleware, wrapAsync(AddOwnerTurf));
router.get("/myturfs",  ownerAuthMiddleware, wrapAsync(GetOwnerTurfs));
router.get("/bookings", ownerAuthMiddleware, wrapAsync(GetOwnerBookings));
router.get("/profile",  ownerAuthMiddleware, wrapAsync(GetOwnerProfile));
router.post("/profile", ownerAuthMiddleware, wrapAsync(UpdateOwnerProfile));

export default router;
