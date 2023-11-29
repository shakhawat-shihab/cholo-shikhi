const express = require("express");
const {
  isAuthenticated,
  isAdmin,
  checkUserIdWithParamsId,
  isTeacher,
  checkTeacherIdWithBodyId,
  checkTeacherIdWithParamsId,
  checkStudentIdWithBodyId,
} = require("../middleware/auth");
const CourseController = require("../controller/CourseController");
const { courseValidator } = require("../middleware/courseValidator");
const { uploadFile, uploadImage } = require("../config/multerConfig");
const routes = express();

routes.get("/all", courseValidator.checkParams, CourseController.getAll);

routes.get(
  "/get-student-course/:studentId",
  isAuthenticated,
  checkTeacherIdWithParamsId,
  CourseController.getStudentCourses
);

routes.post(
  "/check-course-progress",

  CourseController.checkProgress
);

routes.get(
  "/get-requested-courses",
  isAuthenticated,
  isAdmin,
  CourseController.getRequestedCourses
);

routes.post(
  "/request-to-publish/:courseId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithBodyId,
  CourseController.requestPublish
);

routes.patch(
  "/publish-course/:courseId",
  isAuthenticated,
  isAdmin,
  CourseController.publishCourse
);

routes.patch(
  "/reject-course/:courseId",
  isAuthenticated,
  isAdmin,
  CourseController.rejectCourse
);

routes.get(
  "/get-by-id/:courseId",
  // courseValidator.,
  CourseController.getById
);

routes.get(
  "/get-teacher-course/:teacherId",
  isAuthenticated,
  isTeacher,
  checkTeacherIdWithParamsId,
  CourseController.getTeacherCourse
);

routes.post(
  "/create",
  isAuthenticated,
  isTeacher,
  uploadImage.single("thumbnail"),
  checkTeacherIdWithBodyId,
  courseValidator.createCourse,
  CourseController.createCourse
);

routes.patch(
  "/update/:courseId",
  isAuthenticated,
  isTeacher,
  uploadImage.single("thumbnail"),
  checkTeacherIdWithBodyId,
  // courseValidator.updateCourse,
  CourseController.updateCourse
);

module.exports = routes;
