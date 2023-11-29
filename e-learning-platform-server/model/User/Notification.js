const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notifications: {
      type: [
        {
          content: {
            type: String,
            required: true,
          },
          isSeen: {
            type: Boolean,
            default: false,
          },
          link: {
            type: String,
          },
          time: {
            type: Date,
          },
          _id: false,
        },
      ],
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);
module.exports = NotificationModel;
