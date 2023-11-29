const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: {
      type: [
        {
          course: {
            type: mongoose.Types.ObjectId,
            ref: "Course",
            required: true,
          },
          // price: Number,
          _id: false,
        },
      ],
    },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      default: "online",
    },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model("Transaction", transactionSchema);
module.exports = TransactionModel;
