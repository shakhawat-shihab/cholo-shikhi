const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    moduleRef: {
      type: mongoose.Types.ObjectId,
      ref: "Module",
    },
    teacherRef: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
    },
    isPublishByTeacher: {
      type: Boolean,
      default: false,
    },
    documentUrl: {
      type: String,
    },
    total: {
      type: Number,
      required: true,
    },
    passMarkPercentage: {
      type: Number,
      required: true,
    },
    durationInDay: {
      type: Number,
      required: true,
      default: 1,
    },
    assignmentPos: Number,
  },
  { timestamps: true }
);

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);
module.exports = AssignmentModel;
