const express = require("express");
const AuthController = require("../controller/AuthController");
const { authValidator } = require("../middleware/authValidator");
const { uploadFile } = require("../config/multerConfig");
const { isAuthenticated } = require("../middleware/auth");

const routes = express();

routes.post("/log-in", authValidator.login, AuthController.login);
routes.post("/sign-up", authValidator.signup, AuthController.signup);

// routes.post(
//   "/sign-up-teacher",
//   uploadFile.single("resume"),
//   authValidator.signupTeacher,
//   AuthController.signupTeacher
// );

routes.post("/verify-email", AuthController.verifyEmail);

routes.post("/forget-password", AuthController.forgetPassword);
routes.post("/check-token", AuthController.validatePasswordResetRequest);
routes.post(
  "/reset-password",
  authValidator.resetPassword,
  AuthController.resetPassword
);
routes.get(
  "/check-me/:token",
  authValidator.jwtValidator,
  AuthController.aboutMe
);

module.exports = routes;
