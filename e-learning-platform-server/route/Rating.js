const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
  isAdmin,
} = require("../middleware/auth");
const RatingController = require("../controller/RatingController");
const routes = express();

// give rating
routes.post(
  "/upsert",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  RatingController.createRating
);

routes.post(
  "/delete",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  RatingController.deleteRating
);

module.exports = routes;
