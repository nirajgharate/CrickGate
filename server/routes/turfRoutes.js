import express from "express";
import wrapAsync from "../wrapAsync.js";
import { GetAllTurfs, GetTopRatedTurfs, GetTurfDetails } from "../controllers/turfController.js";

const router = express.Router();

router.get("/all", wrapAsync(GetAllTurfs));
router.get("/top-rated", wrapAsync(GetTopRatedTurfs));
router.get("/:turfId", wrapAsync(GetTurfDetails));

export default router;
