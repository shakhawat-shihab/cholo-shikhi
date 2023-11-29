const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    coursesRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Course",
    },
    resume: {
      type: String,
      required: ["true", "Resume is reuired"],
    },
    education: {
      type: String,
    },
    facebookUrl: {
      type: String,
    },
    twitterUrl: {
      type: String,
    },
    linkedInUrl: {
      type: String,
    },
    experience: {
      type: [
        {
          title: String,
          organizationName: String,
        },
      ],
    },
  },

  { timestamps: true }
);

const TeacherModel = mongoose.model("Teacher", teacherSchema);
module.exports = TeacherModel;
