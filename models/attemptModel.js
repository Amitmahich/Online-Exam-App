const mongoose = require("mongoose");
const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOption: Number,
      },
    ],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    score: {
      type: Number,
      default: 0,
    },
    submittedAt: Date,
  },
  { timestamps: true },
);
attemptSchema.index({ student: 1, exam: 1 }, { unique: true });
module.exports = mongoose.model("Attempt", attemptSchema);
