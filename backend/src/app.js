import "./config/passport.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";

import connectDB from "./db/mongoose.js";

import authRoutes from "./routes/auth.routes.js";
import profileSetupRoutes from "./routes/profileSetup.routes.js";


const app = express();

/* ===============================
   Middleware
================================ */

// CORS (frontend + credentials safe)
app.use(
  cors({
    origin:  [
      "https://aplica-2-0.vercel.app/",
    ] ,
    credentials: true,
  })
);

app.use(cookieParser());


// Increase payload limits (FIXES 413 ERROR)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));



/* ===============================
   Database
================================ */
connectDB();

/* ===============================
   Routes
================================ */
app.use("/auth", authRoutes);
app.use("/api/profile-setup", profileSetupRoutes);

/* ===============================
   Health Check (IMPORTANT)
================================ */
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});

/* ===============================
   Global Error Handler
================================ */
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err);

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "Uploaded file is too large. Max size is 10MB.",
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ===============================
   Server
================================ */
const PORT = process.env.PORT || 5000;

app.get("/whoami", (req, res) => {
  res.send("THIS BACKEND IS RUNNING");
});


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
