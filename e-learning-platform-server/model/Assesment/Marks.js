const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    studentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    quizzesRef: [
      {
        quizRef: {
          type: mongoose.Types.ObjectId,
          ref: "Quiz",
        },
        marksObtained: { type: Number },
      },
    ],
    assignmentsRef: [
      {
        assignmentRef: {
          type: mongoose.Types.ObjectId,
          ref: "Assignment",
        },
        marksObtained: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const MarksModel = mongoose.model("Marks", marksSchema);
module.exports = MarksModel;
