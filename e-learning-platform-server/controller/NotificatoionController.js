const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const { sendResponse } = require("../util/common");
const { insertInLog } = require("../util/logFile");
const CourseModel = require("../model/Course/Course");
const mongoose = require("mongoose");
const { addAdminNotification } = require("../util/adminNotification");
const TeacherModel = require("../model/User/Teacher");
const ModuleModel = require("../model/Module/Module");
const StudentModel = require("../model/User/Student");
const SubscriptionModel = require("../model/Course/Subscription");
const ReviewModel = require("../model/Course/Review");
const AdminNotificationModel = require("../model/User/AdminNotification");
const NotificationModel = require("../model/User/Notification");
const { ObjectId } = mongoose.Types;

class NotificationController {
  async getNotificationAdmin(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get notification",
          validation
        );
      }

      let pipeline = [
        {
          $match: {
            isSeen: false,
          },
        },

        // load student
        {
          $lookup: {
            from: "students",
            localField: "studentRef",
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
        //load student user details
        {
          $lookup: {
            from: "users",
            localField: "studentDetails.userRef",
            foreignField: "_id",
            as: "studentInfo",
          },
        },
        {
          $unwind: {
            path: "$studentInfo",
            preserveNullAndEmptyArrays: true,
          },
        },

        //load teacher
        {
          $lookup: {
            from: "teachers",
            localField: "teacherRef",
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

        //load teacher user details
        {
          $lookup: {
            from: "users",
            localField: "teacherDetails.userRef",
            foreignField: "_id",
            as: "teacherInfo",
          },
        },
        {
          $unwind: {
            path: "$teacherInfo",
            preserveNullAndEmptyArrays: true,
          },
        },

        //load subscription
        {
          $lookup: {
            from: "subscriptions",
            localField: "subscriptionRef",
            foreignField: "_id",
            as: "subscriptionDetails",
          },
        },
        {
          $unwind: {
            path: "$subscriptionDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        //load course
        {
          $lookup: {
            from: "courses",
            localField: "courseRef",
            foreignField: "_id",
            as: "courseDetails",
          },
        },
        {
          $unwind: {
            path: "$courseDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: "$_id",
            createdAt: { $first: "$createdAt" },
            teacherInfo: { $first: "$teacherInfo" },
            studentInfo: { $first: "$studentInfo" },
            teacherDetails: { $first: "$teacherDetails" },
            courseDetails: { $first: "$courseDetails" },
            subscriptionDetails: { $first: "$subscriptionDetails" },
            subsStudent: { $first: "$subsStudent" },
            type: { $first: "$type" },
            isSeen: { $first: "$isSeen" },
          },
        },

        {
          $sort: {
            createdAt: 1,
          },
        },

        {
          $project: {
            _id: 1,
            createdAt: 1,
            type: 1,
            isSeen: 1,

            courseInfo: {
              title: "$courseDetails.title",
              thumbnail: "$courseDetails.thumbnail",
              teacherImage: "$teacherInfo.image",
              teacherUserName: "$teacherInfo.userName",
              teacherFirstName: "$teacherInfo.firstName",
              teacherLastName: "$teacherInfo.lastName",
            },

            teacherInfo: {
              image: "$teacherInfo.image",
              userName: "$teacherInfo.userName",
              firstName: "$teacherInfo.firstName",
              lastName: "$teacherInfo.lastName",
            },

            studentInfo: {
              image: "$studentInfo.image",
              userName: "$studentInfo.userName",
              firstName: "$studentInfo.firstName",
              lastName: "$studentInfo.lastName",
            },
            subscriptionInfo: {
              courses: "$subscriptionDetails.courses",
            },
          },
        },
      ];

      let notification = await AdminNotificationModel.aggregate(pipeline);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded  all notifications ",
        notification
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

  async getNotificationByUserId(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get notification",
          validation
        );
      }

      const { userId } = req.params;

      let resAns = await NotificationModel.aggregate([
        {
          $match: {
            userRef: new ObjectId(userId),
          },
        },
        {
          $project: {
            notifications: {
              $filter: {
                input: "$notifications",
                as: "notification",
                cond: { $eq: ["$$notification.isSeen", false] },
              },
            },
          },
        },
      ]);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded  all notifications ",
        resAns?.[0]
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

  async readAdminNotification(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to read notification",
          validation
        );
      }

      let notification = await AdminNotificationModel.updateMany(
        {},
        { $set: { isSeen: true } }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully read notification"
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

  async readUserNotification(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to read notification",
          validation
        );
      }

      const { userId } = req.params;
      let notificationRes = await NotificationModel.updateMany(
        { userRef: userId },
        { $set: { "notifications.$[].isSeen": true } }
      );

      console.log(notificationRes);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully read notification"
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
}

module.exports = new NotificationController();
