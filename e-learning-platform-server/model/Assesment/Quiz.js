const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isPublishByTeacher: {
      type: Boolean,
      default: false,
    },
    courseRef: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    moduleRef: {
      type: mongoose.Types.ObjectId,
      ref: "Module",
    },
    teacherRef: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
    },
    questionsRef: {
      type: [mongoose.Types.ObjectId],
      ref: "Question",
    },
    passMarkPercentage: {
      type: Number,
      required: true,
    },
    durationInMinute: {
      type: Number,
      required: true,
      default: 20,
    },
    quizPos: Number,
  },
  { timestamps: true }
);

const QuizModel = mongoose.model("Quiz", quizSchema);
module.exports = QuizModel;
