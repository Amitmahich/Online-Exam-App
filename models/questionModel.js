const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: Number, //0,1,2,3
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Questions", questionSchema);
