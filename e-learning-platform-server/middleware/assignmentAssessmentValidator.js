const { body, query, param, check } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const path = require("path");
const { docType, videoType } = require("../constants/fileTypes");

const assignmentAssessmentValidator = {
  submitAssignment: [
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
  assignmentAssessmentValidator,
};
