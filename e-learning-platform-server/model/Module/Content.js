const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "every module must have a title"],
    },
    description: {
      type: String,
    },
    // document
    documentContentRef: {
      type: mongoose.Types.ObjectId,
      ref: "DocumentContent",
    },
    //text
    textContentRef: {
      type: mongoose.Types.ObjectId,
      ref: "TextContent",
    },
    //video
    videoContentRef: {
      type: mongoose.Types.ObjectId,
      ref: "VideoContent",
    },
    type: {
      type: String,
      enum: ["video", "text", "document", "recordedVideo"],
      required: true,
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
    contentPos: Number,
  },
  { timestamps: true }
);

const ContentModel = mongoose.model("Content", contentSchema);
module.exports = ContentModel;
