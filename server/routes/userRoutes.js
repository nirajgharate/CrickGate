import express from "express";
import wrapAsync from "../wrapAsync.js";
import { EditUser, FetchUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getuser", authMiddleware, wrapAsync(FetchUser));
router.post("/edituser", authMiddleware, wrapAsync(EditUser));
  
 
export default router;