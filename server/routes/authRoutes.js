import express from "express";
import { Signup,Login } from "../controllers/authController.js";
import wrapAsync from "../wrapAsync.js";

const router = express.Router();

router.post("/signup", wrapAsync(Signup));
router.post("/login", wrapAsync(Login));   
 
export default router;