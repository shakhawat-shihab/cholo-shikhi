const { insertInLog } = require("../util/logFile");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");
const { default: mongoose } = require("mongoose");
const AuthModel = require("../model/User/Auth");
const UserModel = require("../model/User/User");

class UserController {
  async getAll(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to load the users",
          validation
        );
      }

      let { page = 1, limit = 30, search = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      let filter = {};
      if (search) {
        filter = { email: { $regex: search, $options: "i" } };
      }

      const result = await AuthModel.find(filter)
        .select(
          "-createdAt -updatedAt -__v -password -confirmEmailToken -confirmEmailExpire -resetPassword -resetPasswordExpire -resetPasswordToken"
        )
        // .populate("user", "-password")
        .populate("userRef", "-createdAt -updatedAt -__v")
        .skip((page - 1) * limit)
        .limit(limit ? limit : 100);
      const userCount = await AuthModel.find(filter).count();

      if (result?.length) {
        return sendResponse(res, HTTP_STATUS.OK, "Successfully loaded users", {
          total: userCount,
          count: result.length,
          page: parseInt(page),
          limit: parseInt(limit),
          user: result,
        });
      }
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, "No User Found");
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async getUserById(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const { userId } = req.params;

      let pipeline = [
        {
          $match: {
            userRef: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userRef",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "userDetails.studentRef",
            foreignField: "_id",
            as: "studentDetails",
          },
        },
        {
          $unwind: {
            path: "$studentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "teachers",
            localField: "userDetails.teacherRef",
            foreignField: "_id",
            as: "teacherDetails",
          },
        },
        {
          $unwind: {
            path: "$teacherDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            email: 1,
            role: 1,
            isDisabled: 1,
            "userDetails.email": 1,
            "userDetails.userName": 1,
            "userDetails.firstName": 1,
            "userDetails.lastName": 1,
            "userDetails.phone": 1,
            "userDetails.image": 1,
            "userDetails.address": 1,
            "userDetails.teacherRef": 1,
            teacherDetails: 1,
            "userDetails.studentRef": 1,
            studentDetails: 1,
          },
        },
      ];

      let user = await AuthModel.aggregate(pipeline);
      // console.log("user ", user);

      if (user?.length) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully loaded user",
          user[0]
        );
      }
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Not Found");
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async updateMyInfo(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update the user",
          validation
        );
      }
      //   console.log(req.body);
      const { firstName, lastName, address, phone, image } = req.body;
      const { userId } = req.params;

      const userFind = await UserModel.findOne({ _id: userId });
      if (!userFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User Not Found");
      }

      const userUpdate = await UserModel.updateOne(
        { _id: userId },
        { $set: { firstName, lastName, phone, address, image } }
      );

      if (userUpdate?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully updated user data"
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Something went wrong"
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async updateByAdmin(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update the user",
          validation
        );
      }

      const { role, userName, isDisabled } = req.body;
      const { userId } = req.params;

      const userFind = await UserModel.findOne({ _id: userId });
      if (!userFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User Not Found");
      }

      const authFind = await AuthModel.findOne({ userRef: userId });
      if (!authFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User Not Found");
      }

      const userUpdate = await UserModel.updateOne(
        { _id: userId },
        { $set: { userName } }
      );

      const authUpdate = await AuthModel.updateOne(
        { userRef: userId },
        { $set: { isTeacher, isAdmin, isDisabled } }
      );

      if (userUpdate?.modifiedCount || authUpdate?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully updated user data"
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Something went wrong"
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async delete(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to delete the user",
          validation
        );
      }

      const { userId } = req.params;

      const user = await UserModel.findOne({ _id: userId });
      const auth = await AuthModel.findOne({ userRef: userId });

      if (!user || !auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "No User Found");
      }

      const userDelete = await UserModel.deleteOne({ _id: userId });
      const authDelete = await AuthModel.deleteOne({ user: userId });

      if (userDelete?.deletedCount && authDelete?.deletedCount) {
        return sendResponse(res, HTTP_STATUS.OK, "Successfully deleted");
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Something went wrong"
      );
    } catch (error) {
      //   console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
}

module.exports = new UserController();
