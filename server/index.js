import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import ownerAuthRoutes from "./routes/ownerAuthRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import turfRoutes from "./routes/turfRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const port = process.env.PORT || 9005;
const dbUrl = process.env.TURFGATE_DB_URL || process.env.CRICKSLOT_DB_URL;


mongoose
  .connect(dbUrl)
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error: ", err);
  });

app.use("/auth", authRoutes);
app.use("/owner-auth", ownerAuthRoutes);
app.use("/user", userRoutes);
app.use("/owner", ownerRoutes);
app.use("/booking", bookingRoutes);
app.use("/tournament", tournamentRoutes);
app.use("/review", reviewRoutes);
app.use("/turf", turfRoutes);
app.use("/upload", uploadRoutes);

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.get('/', (req, res) => {
    res.send('🚀 TurfGate Backend is running!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});