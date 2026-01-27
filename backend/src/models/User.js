import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: String,

    onboardingStep: {
      type: String,
      enum: ["public", "professional", "portfolio", "attachments", "done"],
      default: "public",
    },

    profileComplete: {
      type: Boolean,
      default: false,
    },

    /* Step 1: Professional Info (NOT required initially) */
    professionalInfo: {
      role: { type: String },
      headline: { type: String },
      experience: {
        years: { type: Number },
        months: { type: Number },
      },
    },

    /* Step 2 */
    portfolio: {
      portfolio: String,
      linkedin: String,
      github: String,
      dribbble: String,
      behance: String,
      instagram: String,
      twitter: String,
    },

    /* Step 3 */
    attachment: {
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
      note: String,
    },

    /* Step 4 */
    publicProfile: {
      firstName: String,
      lastName: String,
      location: String,
      avatar: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
