const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const CategoryController = require("../controller/CategoryController");
const routes = express();

routes.post(
  "/insert",
  isAuthenticated,
  isAdmin,
  CategoryController.createCourse
);

routes.get(
  "/all",

  CategoryController.getCourse
);

module.exports = routes;
