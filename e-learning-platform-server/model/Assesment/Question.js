const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    quizRef: {
      type: mongoose.Types.ObjectId,
      ref: "Quiz",
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
    },
    correctAns: {
      type: [Number],
    },
  },
  { timestamps: true }
);

const QuestionModel = mongoose.model("Question", questionSchema);
module.exports = QuestionModel;
