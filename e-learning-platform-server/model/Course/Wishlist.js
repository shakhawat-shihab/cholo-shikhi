const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    studentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courses: {
      type: [
        {
          courseRef: {
            type: mongoose.Types.ObjectId,
            ref: "Course",
            required: true,
          },
          _id: false,
        },
      ],
    },
  },
  { timestamps: true }
);

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);
module.exports = WishlistModel;
