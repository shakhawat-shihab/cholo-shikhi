const express = require("express");
const {
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  isStudent,
  checkStudentIdWithBodyId,
} = require("../middleware/auth");
const ModuleController = require("../controller/ModuleController");

const routes = express();

routes.post(
  "/create",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  ModuleController.createModule
);

// get all modules by teacher for a course
routes.post(
  "/modules-by-course-id-teacher/:courseId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  ModuleController.getAllModulesByTeacher
);

routes.post(
  "/modules-by-course-id-student/:courseId",
  isAuthenticated,
  isStudent,
  checkTeacherIdWithBodyId,
  ModuleController.getModulesByStudent
);

// get modules by student
routes.post(
  "/complete-module",
  isAuthenticated,
  isStudent,
  checkStudentIdWithBodyId,
  ModuleController.completeModule
);

routes.get(
  "/modules-by-course-id-general/:courseId",
  ModuleController.getModulesByGeneralUser
);

routes.patch(
  "/sort",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  ModuleController.sortModule
);

module.exports = routes;
