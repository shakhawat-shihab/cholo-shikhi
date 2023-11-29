const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
  checkStudentIdWithParamsId,
} = require("../middleware/auth");
const CartController = require("../controller/CartController");
const routes = express();

routes.get(
  "/my-cart/:studentId",
  isAuthenticated,
  isStudent,
  checkStudentIdWithParamsId,
  CartController.getCart
);

routes.patch(
  "/add-course",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  CartController.addToCart
);

routes.patch(
  "/remove-course",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  // cartValidator.addRemoveInCart,
  CartController.removeFromCart
);

// checkout
routes.post(
  "/checkout",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  CartController.checkoutCart
);

module.exports = routes;
