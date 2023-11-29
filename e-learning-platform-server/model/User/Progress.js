const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    studentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    completedModulesRef: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Module",
      },
    ],
    completedContentsRef: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Content",
      },
    ],
    completedQuizzesRef: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    completedAssignmentsRef: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ProgressModel = mongoose.model("Progress", progressSchema);
module.exports = ProgressModel;
