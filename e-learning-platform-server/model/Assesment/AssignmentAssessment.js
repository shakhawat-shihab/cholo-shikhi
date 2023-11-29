const mongoose = require("mongoose");

const assignmentAssessmentSchema = new mongoose.Schema(
  {
    studentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    assignmentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Assignment",
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    documentUrl: String,
    link: String,
    percentage: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["passed", "failed", "pending"],
      default: "failed",
    },
    marksObtained: Number,
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const AssignmentAssessmentModel = mongoose.model(
  "AssignmentAssesment",
  assignmentAssessmentSchema
);
module.exports = AssignmentAssessmentModel;
