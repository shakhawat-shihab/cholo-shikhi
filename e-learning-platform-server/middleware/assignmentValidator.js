const { body, query, param, check } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const path = require("path");
const { docType, videoType } = require("../constants/fileTypes");

const assignmentValidator = {
  create: [
    body("title").exists().isString().withMessage("title must be a string"),
    body("description")
      .optional()
      .isString()
      .withMessage("description must be a string"),
    body("courseRef")
      .exists()
      .withMessage("Course Id must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
    body("teacherRef")
      .exists()
      .withMessage("Teacher Id must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
    body("moduleRef")
      .exists()
      .withMessage("Module Id must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
    body("total").exists().withMessage("total must be provided"),

    body("passMarkPercentage")
      .exists()
      .withMessage("passMarkPercentage must be provided")
      .bail(),

    check("document")
      // .exists()
      // .withMessage("resume must provided")
      // .bail()
      .custom((value, { req }) => {
        // console.log("req.file ", req.file);
        // console.log("req.body ", req.body);
        // console.log("req.body.type ", req.body.type);

        if (!req.file) return true;
        let extension = path.extname(req?.file?.originalname).toLowerCase();
        console.log("extension ", extension);
        if (!docType.includes(extension)) {
          throw new Error(`only accept ${docType.toString()} file`);
        }

        return true;
      }),
  ],
  update: [
    body("title").exists().isString().withMessage("title must be a string"),
    body("description")
      .optional()
      .isString()
      .withMessage("description must be a string"),
    // body("courseRef")
    //   .exists()
    //   .withMessage("Course Id must be provided")
    //   .bail()
    //   .matches(/^[a-f\d]{24}$/i)
    //   .withMessage("ID is not in valid mongoDB format"),
    // body("teacherRef")
    //   .exists()
    //   .withMessage("Teacher Id must be provided")
    //   .bail()
    //   .matches(/^[a-f\d]{24}$/i)
    //   .withMessage("ID is not in valid mongoDB format"),
    // body("moduleRef")
    //   .exists()
    //   .withMessage("Module Id must be provided")
    //   .bail()
    //   .matches(/^[a-f\d]{24}$/i)
    //   .withMessage("ID is not in valid mongoDB format"),
    check("document")
      // .exists()
      // .withMessage("resume must provided")
      // .bail()
      .custom((value, { req }) => {
        // console.log("req.file ", req.file);
        // console.log("req.body ", req.body);
        // console.log("req.body.type ", req.body.type);

        if (!req.file) return true;
        let extension = path.extname(req?.file?.originalname).toLowerCase();
        console.log("extension ", extension);
        if (!docType.includes(extension)) {
          throw new Error(`only accept ${docType.toString()} file`);
        }

        return true;
      }),
  ],
};

module.exports = {
  assignmentValidator,
};
