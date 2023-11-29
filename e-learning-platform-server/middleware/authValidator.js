const { body, query, param, check } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const { docType } = require("../constants/fileTypes");
const path = require("path");

const authValidator = {
  signup: [
    body("userName")
      .exists()
      .withMessage("userName must be provided")
      .bail()
      .isString()
      .withMessage("user name must be a string")
      .bail()
      .matches(/^[a-zA-Z]*$/)
      .withMessage("user name must be in only alphabets")
      .isLength({ min: 3, max: 15 })
      .withMessage("user name must be between 3 and 15 characters")
      .bail(),
    body("email")
      .exists()
      .withMessage("Email must be provided")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email must be in valid format"),
    body("password")
      .exists()
      .withMessage("Password must be provided")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Password must contain at least 8 characters with 1 lower case, 1 upper case, 1 number, 1 symbol"
      ),
    body("confirmPassword")
      .exists()
      .withMessage("Confirm Password must be provided")
      .bail()
      .isString()
      .withMessage("Confirm Password must be a string")
      .bail()
      .custom((value, { req }) => {
        if (value === req.body.password) {
          return true;
        }
        throw new Error("Passwords do not match");
      }),
    body("role")
      .exists()
      .withMessage("Role must be provided")
      .matches(/\b(?:teacher|student)\b/)
      .withMessage("Role can be teacher or student"),

    // body("phone")
    //   .exists()
    //   .withMessage("Phone number must be provided")
    //   .bail()
    //   .isString()
    //   .withMessage("Phone number must be a string")
    //   .bail()
    //   .matches(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)
    //   .withMessage("Phone number must be in a valid format"),
    // body("address.area")
    //   .exists()
    //   .withMessage("Area was not provided")
    //   .bail()
    //   .isString()
    //   .withMessage("Area must be a string"),
    // body("address.city")
    //   .exists()
    //   .withMessage("City was not provided")
    //   .bail()
    //   .isString()
    //   .withMessage("City must be a string"),
    // body("address.country")
    //   .exists()
    //   .withMessage("Country was not provided")
    //   .bail()
    //   .isString()
    //   .withMessage("Country must be a string"),
  ],

  login: [
    body("email")
      .exists()
      .withMessage("Email must be provided")
      .bail()
      .isEmail()
      .withMessage("Email must be in valid format"),
    body("password").exists().withMessage("Password must be provided").bail(),
  ],
  emailCheck: [
    body("email")
      .exists()
      .withMessage("Email must be provided")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email must be in valid format"),
  ],
  resetPassword: [
    body("password")
      .exists()
      .withMessage("Password must be provided")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Password must contain at least 8 characters with 1 lower case, 1 upper case, 1 number, 1 symbol"
      ),
    body("confirmPassword")
      .exists()
      .withMessage("Password must be provided")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .custom((value, { req }) => {
        if (value === req.body.password) {
          return true;
        }
        throw new Error("Passwords do not match");
      }),
  ],
  jwtValidator: [
    param("token")
      .exists()
      .withMessage("Token must be provided")
      .bail()
      // .matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+\/=]*$/)
      // .withMessage("Token is not in valid JWT token format"),
      .custom((value, { req }) => {
        const jwtToken = value;
        const jwtRegex =
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+\/=]*$/;
        if (jwtRegex.test(jwtToken)) {
          // console.log("ok");
          return true;
        }
        // console.log("not ok");
        throw new Error("token format is invalid");
      }),
  ],
};

module.exports = {
  authValidator,
};
