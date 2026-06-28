import express from "express";
import wrapAsync from "../wrapAsync.js";
import { AddReview, GetTurfReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, wrapAsync(AddReview));
router.get("/turf/:turfId", wrapAsync(GetTurfReviews));

export default router;
