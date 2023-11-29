const { body, query, param } = require("express-validator");
const { isValidObjectId } = require("mongoose");

const userValidator = {
  updateMyInfo: [
    body("firstName")
      .optional()
      .isString()
      .withMessage("first name must be a string")
      .isLength({ max: 25 })
      .withMessage("first name cannot be more than 25 characters"),
    body("lastName")
      .optional()
      .isString()
      .withMessage("last name must be a string")
      .isLength({ max: 25 })
      .withMessage("last name cannot be more than 25 characters"),
    body("phone")
      .optional()
      .isString()
      .withMessage("Phone number must be a string")
      .bail()
      .matches(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)
      .withMessage("Phone number must be in a valid format"),
    body("address")
      .optional()
      .isObject()
      .withMessage("Address should be object"),
    param("userId")
      .exists()
      .withMessage("user Id must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
  ],
  updateByAdmin: [
    body("userName")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 3, max: 12 })
      .withMessage(
        "Name cannot be less than 3 characters and more than 12 characters"
      ),
    body("isTeacher")
      .optional()
      .isBoolean()
      .withMessage("isTeacher must be boolean"),
    body("isAdmin")
      .optional()
      .isBoolean()
      .withMessage("isAdmin must be boolean"),
    body("isDisabled")
      .optional()
      .isBoolean()
      .withMessage("isDisabled must be boolean"),
    param("userId")
      .exists()
      .withMessage("user Id must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
  ],
  delete: [
    param("userId")
      .exists()
      .withMessage("user ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
  ],
};

module.exports = {
  userValidator,
};
