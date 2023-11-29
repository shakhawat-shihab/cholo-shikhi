const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    enrolledCoursesRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Course",
    },
    completedCoursesRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Course",
    },
  },

  { timestamps: true }
);

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
