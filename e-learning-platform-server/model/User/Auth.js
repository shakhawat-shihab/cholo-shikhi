const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userRef: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "pending"],
      required: true,
      default: "pending",
    },
    isPendingTeacher: {
      type: Boolean,
    },

    // isStudent: {
    //   type: Boolean,
    //   default: true,
    // },
    // isTeacher: {
    //   type: Boolean,
    //   default: false,
    // },
    // isAdmin: {
    //   type: Boolean,
    //   default: false,
    // },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    confirmEmailToken: {
      type: String || null,
      required: false,
    },
    confirmEmailExpire: {
      type: Date || null,
      required: false,
    },
    resetPassword: {
      type: Boolean || null,
      required: false,
      default: false,
    },
    resetPasswordToken: {
      type: String || null,
      required: false,
    },
    resetPasswordExpire: {
      type: Date || null,
      required: false,
    },
  },
  { timestamps: true }
);

const AuthModel = mongoose.model("Auth", authSchema);
module.exports = AuthModel;
