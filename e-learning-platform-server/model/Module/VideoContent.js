const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
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

const VideoModel = mongoose.model("VideoContent", videoSchema);
module.exports = VideoModel;
