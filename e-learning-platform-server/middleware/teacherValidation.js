const { body, query, param, check } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const path = require("path");
const { docType } = require("../constants/fileTypes");

const teacherValidation = {
  applyTeacher: [
    body("firstName")
      .exists()
      .isString()
      .withMessage("first name must be a string")
      .isLength({ max: 25 })
      .withMessage("first name cannot be more than 25 characters"),
    body("lastName")
      .exists()
      .isString()
      .withMessage("last name must be a string")
      .isLength({ max: 25 })
      .withMessage("last name cannot be more than 25 characters"),
    body("phone")
      .exists()
      .isString()
      .withMessage("Phone number must be a string")
      .bail()
      .matches(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)
      .withMessage("Phone number must be in a valid format"),
    body("education")
      .exists()
      .isString()
      .withMessage("Provide your latest education degree"),
    body("facebookUrl")
      .optional()
      .isString()
      .withMessage("Provide your latest education degree"),
    body("twitterUrl")
      .optional()
      .isString()
      .withMessage("Provide your latest education degree"),
    body("linkedInUrl")
      .optional()
      .isString()
      .withMessage("Provide your latest education degree"),
    check("resume")
      // .exists()
      // .withMessage("resume must provided")
      // .bail()
      .custom((value, { req }) => {
        // console.log("req.file ", req?.file);
        if (!req.file) throw new Error("Must provide your resume");
        let extension = path.extname(req?.file?.originalname).toLowerCase();
        console.log("extension ", extension);
        if (!docType.includes(extension)) {
          throw new Error(`only accept ${docType.toString()} file`);
        }
        // console.log("true");
        return true;
      }),
  ],
};

module.exports = {
  teacherValidation,
};
