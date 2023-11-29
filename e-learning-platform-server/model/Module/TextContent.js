const mongoose = require("mongoose");

const textSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    isPremium: {
      type: Boolean,
      default: true,
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    moduleRef: {
      type: mongoose.Types.ObjectId,
      ref: "Module",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const TextModel = mongoose.model("TextContent", textSchema);
module.exports = TextModel;
