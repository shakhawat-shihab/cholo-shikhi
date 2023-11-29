const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
  isAdmin,
  passAuthorization,
} = require("../middleware/auth");
const ReviewController = require("../controller/ReviewController");
const routes = express();

routes.get("/get-all/:courseId", ReviewController.getAllReviewOfCourse);
routes.get("/get-by-id/:reviewId", ReviewController.getReviewById);
// by courseRef and studentRef
routes.post("/get-review", ReviewController.getReview);

// give review
routes.post(
  "/upsert",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  ReviewController.createReview
);

// routes.patch(
//   "/update/:reviewId",
//   isAuthenticated,
//   isStudent,
//   checkStudentIdWithBodyId,
//   ReviewController.updateReview
// );

routes.post(
  "/delete",
  isAuthenticated,
  isStudent,
  passAuthorization,
  ReviewController.deleteReview
);

module.exports = routes;
