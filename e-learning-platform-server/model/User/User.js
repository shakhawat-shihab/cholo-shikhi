const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxLength: 25,
    },
    lastName: {
      type: String,
      maxLength: 25,
    },
    userName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
      unique: true,
    },
    email: {
      type: String,
      maxLength: 100,
      unique: true,
      required: [true, "Email should be provided"],
    },
    phone: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    address: {
      house: String,
      road: String,
      area: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },

    teacherRef: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
    },

    studentRef: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    notificationRef: {
      type: mongoose.Types.ObjectId,
      ref: "Notification",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
