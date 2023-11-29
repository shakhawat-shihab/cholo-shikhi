const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    fileUrl: {
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

const DocumentModel = mongoose.model("DocumentContent", documentSchema);
module.exports = DocumentModel;
