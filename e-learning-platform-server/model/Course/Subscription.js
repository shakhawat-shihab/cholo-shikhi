const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
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
          status: {
            type: String,
            enum: ["pending", "approve", "deny"],
            default: "pending",
          },
          message: {
            type: String,
          },
        },
      ],
    },
    isCheckedAdmin: {
      type: String,
      enum: ["unchecked", "checked"],
      default: "unchecked",
    },
  },
  { timestamps: true }
);

const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);
module.exports = SubscriptionModel;
