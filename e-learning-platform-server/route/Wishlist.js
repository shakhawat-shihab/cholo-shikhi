const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
  checkStudentIdWithParamsId,
} = require("../middleware/auth");
const WishlistController = require("../controller/WishlistController");

const routes = express();

routes.get(
  "/my-wishlist/:studentId",
  isAuthenticated,
  isStudent,
  checkStudentIdWithParamsId,
  WishlistController.getWishlist
);

routes.patch(
  "/add-course",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  WishlistController.addToWishlist
);

routes.patch(
  "/remove-course",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  // cartValidator.addRemoveInCart,
  WishlistController.removeFromWishlist
);

// // korte hobe
// routes.get(
//   "/move-to-cart/:studentId",
//   isAuthenticated,
//   isStudent,
//   checkStudentIdWithParamsId,
//   WishlistController.
// );

module.exports = routes;
