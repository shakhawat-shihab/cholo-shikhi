const express = require("express");
const {
  isAuthenticated,
  isAdmin,
  checkUserIdWithParamsId,
} = require("../middleware/auth");
const TeacherController = require("../controller/TeacherController");
const { generalValidator } = require("../middleware/generalValidation");
const { uploadFile } = require("../config/multerConfig");
const { teacherValidation } = require("../middleware/teacherValidation");
const routes = express();

//apply for teacher
routes.post(
  "/teacher-apply/:userId",
  isAuthenticated,
  checkUserIdWithParamsId,
  uploadFile.single("resume"),
  teacherValidation.applyTeacher,
  TeacherController.applyTeacher
);

// show all teacher request
routes.get(
  "/teacher-request",
  isAuthenticated,
  isAdmin,
  generalValidator.queryValidation,
  TeacherController.getTeacherRequest
);

// routes.get("/get-by-id/:teacherId", UserController.getTeacherById);

// approve teacher request
routes.patch(
  "/approve-teacher-request/:userId",
  isAuthenticated,
  isAdmin,
  generalValidator.paramValidation,
  TeacherController.approveTeacherRequest
);

// deny teacher request
routes.patch(
  "/deny-teacher-request/:userId",
  isAuthenticated,
  isAdmin,
  generalValidator.paramValidation,
  TeacherController.denyTeacherRequest
);

module.exports = routes;
