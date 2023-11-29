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
const UserModel = require("../model/User/User");
const NotificationModel = require("../model/User/Notification");
const { ObjectId } = mongoose.Types;
const path = require("path");
const ejs = require("ejs");
const { promisify } = require("util");
const ejsRenderFile = promisify(ejs.renderFile);
const transport = require("../config/mailConfig");
const ProgressModel = require("../model/User/Progress");

class SubscriptionController {
  async getSubscriptionRequest(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to load the subscription request",
          validation
        );
      }

      let { page = 1, limit = 30, search = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      let pipeline = [
        {
          $match: {
            isCheckedAdmin: "unchecked",
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "studentRef",
            foreignField: "_id",
            as: "studentsDetails",
          },
        },
        {
          $unwind: {
            path: "$studentsDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentsDetails.userRef",
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
          $unwind: {
            path: "$courses",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courses.courseRef",
            foreignField: "_id",
            as: "course_details",
          },
        },

        {
          $unwind: {
            path: "$course_details",
            preserveNullAndEmptyArrays: true,
          },
        },

        // for loading teachre info
        // starts here
        {
          $lookup: {
            from: "teachers",
            localField: "course_details.teacherRef",
            foreignField: "_id",
            as: "teacher_info",
          },
        },
        {
          $unwind: {
            path: "$teacher_info",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "teacher_info.userRef",
            foreignField: "_id",
            as: "teacher_details",
          },
        },
        {
          $unwind: {
            path: "$teacher_details",
            preserveNullAndEmptyArrays: true,
          },
        },
        //ends here

        {
          $project: {
            isCheckedAdmin: 1,
            createdAt: 1,
            // course_details: 1,
            "userDetails.email": 1,
            "userDetails._id": 1,
            "userDetails.userName": 1,
            "userDetails.firstName": 1,
            "userDetails.lastName": 1,
            "userDetails.image": 1,
            courseDetails: {
              _id: "$course_details._id",
              title: "$course_details.title",
              isPublishedCourse: "$course_details.isPublishedCourse",
              thumbnail: "$course_details.thumbnail",
              statusOfSubscription: "$courses.status",
              teacherUserName: "$teacher_details.userName",
              teacherFirstName: "$teacher_details.firstName",
              teacherLastName: "$teacher_details.lastName",
            },
          },
        },

        {
          $group: {
            _id: "$_id",
            courses: { $push: "$courseDetails" },
            userDetails: { $first: "$userDetails" },
            isCheckedAdmin: { $first: "$isCheckedAdmin" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },

        // { $limit: limit },
        // { $skip: (page - 1) * limit },
      ];

      // all uncheckedSubscription are here
      let allSubscription = await SubscriptionModel.aggregate(pipeline);

      if (search != "") {
        pipeline.push({
          $match: {
            "userDetails.userName": {
              $regex: search,
              $options: "i",
            },
          },
        });
      }
      // pipeline.push({ $limit: limit });
      // pipeline.push({ $skip: (page - 1) * limit });

      let filteredSubscription = await SubscriptionModel.aggregate(pipeline);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the subscriptions request",
        {
          total: allSubscription.length,
          count: filteredSubscription.length,
          page: parseInt(page),
          limit: parseInt(limit),
          subscriptions: filteredSubscription,
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

  async singleCourseSubscribe(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to subscribe",
          validation
        );
      }
      const { courseRef, studentRef } = req.body;

      const courseFind = await CourseModel.findOne({
        _id: courseRef,
      });
      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const studentFind = await StudentModel.findOne({
        _id: studentRef,
      });
      // console.log("studentFind ", studentFind);
      if (!studentFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Student is not found");
      }

      //check if student have access to this coure already
      //   if (studentFind?.enrolledCoursesRef?.includes(courseRef) || studentFind?.completedCoursesRef?.includes(courseRef)  ) {
      //     return sendResponse(
      //       res,
      //       HTTP_STATUS.FORBIDDEN,
      //       "You have already applied to this course"
      //     );
      //   }

      const subscriptionResult = await SubscriptionModel.create({
        studentRef,
        courses: [{ courseRef }],
      });

      if (subscriptionResult?._id) {
        await addAdminNotification({
          type: "enrollmentRequest",
          subscriptionRef: subscriptionResult?._id,
          studentRef: studentRef,
        });
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully send subscription request",
        subscriptionResult
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

  async approveCourseSubscription(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to approve subscription request",
          validation
        );
      }
      const { subscriptionRef, courseRef, userRef } = req.body;

      const courseFind = await CourseModel.findOne({
        _id: courseRef,
      });

      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const userFind = await UserModel.findOne({
        _id: userRef,
      }).populate("studentRef");
      console.log("userFind ", userFind);
      if (!userFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "user is not found");
      }

      // check if student have access to this coure already
      if (
        userFind?.studentRef?.enrolledCoursesRef?.includes(courseRef) ||
        userFind?.studentRef?.completedCoursesRef?.includes(courseRef)
      ) {
        // change in subscription
        await SubscriptionModel.updateOne(
          { _id: subscriptionRef, "courses.courseRef": courseRef },
          {
            $set: {
              "courses.$.status": "approve",
            },
          }
        );

        return sendResponse(res, HTTP_STATUS.OK, "Student already enrolled", {
          courseId: courseRef,
          subscriptionId: subscriptionRef,
        });
      }

      await ProgressModel.create({
        studentRef: userFind?.studentRef?._id,
        courseRef: courseRef,
      });

      // push info to student
      console.log(userRef?.studentRef);
      await StudentModel.updateOne(
        { _id: userFind?.studentRef?._id },
        {
          $addToSet: {
            enrolledCoursesRef: courseRef,
          },
        }
      );

      // push info to course
      await CourseModel.updateOne(
        { _id: courseRef },
        {
          $addToSet: {
            studentsRef: userFind?.studentRef?._id,
          },
        }
      );

      const newNotification = {
        content: `Your request to enroll ${courseFind.title} is approved`,
        time: new Date(),
      };

      // push info to notification
      await NotificationModel.updateOne(
        { userRef: userRef },
        {
          $push: {
            notifications: newNotification,
          },
        }
      );

      // send email
      const myCourseUrl = path.join(
        process.env.FRONTEND_URL,
        "my-course",
        courseFind?._id.toString()
      );
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "approveSubscriptionRequest.ejs"),
        {
          name: userFind?.userName,
          title: courseFind?.title,
          myCourseUrl: myCourseUrl,
        }
      );
      const mailSendResult = await transport.sendMail({
        from: "myapp@system.com",
        to: `${userFind?.userName} ${userFind?.email}`,
        subject: "Course Enrollment Request Approved",
        html: htmlBody,
      });

      // change in subscription
      await SubscriptionModel.updateOne(
        { _id: subscriptionRef, "courses.courseRef": courseRef },
        {
          $set: {
            notifications: newNotification,
            "courses.$.status": "approve",
          },
        }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully approved request",
        {
          courseId: courseRef,
          subscriptionId: subscriptionRef,
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

  async denyCourseSubscription(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to approve subscription request",
          validation
        );
      }
      const { subscriptionRef, courseRef, userRef } = req.body;

      const courseFind = await CourseModel.findOne({
        _id: courseRef,
      });

      console.log("courseFind  -- ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const userFind = await UserModel.findOne({
        _id: userRef,
      }).populate("studentRef");
      console.log("userFind   --  ", userFind);
      if (!userFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "user is not found");
      }

      // check if student have access to this coure already
      // if (
      //   userFind?.studentRef?.enrolledCoursesRef?.includes(courseRef) ||
      //   userFind?.studentRef?.completedCoursesRef?.includes(courseRef)
      // ) {
      //   return sendResponse(
      //     res,
      //     HTTP_STATUS.FORBIDDEN,
      //     "Student already enrolled"
      //   );
      // }

      // pull info from student
      // console.log(userRef?.studentRef);
      await StudentModel.updateOne(
        { _id: userFind?.studentRef?._id },
        {
          $pull: {
            enrolledCoursesRef: courseRef,
          },
        }
      );

      // pull info to course
      await CourseModel.updateOne(
        { _id: courseRef },
        {
          $pull: {
            studentsRef: userFind?.studentRef?._id,
          },
        }
      );

      const newNotification = {
        content: `Your request to enroll ${courseFind.title} is denied`,
        time: new Date(),
      };

      // push info to notification
      await NotificationModel.updateOne(
        { userRef: userRef },
        {
          $push: {
            notifications: newNotification,
          },
        }
      );

      //send mail
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "denySubscriptionRequest.ejs"),
        {
          name: userFind?.userName,
          title: courseFind?.title,
        }
      );
      const mailSendResult = await transport.sendMail({
        from: "myapp@system.com",
        to: `${userFind?.userName} ${userFind?.email}`,
        subject: "Course Enrollment Request Denied",
        html: htmlBody,
      });

      // change in subscription
      await SubscriptionModel.updateOne(
        { _id: subscriptionRef, "courses.courseRef": courseRef },
        {
          $set: {
            notifications: newNotification,
            "courses.$.status": "deny",
          },
        }
      );

      return sendResponse(res, HTTP_STATUS.OK, "Successfully denied request", {
        courseId: courseRef,
        subscriptionId: subscriptionRef,
      });
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Something went wrong!"
      );
    }
  }

  async removeSubscriptionRequest(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to remove subscription request",
          validation
        );
      }
      const { subscriptionRef, userRef } = req.body;

      const userFind = await UserModel.findOne({
        _id: userRef,
      });

      if (!userFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User is not found");
      }

      const newNotification = {
        content: `Your cart has been checked by admin`,
        time: new Date(),
      };

      // push info to notification
      await NotificationModel.updateOne(
        { userRef: userRef },
        {
          $push: {
            notifications: newNotification,
          },
        }
      );

      // change in subscription
      await SubscriptionModel.updateOne(
        { _id: subscriptionRef },
        {
          $set: {
            isCheckedAdmin: true,
          },
        }
      );

      return sendResponse(res, HTTP_STATUS.OK, "Successfully checked request", {
        subscriptionId: subscriptionRef,
      });
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

module.exports = new SubscriptionController();
