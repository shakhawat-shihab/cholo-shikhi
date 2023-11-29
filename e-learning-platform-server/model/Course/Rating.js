const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
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
  },
  { timestamps: true }
);

const RatingModel = mongoose.model("Rating", ratingSchema);
module.exports = RatingModel;
