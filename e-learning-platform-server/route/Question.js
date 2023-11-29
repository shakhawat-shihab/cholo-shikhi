const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
} = require("../middleware/auth");

const QuestionController = require("../controller/QuestionController");

const routes = express();

routes.post(
  "/create",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  QuestionController.createQuestion
);

routes.post(
  "/get-by-teacher/:questionId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  QuestionController.getQuestionByIdTeacher
);

routes.patch(
  "/update-by-teacher/:questionId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  QuestionController.updateQuestionByIdTeacher
);

module.exports = routes;
