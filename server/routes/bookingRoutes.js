import express from "express";
import wrapAsync from "../wrapAsync.js";
import { CreateBooking, GetUserBookings, CancelBooking, CheckAvailability } from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, wrapAsync(CreateBooking));
router.get("/mybookings", authMiddleware, wrapAsync(GetUserBookings));
router.post("/cancel/:bookingId", authMiddleware, wrapAsync(CancelBooking));
router.get("/availability", wrapAsync(CheckAvailability));

export default router;
