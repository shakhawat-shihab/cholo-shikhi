const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
} = require("../middleware/auth");
const { assignmentValidator } = require("../middleware/assignmentValidator");
const AssignmentAssessmentController = require("../controller/AssignmentAssessmentController");
const { uploadFile } = require("../config/multerConfig");
const {
  assignmentAssessmentValidator,
} = require("../middleware/assignmentAssessmentValidator");
const routes = express();

routes.post(
  "/create",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  AssignmentAssessmentController.createAssignmentAssessment
);

routes.post(
  "/submit",
  isAuthenticated,
  isStudent,
  uploadFile.single("document"),
  checkStudentIdWithBodyId,
  assignmentAssessmentValidator.submitAssignment,
  AssignmentAssessmentController.submitAssignment
);

routes.post(
  "/get-all",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  AssignmentAssessmentController.getPendingAssignment
);

routes.post(
  "/get-my-assessment",
  isAuthenticated,
  isStudent,
  AssignmentAssessmentController.getMyAssessment
);

routes.patch(
  "/assign-marks",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  AssignmentAssessmentController.assignMarksToAssignment
);

module.exports = routes;
