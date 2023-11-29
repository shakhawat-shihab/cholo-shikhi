const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
} = require("../middleware/auth");

const QuizController = require("../controller/QuizController");

const routes = express();

routes.post(
  "/create",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  QuizController.createQuiz
);

routes.post(
  "/get-by-id-teacher/:quizId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  QuizController.getQuizByIdTeacher
);

routes.post(
  "/complete-quiz",
  isAuthenticated,
  isStudent,
  QuizController.completeQuiz
);

routes.post(
  "/get-by-course-teacher/:courseId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  QuizController.getQuizByCourseIdTeacher
);

routes.patch(
  "/update-by-teacher/:quizId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  QuizController.updateQuizByIdTeacher
);

routes.patch(
  "/sort",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  QuizController.sortQuiz
);

module.exports = routes;
