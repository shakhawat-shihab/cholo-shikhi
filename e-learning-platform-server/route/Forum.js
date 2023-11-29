const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
  checkStudentIdWithParamsId,
} = require("../middleware/auth");
const ForumController = require("../controller/ForumController");
const routes = express();

routes.post("/post-question", isAuthenticated, ForumController.postQuestion);

routes.patch(
  "/answer-question/:questionId",
  isAuthenticated,
  ForumController.asnwerQuestion
);

routes.get(
  "/load-forum-by-course/:courseId",
  isAuthenticated,
  ForumController.loadForum
);

module.exports = routes;
