const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "every module must have a title"],
    },
    description: {
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

    contentsRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Content",
    },
    // {
    //   type: [
    //     {
    //       // textContent: {
    //       //   type: mongoose.Types.ObjectId,
    //       //   ref: "TextContent",
    //       // },
    //       // documentContent: {
    //       //   type: mongoose.Types.ObjectId,
    //       //   ref: "DocumentContent",
    //       // },
    //       // videoContent: {
    //       //   type: mongoose.Types.ObjectId,
    //       //   ref: "VideoContent",
    //       // },
    //       type: mongoose.Types.ObjectId,
    //       ref: "Content",
    //     },
    //   ],
    // },
    quizzesRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Quiz",
    },
    assignmentsRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Assignment",
    },
    modulePos: Number,
  },
  { timestamps: true }
);

const ModuleModel = mongoose.model("Module", moduleSchema);
module.exports = ModuleModel;
