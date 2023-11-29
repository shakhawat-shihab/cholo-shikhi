const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const { sendResponse } = require("../util/common");
const { insertInLog } = require("../util/logFile");
const AuthModel = require("../model/User/Auth");
const UserModel = require("../model/User/User");
const TeacherModel = require("../model/User/Teacher");
const { uploadFileAws } = require("../util/awsMethod");
const NotificationModel = require("../model/User/Notification");
const { addAdminNotification } = require("../util/adminNotification");
const path = require("path");
const ejs = require("ejs");
const { promisify } = require("util");
const ejsRenderFile = promisify(ejs.renderFile);
const transport = require("../config/mailConfig");

class TeacherController {
  async getTeacherRequest(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to load the teacher request",
          validation
        );
      }

      let { page = 1, limit = 30, search = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      let pipeline = [
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
            createdAt: 1,
            "userDetails.email": 1,
            "userDetails._id": 1,
            "userDetails.userName": 1,
            "userDetails.firstName": 1,
            "userDetails.lastName": 1,
            "userDetails.phone": 1,
            "userDetails.image": 1,
            "userDetails.address": 1,
            "userDetails.teacherRef": 1,
            teacherDetails: 1,
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
      ];

      let filter = {};
      if (search != "") {
        pipeline.unshift({
          $match: {
            isPendingTeacher: true,
            email: {
              $regex: search,
              $options: "i",
            },
          },
        });
        filter = {
          isPendingTeacher: true,
          email: {
            $regex: search,
            $options: "i",
          },
        };
      } else {
        pipeline.unshift({
          $match: {
            isPendingTeacher: true,
          },
        });
        filter = {
          isPendingTeacher: true,
        };
      }

      // console.log(pipeline);

      let teacherRequests = await AuthModel.aggregate(pipeline);

      const teacherRequestsCount = await AuthModel.find(filter).count();

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the teacher request",
        {
          total: teacherRequestsCount,
          count: teacherRequests.length,
          page: parseInt(page),
          limit: parseInt(limit),
          requests: teacherRequests,
        }
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

  async applyTeacher(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, req.params, req.body, {
        email: req?.body?.email,
        userName: req?.body?.userName,
      });

      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to apply",
          validation
        );
      }
      const {
        firstName,
        lastName,
        phone,
        education,
        facebookUrl,
        twitterUrl,
        linkedInUrl,
      } = req.body;

      const { userId } = req.params;
      const auth = await AuthModel.findOne({ userRef: userId });
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User doesn't exist");
      }

      if (auth?.role == "teacher") {
        return sendResponse(res, HTTP_STATUS.CONFLICT, "Already a teacher");
      }

      // console.log(req.file);

      const teacher = await TeacherModel.findOne({ userRef: userId });

      // console.log("teacher ", teacher);
      //teacher not exist
      let teacherResult;
      let teacherId;
      const url = await uploadFileAws(req.file, "resumes");
      console.log(" resume url ", url);
      if (!teacher) {
        teacherResult = await TeacherModel.create({
          userRef: userId,
          education,
          resume: url,
          facebookUrl,
          twitterUrl,
          linkedInUrl,
        });
        teacherId = teacherResult?._id;

        // send notification to admin
        await addAdminNotification({
          type: "teacherRequest",
          teacherRef: teacherId,
        });
      }
      //teacher exist
      else {
        // console.log("teacher exist ", teacher);

        teacherResult = await TeacherModel.updateOne(
          {
            _id: teacher?._id,
          },
          {
            userRef: userId,
            education,
            resume: url,
            facebookUrl,
            twitterUrl,
            linkedInUrl,
          }
        );
        // console.log("teacherResult ", teacherResult);
        teacherId = teacher?._id;
      }

      const userResult = await UserModel.updateOne(
        { _id: userId },
        {
          $set: { firstName, lastName, phone, teacherRef: teacherId },
        }
      );

      // if (userResult?.modifiedCount) {
      await AuthModel.updateOne(
        { userRef: userId },
        {
          $set: {
            isPendingTeacher: true,
          },
        }
      );
      // }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "You will be notified after admin approval"
      );
    } catch (error) {
      console.log("error ", error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async approveTeacherRequest(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, req.param);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to approve",
          validation
        );
      }

      let { userId } = req.params;

      const auth = await AuthModel.findOne({ userRef: userId })
        .populate("userRef", "-createdAt -updatedAt -__v")
        .select("-createdAt -updatedAt -__v");

      //   console.log(user);
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User Not Found");
      }
      if (auth?.role == "teacher") {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Already a teacher"
        );
      }

      const result = await AuthModel.updateOne(
        { userRef: userId },
        { $set: { isPendingTeacher: false, role: "teacher" } }
      );
      // console.log(result);

      const newNotification = {
        content: "Your request for being teacher has been approved.",
        time: new Date(),
      };

      let notificationResult;
      // if notification collection not exist then create it for that user
      if (!auth?.userRef?.notificationRef) {
        notificationResult = await NotificationModel.create({
          userRef: userId,
          notifications: [newNotification],
        });

        // send email

        const htmlBody = await ejsRenderFile(
          path.join(__dirname, "..", "views", "approveTeacherRequest.ejs"),
          {
            name: auth?.userRef?.userName,
          }
        );
        const mailSendResult = await transport.sendMail({
          from: "myapp@system.com",
          to: `${auth?.userRef?.userName} ${auth?.userRef?.email}`,
          subject: "Course Enrollment Request Approved",
          html: htmlBody,
        });

        await UserModel.updateOne(
          { _id: userId },
          { $set: { notificationRef: notificationResult?._id } }
        );
      } else {
        notificationResult = await NotificationModel.updateOne(
          {
            userRef: userId,
          },
          {
            $push: {
              notifications: newNotification,
            },
          }
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully approved the request"
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

  async denyTeacherRequest(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, req.param);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to load deny",
          validation
        );
      }

      let { userId } = req.params;

      const auth = await AuthModel.findOne({ userRef: userId })
        .populate("userRef", "-createdAt -updatedAt -__v")
        .select("-createdAt -updatedAt -__v");
      //   console.log(user);
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User Not Found");
      }
      if (auth?.isPendingTeacher == false && auth?.role == "pending") {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "This request already denied"
        );
      }

      const result = await AuthModel.updateOne(
        { userRef: userId },
        { $set: { isPendingTeacher: false, role: "pending" } }
      );
      // console.log(result);

      const newNotification = {
        content: "Your request for being teacher has been denied.",
        time: new Date(),
      };

      let notificationResult;
      // if notification collection not exist then create it for that user
      if (!auth?.userRef?.notificationRef) {
        notificationResult = await NotificationModel.create({
          userRef: userId,
          notifications: [newNotification],
        });

        await UserModel.updateOne(
          { _id: userId },
          { $set: { notificationRef: notificationResult?._id } }
        );
      } else {
        notificationResult = await NotificationModel.updateOne(
          {
            userRef: userId,
          },
          {
            $push: {
              notifications: newNotification,
            },
          }
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully denied the request"
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

module.exports = new TeacherController();
