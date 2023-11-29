const { body, query, param } = require("express-validator");

const generalValidator = {
  queryValidation: [
    query("page")
      .optional()
      .isNumeric()
      .withMessage("page must be a number")
      .bail()
      .isFloat({ min: 1 })
      .withMessage("Page can't be less than 1"),
    query("limit")
      .optional()
      .isNumeric()
      .withMessage("limit must be a number")
      .bail()
      .isFloat({ min: 1 })
      .withMessage("limit can't be less than 1"),
  ],

  paramValidation: [
    param("userId")
      .optional()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
  ],
};

module.exports = {
  generalValidator,
};
