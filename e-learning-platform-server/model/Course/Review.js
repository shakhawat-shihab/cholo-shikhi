const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // rating: {
    //   type: Number,
    //   min: 1,
    //   max: 5,
    // },
    review: {
      type: String,
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    ratingRef: {
      type: mongoose.Types.ObjectId,
      ref: "Rating",
    },
    // likes: {
    //   type: [mongoose.Types.ObjectId],
    //   ref: "Student",
    // },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("Review", reviewSchema);
module.exports = ReviewModel;
