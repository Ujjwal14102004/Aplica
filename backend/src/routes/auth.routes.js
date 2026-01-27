import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import User from "../models/User.js";

console.log("🔥 auth.routes.js LOADED");

const router = express.Router();

/**
 * Start Google OAuth
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
    session: false,
  })
);

/**
 * Google OAuth callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/auth`,
    session: false,
  }),
  async (req, res) => {
    try {
      const { email, googleId, avatar } = req.user;

      // 1️⃣ Find or create user
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          email,
          googleId,
          avatar,
          onboardingStep: "public",
          profileComplete: false,
        });
      }

      // 2️⃣ Normalize legacy users
      if (user.onboardingStep === "done") {
        user.profileComplete = true;
        await user.save();
      }

      // 3️⃣ Create JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 4️⃣ Set cookie
      res.cookie("aplica_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      /**
       * ✅ ONLY SAFE REDIRECT
       * Let frontend decide everything else
       */
      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (err) {
      console.error("🔥 OAuth callback error:", err);
      res.redirect(`${process.env.FRONTEND_URL}/auth`);
    }
  }
);

/**
 * Get logged-in user
 */
router.get("/me", authMiddleware, async (req, res) => {
  res.status(200).json(req.user); // req.user MUST be full User model
});


export default router;