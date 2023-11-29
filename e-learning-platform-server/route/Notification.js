const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
  isAdmin,
  passAuthorization,
  checkUserIdWithParamsId,
} = require("../middleware/auth");
const NotificatoionController = require("../controller/NotificatoionController");

const routes = express();

routes.get(
  "/get-admin-notification",
  isAuthenticated,
  isAdmin,
  NotificatoionController.getNotificationAdmin
);

routes.get(
  "/get-notification/:userId",
  isAuthenticated,
  checkUserIdWithParamsId,
  NotificatoionController.getNotificationByUserId
);

routes.patch(
  "/read-admin-notification",
  isAuthenticated,
  isAdmin,
  NotificatoionController.readAdminNotification
);

routes.patch(
  "/read-user-notification/:userId",
  isAuthenticated,
  checkUserIdWithParamsId,
  NotificatoionController.readUserNotification
);

// routes.get(
//   "/get-my-notification/:userId",
//   isAuthenticated,
//   ReviewController.getReviewById
// );

module.exports = routes;
