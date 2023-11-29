const mongoose = require("mongoose");
const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["teacherRequest", "courseRequest", "enrollmentRequest"],
    },
    userRef: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    teacherRef: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
    },
    studentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    subscriptionRef: {
      type: mongoose.Types.ObjectId,
      ref: "Subscription",
    },
    content: {
      type: String,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

const AdminNotificationModel = mongoose.model(
  "AdminNotification",
  adminNotificationSchema
);
module.exports = AdminNotificationModel;
