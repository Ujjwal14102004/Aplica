import express from "express";
import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import User from "../models/User.js";

const router = express.Router();

/* =====================================
   STEP 1: Professional Information
===================================== */
router.post("/professional", auth, async (req, res) => {
  try {
    const { role, experience, headline } = req.body;

    // 🔒 Validation
    if (
      !role ||
      !headline?.trim() ||
      !experience ||
      typeof experience.years !== "number" ||
      typeof experience.months !== "number"
    ) {
      return res.status(400).json({
        message: "Role, headline, and valid experience are required"
      });
    }

    if (experience.months < 0 || experience.months > 11) {
      return res.status(400).json({
        message: "Experience months must be between 0 and 11"
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      professionalInfo: {
        role,
        experience,
        headline: headline.trim()
      },
      onboardingStep: "portfolio"
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Professional info save failed:", err);
    res.status(500).json({ message: "Failed to save professional info" });
  }
});

/* =====================================
   STEP 2: Portfolio & Socials
===================================== */
router.post("/portfolio", auth, async (req, res) => {
  try {
    const {
      portfolio = null,
      linkedin = null,
      github = null,
      dribbble = null,
      behance = null,
      instagram = null,
      twitter = null
    } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      portfolio: {
        portfolio,
        linkedin,
        github,
        dribbble,
        behance,
        instagram,
        twitter
      },
      onboardingStep: "attachments"
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Portfolio save failed:", err);
    res.status(500).json({ message: "Failed to save portfolio" });
  }
});

/* =====================================
   STEP 3: Attachments (Optional)
===================================== */
router.post(
  "/attachments",
  auth,
  upload.single("file"), // MUST match FormData key
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        attachment: {
          filename: req.file?.filename || null,
          originalName: req.file?.originalname || null,
          mimeType: req.file?.mimetype || null,
          size: req.file?.size || null,
          note: req.body?.note || ""
        },
        onboardingStep: "done"
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Attachment upload failed:", err);
      res.status(400).json({ message: "Attachment upload failed" });
    }
  }
);

/* =====================================
   STEP 4: Public Profile
===================================== */
router.post("/public", auth, async (req, res) => {
  try {
    const { firstName, lastName, location, avatar } = req.body;

    if (!firstName || !lastName || !location) {
      return res.status(400).json({
        message: "Missing public profile fields"
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      publicProfile: {
        firstName,
        lastName,
        location,
        avatar: avatar || null
      },
      onboardingStep: "professional"
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Public profile save failed:", err);
    res.status(500).json({ message: "Failed to save public profile" });
  }
});

/* =====================================
   STEP 5: Complete Profile (Safety Net)
===================================== */
router.post("/complete", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      profileComplete: true,
      onboardingStep: "done"
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Profile completion failed:", err);
    res.status(500).json({ message: "Failed to complete profile" });
  }
});

export default router;
