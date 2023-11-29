const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
  isAdmin,
} = require("../middleware/auth");
const ModuleController = require("../controller/ModuleController");
const SubscriptionController = require("../controller/SubscriptionController");

const routes = express();

// view subscription requests
routes.get(
  "/all",
  isAuthenticated,
  isAdmin,
  SubscriptionController.getSubscriptionRequest
);

// subscribe single course
routes.post(
  "/single-course",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  SubscriptionController.singleCourseSubscribe
);

// approve course subscription
routes.patch(
  "/approve-course-access",
  isAuthenticated,
  isAdmin,
  SubscriptionController.approveCourseSubscription
);

// approve course subscription
routes.patch(
  "/deny-course-access",
  isAuthenticated,
  isAdmin,
  SubscriptionController.denyCourseSubscription
);

// check request
routes.patch(
  "/remove-subscription-request",
  isAuthenticated,
  isAdmin,
  SubscriptionController.removeSubscriptionRequest
);

module.exports = routes;
