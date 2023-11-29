const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
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
          // price: Number,
          _id: false,
        },
      ],
    },
    // total: { type: Number, required: true },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);
module.exports = CartModel;
