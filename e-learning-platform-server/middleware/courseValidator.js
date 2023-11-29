const { body, query, param, check } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const { imgType } = require("../constants/fileTypes");
const path = require("path");

const courseValidator = {
  createCourse: [
    body("title")
      .exists()
      .withMessage("Course must have title")
      .bail()
      .isString()
      .withMessage("Course title must be a string")
      .bail(),
    body("description")
      .optional()
      .isString()
      .withMessage("Course description must be a string")
      .bail(),
    body("language")
      .optional()
      .isString()
      .withMessage("Language must be a string")
      .bail(),
    // body("learningScope")
    //   .optional()
    //   .custom((value) => {
    //     if (!Array.isArray(JSON.parse(value))) {
    //       throw new Error("learningScope must be array type");
    //     }
    //     if (JSON?.parse(value)?.some((item) => typeof item !== "string")) {
    //       throw new Error("Each item in the array must be a string.");
    //     }
    //     return true;
    //   }),
    // body("learningOutcome")
    //   .optional()
    //   .custom((value) => {
    //     if (!Array.isArray(JSON.parse(value))) {
    //       throw new Error("learningOutcome must be array type");
    //     }
    //     if (JSON?.parse(value)?.some((item) => typeof item !== "string")) {
    //       throw new Error("Each item in the array must be a string.");
    //     }
    //     return true;
    //   }),
    body("teacherRef")
      .exists()
      .withMessage("Teacher Id must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
    check("thumbnail").custom((value, { req }) => {
      // console.log("req.file ", req.file);
      // console.log("req.body ", req.body);
      // console.log("req.body.type ", req.body.type);
      if (!req.file) return true;
      let extension = path.extname(req?.file?.originalname).toLowerCase();
      console.log("extension ", extension);
      if (!imgType.includes(extension)) {
        throw new Error(`only accept ${imgType.toString()} file`);
      }
      return true;
    }),
  ],
  updateCourse: [
    body("title")
      .exists()
      .withMessage("Course must have title")
      .bail()
      .isString()
      .withMessage("Course title must be a string")
      .bail(),
    body("description")
      .optional()
      .isString()
      .withMessage("Course description must be a string")
      .bail(),
    body("language")
      .optional()
      .isString()
      .withMessage("Language must be a string")
      .bail(),
    body("learningScope")
      .optional()
      .custom((value) => {
        if (!Array.isArray(value)) {
          throw new Error("learningScope must be array type");
        }
        if (value.some((item) => typeof item !== "string")) {
          throw new Error("Each item in the array must be a string.");
        }
        return true;
      }),
    body("learningOutcome")
      .optional()
      .custom((value) => {
        if (!Array.isArray(value)) {
          throw new Error("learningOutcome must be array type");
        }
        if (value.some((item) => typeof item !== "string")) {
          throw new Error("Each item in the array must be a string.");
        }
        return true;
      }),
    body("teacherRef")
      .exists()
      .withMessage("Teacher Id must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
  ],
  checkParams: [
    query("category")
      // .optional()
      .custom((value) => {
        // console.log("value ", value);
        if (!value) {
          return true;
        }
        const objectIdPattern = /^[a-f\d]{24}$/i;
        if (!Array.isArray(value)) {
          if (!objectIdPattern.test(value)) {
            throw new Error("Category is not valid objectId");
          }
        } else if (value.some((item) => !objectIdPattern.test(item))) {
          throw new Error("Each item in the category must be objectId.");
        }
        return true;
      }),
    query("sortOrder")
      // .optional()
      .custom((value) => {
        if (!value) {
          return true;
        }
        if (typeof value != "string") {
          throw new Error("sortOrder is invalid");
        }
        if (value != "asc" && value != "desc") {
          throw new Error("invalid order property");
        }
        return true;
      }),
    query("sortParam")
      // .optional()
      .custom((value) => {
        if (!value) {
          return true;
        }
        if (typeof value != "string") {
          throw new Error("sortParam is invalid");
        }
        // if (value != "price" && value != "title" && value != "author") {
        //   throw new Error("invalid sort parameter property");
        // }
        return true;
      }),
  ],
};

module.exports = {
  courseValidator,
};
