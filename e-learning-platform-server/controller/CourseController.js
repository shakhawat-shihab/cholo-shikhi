const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const { sendResponse } = require("../util/common");
const { insertInLog } = require("../util/logFile");
const CourseModel = require("../model/Course/Course");
const mongoose = require("mongoose");
const { addAdminNotification } = require("../util/adminNotification");
const TeacherModel = require("../model/User/Teacher");
const { uploadFileAws } = require("../util/awsMethod");
const StudentModel = require("../model/User/Student");
const NotificationModel = require("../model/User/Notification");
const ObjectId = require("mongodb").ObjectId;
const path = require("path");
const ejs = require("ejs");
const { promisify } = require("util");
const ejsRenderFile = promisify(ejs.renderFile);
const transport = require("../config/mailConfig");
const ProgressModel = require("../model/User/Progress");

class CourseController {
  async getAll(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Course can't be loaded",
          validation
        );
      }

      let {
        page = 1,
        limit = 30,
        search = "",
        category,
        sortParam,
        sortOrder,
      } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      ////////////////////// teacher detials er teke teacher name dia search

      let pipeline = [];

      //pipeline2 is for populating data
      let pipeline2 = [
        {
          $match: {
            courseStatus: "published",
          },
        },
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
        {
          $lookup: {
            from: "users",
            localField: "teacherDetails.userRef",
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
        //rating
        {
          $lookup: {
            from: "ratings",
            localField: "ratingsRef",
            foreignField: "_id",
            as: "ratings",
          },
        },
        {
          $unwind: {
            path: "$ratings",
            preserveNullAndEmptyArrays: true,
          },
        },
        //category
        {
          $lookup: {
            from: "categories",
            localField: "categoryRef",
            foreignField: "_id",
            as: "categoryRef",
          },
        },
        {
          $unwind: {
            path: "$categoryRef",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            categoryRef: { $first: "$categoryRef" },
            rating: { $avg: "$ratings.rating" },
            userDetails: { $first: "$userDetails" },
            // teacherDetails: { $first: "$teacherDetails" },
            title: { $first: "$title" },
            courseStatus: { $first: "$courseStatus" },
            createdAt: { $first: "$createdAt" },
            description: { $first: "$description" },
            price: { $first: "$price" },
            modulesRef: { $first: "$modulesRef" },
            studentsCount: { $first: { $size: "$studentsRef" } },
            reviewsCount: { $first: { $size: "$reviewsRef" } },
            thumbnail: { $first: "$thumbnail" },
          },
        },
        // {
        //   $sort: {
        //     createdAt: 1,
        //   },
        // },
      ];

      // sortOrder
      if (
        (sortOrder && !sortParam) ||
        (!sortOrder && sortParam) ||
        (sortParam &&
          sortParam != "rating" &&
          sortParam != "createdAt" &&
          sortParam != "title" &&
          sortParam != "reviewCount") ||
        (sortOrder && sortOrder != "asc" && sortOrder != "desc")
      ) {
        console.log("sortOrder ", sortOrder);
        console.log("sortParam ", sortParam);
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Invalid sort parameters provided.."
        );
      }

      if (sortParam) {
        if (sortOrder == "asc") pipeline.unshift({ $sort: { [sortParam]: 1 } });
        else if (sortOrder == "desc")
          pipeline.unshift({ $sort: { [sortParam]: -1 } });
      } else {
        pipeline.unshift({ $sort: { createdAt: -1 } });
      }

      //category
      if (typeof category == "string") {
        category = [category];
      }
      if (category?.length) {
        category = category.map((x) => new ObjectId(x));
        category.map((x) => {
          console.log(typeof x);
          console.log(x);
        });

        pipeline.unshift({
          $match: {
            "categoryRef._id": {
              $in: category,
            },
          },
        });
      }

      //search
      if (search != "") {
        pipeline.unshift({
          $match: {
            title: {
              $regex: search,
              $options: "i",
            },
          },
        });
      }

      // console.log("pipeline for filtering ", pipeline);
      // all courses are here

      // pipeline for populating data, pipeline2 for filtering
      let mergedPipeline = [...pipeline2, ...pipeline];

      let allCourses;
      if (pipeline?.length) {
        // console.log("heeeeeeeeeeeeeeeeeeeeeeere ");
        allCourses = await CourseModel.aggregate(mergedPipeline);
      } else {
        // console.log("heeeeeeeeeeeeeeeeeeeeeeere 11111111111111111");
        allCourses = await CourseModel.find({});
      }

      console.log("allCourses ", allCourses.length);
      // console.log(limit, page);
      // console.log((page - 1) * limit);

      mergedPipeline.push({ $skip: (page - 1) * limit });
      mergedPipeline.push({ $limit: limit });

      let filteredCourses = await CourseModel.aggregate(mergedPipeline);
      // console.log("filteredCourses ", filteredCourses.length);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the courses",
        {
          total: allCourses?.length,
          count: filteredCourses.length,
          page: parseInt(page),
          limit: parseInt(limit),
          courses: filteredCourses,
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

  async getRequestedCourses(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Course can't be loaded",
          validation
        );
      }

      let { page = 1, limit = 30 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      let pipeline = [
        {
          $match: {
            courseStatus: "requested",
          },
        },
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
        {
          $lookup: {
            from: "users",
            localField: "teacherDetails.userRef",
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
        //rating
        {
          $lookup: {
            from: "ratings",
            localField: "ratingsRef",
            foreignField: "_id",
            as: "ratings",
          },
        },
        {
          $unwind: {
            path: "$ratings",
            preserveNullAndEmptyArrays: true,
          },
        },
        // category
        {
          $lookup: {
            from: "categories",
            localField: "categoryRef",
            foreignField: "_id",
            as: "categoryRef",
          },
        },
        {
          $unwind: {
            path: "$categoryRef",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            categoryRef: { $first: "$categoryRef" },
            rating: { $avg: "$ratings.rating" },
            userDetails: { $first: "$userDetails" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            description: { $first: "$description" },
            price: { $first: "$price" },
            modulesRef: { $first: "$modulesRef" },
            studentsCount: { $first: { $size: "$studentsRef" } },
            reviewsCount: { $first: { $size: "$reviewsRef" } },
            thumbnail: { $first: "$thumbnail" },
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
      ];

      let allCourses;

      // pipeline.push({ $skip: (page - 1) * limit });
      // pipeline.push({ $limit: limit });

      let filteredCourses = await CourseModel.aggregate(pipeline);
      // console.log("filteredCourses ", filteredCourses.length);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the courses",
        {
          total: allCourses?.length,
          count: filteredCourses.length,
          page: parseInt(page),
          limit: parseInt(limit),
          courses: filteredCourses,
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

  async createCourse(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create course",
          validation
        );
      }
      const {
        title,
        description,
        language,
        learningScope,
        learningOutcome,
        teacherRef,
        category,
      } = req.body;
      console.log(req.body);

      const courseFind = await CourseModel.findOne({
        $and: [{ title: title }, { teacherRef: teacherRef }],
      });
      // console.log("courseFind ", courseFind);
      if (courseFind) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          "You have already a course with same title",
          [{ msg: "Course already exists", path: "title" }]
        );
      }

      //upload file
      let url;
      if (req.file) {
        url = await uploadFileAws(
          req.file,
          `study_materials/courses_thumbnail`
        );
      }

      // console.log("url ================= ", url);

      const courseResult = await CourseModel.create({
        title,
        description,
        language,
        learningScope: learningScope,
        learningOutcome: learningOutcome,
        categoryRef: category,
        teacherRef,
        thumbnail: url,
      });

      if (courseResult?._id) {
        await TeacherModel.updateOne(
          { _id: teacherRef },
          { $addToSet: { coursesRef: courseResult?._id } }
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Admin will review your course",
        courseResult
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

  async updateCourse(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update course",
          validation
        );
      }

      const {
        title,
        description,
        language,
        learningScope,
        learningOutcome,
        teacherRef,
      } = req.body;

      const { courseId } = req.params;

      // find if the course title is available
      // const courseFindTitle = await CourseModel.findOne({
      //   $and: [{ title: title }, { teacherRef: teacherRef }],
      // });
      // if (courseFindTitle) {
      //   return sendResponse(
      //     res,
      //     HTTP_STATUS.CONFLICT,
      //     "You Have already a course with this name"
      //   );
      // }

      const courseFind = await CourseModel.findOne({
        _id: courseId,
      });

      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const teacherFind = await TeacherModel.findOne({
        _id: teacherRef,
      });
      // console.log("teacherFind ", teacherFind);
      if (!teacherFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Teacher is not found");
      }

      //check if teacher have access to this coure
      if (!teacherFind?.coursesRef?.includes(courseId)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      // console.log("req.file ", req.file);

      //upload file
      let url;
      if (req.file) {
        url = await uploadFileAws(
          req.file,
          `study_materials/courses_thumbnail`
        );
      }

      let courseResult;
      if (url) {
        courseResult = await CourseModel.updateOne(
          { _id: courseId },
          {
            $set: {
              title,
              description,
              language,
              learningScope,
              learningOutcome,
              teacherRef,
              thumbnail: url,
            },
          }
        );
      } else {
        courseResult = await CourseModel.updateOne(
          { _id: courseId },
          {
            $set: {
              title,
              description,
              language,
              learningScope,
              learningOutcome,
              teacherRef,
            },
          }
        );
      }

      if (courseResult?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully updated",
          courseResult
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to update course"
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

  async publishCourse(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to approve course",
          validation
        );
      }

      const { courseId } = req.params;
      const courseFind = await CourseModel.findOne({
        _id: courseId,
      });

      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      if (courseFind?.courseStatus == "published") {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "Course is already published"
        );
      }

      const teacherFind = await TeacherModel.findOne({
        _id: courseFind.teacherRef,
      }).populate("userRef");

      // console.log(teacherFind);

      // send notification to user
      const newNotification = {
        content: `Your Course on ${courseFind.title} has been Approved`,
        time: new Date(),
        link: "/courses",
      };
      let notificationResult = await NotificationModel.updateOne(
        {
          userRef: teacherFind?.userRef?._id,
        },
        {
          $push: {
            notifications: newNotification,
          },
        }
      );

      // send email
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "publishCourse.ejs"),
        {
          name: teacherFind?.userRef?.userName,
          title: courseFind?.title,
        }
      );
      const mailSendResult = await transport.sendMail({
        from: "myapp@system.com",
        to: `${teacherFind?.userRef?.userName} ${teacherFind?.userRef?.email}`,
        subject: "Course Enrollment Request Approved",
        html: htmlBody,
      });

      let courseResult;
      courseResult = await CourseModel.updateOne(
        { _id: courseId },
        {
          $set: {
            courseStatus: "published",
          },
        }
      );

      if (courseResult?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully published",
          courseResult
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to publish course"
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

  async rejectCourse(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to reject course",
          validation
        );
      }

      const { courseId } = req.params;
      const courseFind = await CourseModel.findOne({
        _id: courseId,
      });

      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      if (courseFind?.courseStatus == "rejected") {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "Course is already rejected"
        );
      }

      const teacherFind = await TeacherModel.findOne({
        _id: courseFind.teacherRef,
      }).populate("userRef");
      // console.log(teacherFind);

      // send notification to user
      const newNotification = {
        content: `Your Course on ${courseFind.title} has been rejected`,
        time: new Date(),
        link: "/courses",
      };
      let notificationResult = await NotificationModel.updateOne(
        {
          userRef: teacherFind?.userRef?._id,
        },
        {
          $push: {
            notifications: newNotification,
          },
        }
      );

      // send email
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "rejectCourse.ejs"),
        {
          name: teacherFind?.userRef?.userName,
          title: courseFind?.title,
        }
      );
      const mailSendResult = await transport.sendMail({
        from: "myapp@system.com",
        to: `${teacherFind?.userRef?.userName} ${teacherFind?.userRef?.email}`,
        subject: "Course Enrollment Request Approved",
        html: htmlBody,
      });

      let courseResult;
      courseResult = await CourseModel.updateOne(
        { _id: courseId },
        {
          $set: {
            courseStatus: "rejected",
          },
        }
      );

      if (courseResult?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully rejected",
          courseResult
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to reject course"
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

  async requestPublish(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update course",
          validation
        );
      }

      const { teacherRef } = req.body;

      const { courseId } = req.params;

      const courseFind = await CourseModel.findOne({
        _id: courseId,
      });

      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      if (courseFind.courseStatus == "requested") {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Course is already requested"
        );
      }

      const teacherFind = await TeacherModel.findOne({
        _id: teacherRef,
      });
      // console.log("teacherFind ", teacherFind);
      if (!teacherFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Teacher is not found");
      }

      //check if teacher have access to this coure
      if (!teacherFind?.coursesRef?.includes(courseId)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      let courseResult;

      courseResult = await CourseModel.updateOne(
        { _id: courseId },
        {
          $set: {
            courseStatus: "requested",
          },
        }
      );

      await addAdminNotification({
        type: "courseRequest",
        teacherRef: teacherRef,
        courseRef: courseId,
      });

      if (courseResult?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully requested to publish",
          courseResult
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to send publish request course"
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

  async getById(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Course can't be loaded",
          validation
        );
      }

      const { courseId } = req.params;
      // console.log("courseId getbyid", courseId);

      let pipeline2 = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(courseId),
          },
        },
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
        {
          $lookup: {
            from: "users",
            localField: "teacherDetails.userRef",
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
        //rating
        {
          $lookup: {
            from: "ratings",
            localField: "ratingsRef",
            foreignField: "_id",
            as: "ratings",
          },
        },
        {
          $unwind: {
            path: "$ratings",
            preserveNullAndEmptyArrays: true,
          },
        },
        //category
        {
          $lookup: {
            from: "categories",
            localField: "categoryRef",
            foreignField: "_id",
            as: "categoryRef",
          },
        },
        {
          $unwind: {
            path: "$categoryRef",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            categoryRef: { $first: "$categoryRef" },
            rating: { $avg: "$ratings.rating" },
            userDetails: { $first: "$userDetails" },
            // teacherDetails: { $first: "$teacherDetails" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            description: { $first: "$description" },
            price: { $first: "$price" },
            modulesRef: { $first: "$modulesRef" },
            studentsCount: { $first: { $size: "$studentsRef" } },
            reviewsCount: { $first: { $size: "$reviewsRef" } },
            thumbnail: { $first: "$thumbnail" },
            language: { $first: "$language" },
            learningScope: { $first: "$learningScope" },
            learningOutcome: { $first: "$learningOutcome" },
          },
        },
      ];
      let course = await CourseModel.aggregate(pipeline2);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the course",
        course?.[0]
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

  async getTeacherCourse(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Course can't be loaded",
          validation
        );
      }

      const { teacherId } = req.params;

      let pipeline = [
        {
          $match: {
            teacherRef: new mongoose.Types.ObjectId(teacherId),
          },
        },
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
        {
          $lookup: {
            from: "users",
            localField: "teacherDetails.userRef",
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
        //rating
        {
          $lookup: {
            from: "ratings",
            localField: "ratingsRef",
            foreignField: "_id",
            as: "ratings",
          },
        },
        {
          $unwind: {
            path: "$ratings",
            preserveNullAndEmptyArrays: true,
          },
        },
        //category
        {
          $lookup: {
            from: "categories",
            localField: "categoryRef",
            foreignField: "_id",
            as: "categoryRef",
          },
        },
        {
          $unwind: {
            path: "$categoryRef",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            categoryRef: { $first: "$categoryRef" },
            rating: { $avg: "$ratings.rating" },
            userDetails: { $first: "$userDetails" },
            // teacherDetails: { $first: "$teacherDetails" },
            courseStatus: { $first: "$courseStatus" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            description: { $first: "$description" },
            price: { $first: "$price" },
            modulesRef: { $first: "$modulesRef" },
            studentsCount: { $first: { $size: "$studentsRef" } },
            reviewsCount: { $first: { $size: "$reviewsRef" } },
            thumbnail: { $first: "$thumbnail" },
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
      ];

      let courses = await CourseModel.aggregate(pipeline);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the courses",
        courses
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

  async getStudentCourses(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Course can't be loaded",
          validation
        );
      }

      const { studentId } = req.params;
      const { value } = req.query;

      const student = await StudentModel.findOne({ _id: studentId });

      // console.log(student, student);

      if (!student) {
        res, HTTP_STATUS.NOT_FOUND, "Successfully doesn't exist";
      }

      // console.log("value ", value);

      let objectIdArray = [];
      if (value == "completed") {
        objectIdArray = student?.completedCoursesRef?.map(
          (str) => new ObjectId(str)
        );
      } else {
        objectIdArray = student?.enrolledCoursesRef?.map(
          (str) => new ObjectId(str)
        );
      }

      console.log(objectIdArray);

      if (!student) {
        res, HTTP_STATUS.NOT_FOUND, "You have no course";
      }

      // let pipeline = [
      //   {
      //     $match: {
      //       _id: { $in: objectIdArray },
      //     },
      //   },

      //   {
      //     $unwind: {
      //       path: "$teacherDetails",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },

      //   {
      //     $lookup: {
      //       from: "teachers",
      //       localField: "teacherRef",
      //       foreignField: "_id",
      //       as: "teacherDetails",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$teacherDetails",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "teacherDetails.userRef",
      //       foreignField: "_id",
      //       as: "userDetails",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$userDetails",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   //rating
      //   {
      //     $lookup: {
      //       from: "ratings",
      //       localField: "ratingsRef",
      //       foreignField: "_id",
      //       as: "ratings",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$ratings",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   //category
      //   {
      //     $lookup: {
      //       from: "categories",
      //       localField: "categoryRef",
      //       foreignField: "_id",
      //       as: "categoryRef",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$categoryRef",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$_id",
      //       categoryRef: { $first: "$categoryRef" },
      //       rating: { $avg: "$ratings.rating" },
      //       userDetails: { $first: "$userDetails" },
      //       // teacherDetails: { $first: "$teacherDetails" },
      //       title: { $first: "$title" },
      //       createdAt: { $first: "$createdAt" },
      //       description: { $first: "$description" },
      //       price: { $first: "$price" },
      //       modulesRef: { $first: "$modulesRef" },
      //       // quizzesRef: { $first: "$quizzesRef" },
      //       // assignmentsRef: { $first: "$assignmentsRef" },
      //       studentsCount: { $first: { $size: "$studentsRef" } },
      //       reviewsCount: { $first: { $size: "$reviewsRef" } },
      //       thumbnail: { $first: "$thumbnail" },
      //     },
      //   },
      //   {
      //     $sort: {
      //       createdAt: 1,
      //     },
      //   },
      // ];

      let pipeline = [
        {
          $match: {
            studentRef: new ObjectId(studentId),
          },
        },
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
          $project: {
            courseId: "$courseDetails._id",
            title: "$courseDetails.title",
            thumbnail: "$courseDetails.thumbnail",
            modulesRef: "$courseDetails.modulesRef",
            completedModulesRef: 1,
            createdAt: 1,
          },
        },
        // {
        //   $group: {
        //     _id: "$_id",
        //     categoryRef: { $first: "$categoryRef" },
        //     rating: { $avg: "$ratings.rating" },
        //     userDetails: { $first: "$userDetails" },
        //     // teacherDetails: { $first: "$teacherDetails" },
        //     title: { $first: "$title" },
        //     createdAt: { $first: "$createdAt" },
        //     description: { $first: "$description" },
        //     price: { $first: "$price" },
        //     modulesRef: { $first: "$modulesRef" },
        //     // quizzesRef: { $first: "$quizzesRef" },
        //     // assignmentsRef: { $first: "$assignmentsRef" },
        //     studentsCount: { $first: { $size: "$studentsRef" } },
        //     reviewsCount: { $first: { $size: "$reviewsRef" } },
        //     thumbnail: { $first: "$thumbnail" },
        //   },
        // },
        {
          $sort: {
            createdAt: 1,
          },
        },
      ];

      let courses = await ProgressModel.aggregate(pipeline);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the courses",
        courses
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

  async checkProgress(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Course can't be loaded",
          validation
        );
      }

      const { studentRef, courseRef } = req.body;
      const { value } = req.query;

      const student = await StudentModel.findOne({ _id: studentRef });

      // console.log(student, student);

      // console.log("value ", value);

      if (!student) {
        res, HTTP_STATUS.NOT_FOUND, "You have no course";
      }

      let pipeline = [
        {
          $match: {
            studentRef: new ObjectId(studentRef),
            courseRef: new ObjectId(courseRef),
          },
        },
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
          $project: {
            courseId: "$courseDetails._id",
            title: "$courseDetails.title",
            thumbnail: "$courseDetails.thumbnail",
            modulesRef: "$courseDetails.modulesRef",
            completedModulesRef: 1,
            createdAt: 1,
          },
        },

        {
          $sort: {
            createdAt: 1,
          },
        },
      ];

      let courses = await ProgressModel.aggregate(pipeline);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the courses",
        courses
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

module.exports = new CourseController();
