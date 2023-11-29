const { body, query, param, check } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const path = require("path");
const { docType, videoType } = require("../constants/fileTypes");

const contentValidator = {
  create: [
    body("title").exists().isString().withMessage("title must be a string"),
    body("description")
      .optional()
      .isString()
      .withMessage("description must be a string"),
    body("type")
      .exists()
      .isString()
      .withMessage("Type must be a string")
      .bail()
      .matches(/(video|document|text)/)
      .withMessage("Type can be text, document or video"),
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
    body("text").optional().isString().withMessage("Type must be a string"),
    check("content")
      // .exists()
      // .withMessage("resume must provided")
      // .bail()
      .custom((value, { req }) => {
        // console.log("req.file ", req.file);
        // console.log("req.body ", req.body);
        // console.log("req.body.type ", req.body.type);

        if (req?.body?.type == "text") {
          return true;
        }
        console.log("req.file ----  ==> ", req.file);
        if (!req.file) throw new Error("Must provide your content");
        let extension = path.extname(req?.file?.originalname).toLowerCase();
        console.log("extension ", extension);
        if (req?.body?.type == "document" && !docType.includes(extension)) {
          throw new Error(`only accept ${docType.toString()} file`);
        }
        if (req?.body?.type == "video" && !videoType.includes(extension)) {
          throw new Error(`only accept ${videoType.toString()} file`);
        }
        // console.log("true");
        return true;
      }),
  ],
};

module.exports = {
  contentValidator,
};
