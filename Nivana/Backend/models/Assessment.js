// models/Assessment.js
const mongoose = require("mongoose");

/* ---------------- ANSWERS ---------------- */
const AnswerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

/* ---------------- LLM ---------------- */
const LlmSchema = new mongoose.Schema(
  {
    severity: String,
    risks: [String],
    guidanceText: String,
    recommendClinicianReview: Boolean,
  },
  { _id: false }
);

/* ---------------- MAIN ---------------- */
const AssessmentSchema = new mongoose.Schema(
  {
    /* 🔥 USER (dashboard ke liye REQUIRED) */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    age: { type: Number },

    /* Raw answers */
    answers: [AnswerSchema],

    /* -------- DASHBOARD FIELDS -------- */
    mood: { type: Number, default: null },       // 1–5
    sleep: { type: Number, default: null },      // 1–5
    stress: { type: Number, default: null },     // 1–5
    moodScore: { type: Number, default: null },  // 1–10
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: null,
    },

    /* -------- CLINICAL SCORES (unchanged) -------- */
    phq9Score: { type: Number, default: null },
    phq9Severity: { type: String, default: null },

    gad7Score: { type: Number, default: null },
    gad7Severity: { type: String, default: null },

    highRisk: { type: Boolean, default: false },
    suicidal: { type: Boolean, default: false },
    needsReview: { type: Boolean, default: false },

    /* LLM */
    llmAnalysis: LlmSchema,
    emergency: { type: Boolean, default: false },
  },
  {
    timestamps: true, // 👈 createdAt + updatedAt automatically
  }
);

module.exports = mongoose.model("Assessment", AssessmentSchema);
