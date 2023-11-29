const mongoose = require("mongoose");

const quizAssessmentSchema = new mongoose.Schema(
  {
    studentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    quizRef: {
      type: mongoose.Types.ObjectId,
      ref: "Quiz",
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    marksObtained: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["passed", "failed"],
      default: "failed",
    },
    assessment: [
      {
        questionRef: {
          type: mongoose.Types.ObjectId,
          ref: "Question",
        },
        submittedAns: {
          type: [Number],
        },
        _id: false,
      },
    ],
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const QuizAssessmentModel = mongoose.model(
  "QuizAssesment",
  quizAssessmentSchema
);
module.exports = QuizAssessmentModel;
