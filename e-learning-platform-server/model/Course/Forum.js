const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    question: {
      type: String,
    },
    userRef: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: {
      type: [
        {
          type: {
            answerUserRef: {
              type: mongoose.Types.ObjectId,
              ref: "User",
            },
            answer: String,
            time: Date,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const ForumModel = mongoose.model("Forum", forumSchema);
module.exports = ForumModel;
