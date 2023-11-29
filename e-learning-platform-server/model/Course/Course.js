const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "every course must have a title"],
    },
    description: {
      type: String,
    },
    language: {
      type: String,
    },
    learningScope: {
      type: String,
    },
    learningOutcome: {
      type: String,
    },
    rating: {
      type: Number,
    },
    categoryRef: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
    },
    teacherRef: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    modulesRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Module",
    },
    // quizzesRef: {
    //   type: [mongoose.Types.ObjectId],
    //   ref: "Quiz",
    // },
    // assignmentsRef: {
    //   type: [mongoose.Types.ObjectId],
    //   ref: "Assignment",
    // },
    studentsRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Student",
    },
    reviewsRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Review",
    },
    ratingsRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Rating",
    },
    thumbnail: {
      type: String,
    },
    courseStatus: {
      type: String,
      enum: ["published", "requested", "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", courseSchema);
module.exports = CourseModel;
