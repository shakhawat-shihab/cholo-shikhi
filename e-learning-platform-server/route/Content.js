const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
  isAdmin,
} = require("../middleware/auth");
const ContentController = require("../controller/ContentController");
const { uploadFile } = require("../config/multerConfig");
const { contentValidator } = require("../middleware/contentValidator");

const routes = express();

routes.post(
  "/create",
  isAuthenticated,
  isTeacher,
  uploadFile.single("content"),
  checkTeacherIdWithBodyId,
  // contentValidator.create,
  ContentController.createContent
);

routes.post(
  "/get-by-teacher/:contentId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  ContentController.getContentByTeacher
);

routes.post(
  "/get-by-student/:contentId",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  ContentController.getContentByStudent
);

routes.post(
  "/get-by-admin/:contentId",
  isAuthenticated,
  isAdmin,
  ContentController.getContentByAdmin
);

routes.post(
  "/complete-content/:contentId",
  isAuthenticated,
  isStudent,
  ContentController.completeContent
);

routes.get("/get-by-general/:contentId", ContentController.getContentGeneral);

routes.patch(
  "/sort",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  ContentController.sortContent
);

module.exports = routes;
