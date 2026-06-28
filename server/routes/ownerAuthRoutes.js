import express from "express";
import wrapAsync from "../wrapAsync.js";
import { OwnerSignup, OwnerLogin } from "../controllers/ownerAuthController.js";

const router = express.Router();

router.post("/signup", wrapAsync(OwnerSignup));
router.post("/login",  wrapAsync(OwnerLogin));

export default router;
