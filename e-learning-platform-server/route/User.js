const express = require("express");
const {
  isAuthenticated,
  isAdmin,
  checkUserIdWithParamsId,
} = require("../middleware/auth");
const UserController = require("../controller/UserController");
const { userValidator } = require("../middleware/userValidatior");
const { generalValidator } = require("../middleware/generalValidation");
const routes = express();

routes.get(
  "/all",
  isAuthenticated,
  isAdmin,
  generalValidator.queryValidation,
  UserController.getAll
);

routes.get(
  "/get-by-id/:userId",
  checkUserIdWithParamsId,
  UserController.getUserById
);

routes.patch(
  "/update-my-info/:userId",
  isAuthenticated,
  checkUserIdWithParamsId,
  userValidator.updateMyInfo,
  UserController.updateMyInfo
);

routes.patch(
  "/update-by-admin/:userId",
  isAuthenticated,
  isAdmin,
  userValidator.updateByAdmin,
  UserController.updateByAdmin
);

routes.delete(
  "/delete/:id",
  isAuthenticated,
  isAdmin,
  userValidator.delete,
  UserController.delete
);

module.exports = routes;
