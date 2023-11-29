const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const { sendResponse } = require("../util/common");
const { insertInLog } = require("../util/logFile");
const mongoose = require("mongoose");
const CategoryModel = require("../model/Course/Category");
const { ObjectId } = mongoose.Types;

class CategoryController {
  async createCourse(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create category",
          validation
        );
      }
      const { title } = req.body;
      // console.log(req.body);

      let categoryResult = await CategoryModel.create({
        title: title,
      });

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Category created successfully",
        categoryResult
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Something went wrong!"
      );
    }
  }

  async getCourse(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to load category",
          validation
        );
      }

      let categoryResult = await CategoryModel.find();

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "successfully loaded categories",
        categoryResult
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Something went wrong!"
      );
    }
  }
}

module.exports = new CategoryController();
