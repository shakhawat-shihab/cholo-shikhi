const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
} = require("../middleware/auth");

const QuizAssessmentController = require("../controller/QuizAssessmentController");

const routes = express();

routes.post(
  "/create",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  QuizAssessmentController.createQuizAssessment
);

routes.post(
  "/get-my-assessment",
  isAuthenticated,
  isStudent,
  QuizAssessmentController.getMyAssessment
);

routes.post(
  "/change-question",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  QuizAssessmentController.changeQuestion
);

routes.post(
  "/question-answer",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  QuizAssessmentController.questionAnswer
);

routes.post(
  "/my-answer",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  QuizAssessmentController.getMyAnswer
);

routes.post(
  "/submit",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  QuizAssessmentController.submitQuiz
);

module.exports = routes;
