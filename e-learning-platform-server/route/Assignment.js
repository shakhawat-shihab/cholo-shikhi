const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
} = require("../middleware/auth");
const AssignmentController = require("../controller/AssignmentController");
const { assignmentValidator } = require("../middleware/assignmentValidator");
const { uploadFile } = require("../config/multerConfig");
const routes = express();

routes.post(
  "/create",
  isAuthenticated,
  isTeacher,
  uploadFile.single("document"),
  checkTeacherIdWithBodyId,
  assignmentValidator.create,
  AssignmentController.createAssignment
);

routes.post(
  "/get-by-teacher/:assignmentId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  AssignmentController.getAssignmentByIdTeacher
);

routes.get(
  "/get-all-by-course-id/:courseId",
  isAuthenticated,
  AssignmentController.getAssignmentByCourseId
);

routes.patch(
  "/update-by-teacher/:assignmentId",
  isAuthenticated,
  isTeacher,
  uploadFile.single("document"),
  checkTeacherIdWithBodyId,
  assignmentValidator.update,
  AssignmentController.updateAssignmentByIdTeacher
);

routes.get(
  "/get-by-id/:assignmentId",
  isAuthenticated,
  AssignmentController.getAssignmentById
);

routes.post(
  "/complete-assignment",
  isAuthenticated,
  isStudent,
  AssignmentController.completeAssignment
);

routes.patch(
  "/sort",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  AssignmentController.sortAssignment
);

module.exports = routes;
