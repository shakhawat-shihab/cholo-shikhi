const { insertInLog } = require("../util/logFile");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");
const { default: mongoose } = require("mongoose");
const StudentModel = require("../model/User/Student");
const CourseModel = require("../model/Course/Course");
const { ObjectId } = require("mongodb");
const TeacherModel = require("../model/User/Teacher");
const QuizModel = require("../model/Assesment/Quiz");
const ModuleModel = require("../model/Module/Module");
const ForumModel = require("../model/Course/Forum");
const AuthModel = require("../model/User/Auth");

class ForumController {
  async postQuestion(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to post question",
          validation
        );
      }
      let { userRef, question, courseRef } = req.body;

      const courseFind = await CourseModel.findById({ _id: courseRef });
      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const userFind = await AuthModel.findOne({ userRef: userRef }).populate(
        "userRef"
      );
      //   console.log(userFind);
      if (!userFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User does not exist");
      }

      if (userFind?.role == "student") {
        const studentFind = await StudentModel.findById({
          _id: userFind?.userRef?.studentRef,
        });
        //   console.log(studentFind);
        if (!studentFind) {
          return sendResponse(
            res,
            HTTP_STATUS.NOT_FOUND,
            "Student does not exist"
          );
        }

        //check if student have access to this course
        if (!studentFind?.enrolledCoursesRef?.includes(courseRef)) {
          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "You are not the student for this course"
          );
        }
      } else if (userFind?.role == "teacher") {
        const teacherFind = await TeacherModel.findById({
          _id: userFind?.userRef?.teacherRef,
        });
        //   console.log(teacherFind);
        if (!teacherFind) {
          return sendResponse(
            res,
            HTTP_STATUS.NOT_FOUND,
            "Teacher does not exist"
          );
        }
        //check if teacher have access to this course
        if (!teacherFind?.coursesRef?.includes(courseRef)) {
          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "You are not the teacher for this course"
          );
        }
      }

      console.log(req.body);

      let questionResult = await ForumModel.create({
        userRef,
        question,
        courseRef,
      });

      if (questionResult) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully posted a question",
          questionResult
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to post a question"
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

  async asnwerQuestion(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to answer question",
          validation
        );
      }
      let { userRef, answer, courseRef } = req.body;
      let { questionId } = req.params;

      console.log(userRef, answer, questionId);

      const courseFind = await CourseModel.findById({ _id: courseRef });
      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const userFind = await AuthModel.findOne({ userRef: userRef }).populate(
        "userRef"
      );
      //   console.log(userFind);
      if (!userFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User does not exist");
      }

      if (userFind?.role == "student") {
        const studentFind = await StudentModel.findById({
          _id: userFind?.userRef?.studentRef,
        });
        //   console.log(studentFind);
        if (!studentFind) {
          return sendResponse(
            res,
            HTTP_STATUS.NOT_FOUND,
            "Student does not exist"
          );
        }

        //check if student have access to this course
        if (!studentFind?.enrolledCoursesRef?.includes(courseRef)) {
          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "You are not the student for this course"
          );
        }
      } else if (userFind?.role == "teacher") {
        const teacherFind = await TeacherModel.findById({
          _id: userFind?.userRef?.teacherRef,
        });
        //   console.log(teacherFind);
        if (!teacherFind) {
          return sendResponse(
            res,
            HTTP_STATUS.NOT_FOUND,
            "Teacher does not exist"
          );
        }
        //check if teacher have access to this course
        if (!teacherFind?.coursesRef?.includes(courseRef)) {
          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "You are not the teacher for this course"
          );
        }
      }

      let answerResult = await ForumModel.updateOne(
        {
          _id: questionId,
        },
        {
          $push: {
            answers: {
              answerUserRef: userRef,
              answer: answer,
              time: new Date(),
            },
          },
        }
      );
      console.log(answer?.result);
      if (answerResult) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully posted a answer"
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to post a answer"
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

  async loadForum(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to post question",
          validation
        );
      }
      // let { userRef } = req.body;
      let { courseId } = req.params;

      const courseFind = await CourseModel.findById({ _id: courseId });
      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      // const userFind = await AuthModel.findOne({ userRef: userRef }).populate(
      //   "userRef"
      // );
      //   console.log(userFind);
      // if (!userFind) {
      //   return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User does not exist");
      // }

      // if (userFind?.role == "student") {
      //   const studentFind = await StudentModel.findById({
      //     _id: userFind?.userRef?.studentRef,
      //   });
      //   //   console.log(studentFind);
      //   if (!studentFind) {
      //     return sendResponse(
      //       res,
      //       HTTP_STATUS.NOT_FOUND,
      //       "Student does not exist"
      //     );
      //   }

      //check if student have access to this course
      //   if (!studentFind?.enrolledCoursesRef?.includes(courseId)) {
      //     return sendResponse(
      //       res,
      //       HTTP_STATUS.FORBIDDEN,
      //       "You are not the student for this course"
      //     );
      //   }
      // } else if (userFind?.role == "teacher") {
      //   const teacherFind = await TeacherModel.findById({
      //     _id: userFind?.userRef?.teacherRef,
      //   });
      //   //   console.log(teacherFind);
      //   if (!teacherFind) {
      //     return sendResponse(
      //       res,
      //       HTTP_STATUS.NOT_FOUND,
      //       "Teacher does not exist"
      //     );
      //   }
      //   //check if teacher have access to this course
      //   if (!teacherFind?.coursesRef?.includes(courseId)) {
      //     return sendResponse(
      //       res,
      //       HTTP_STATUS.FORBIDDEN,
      //       "You are not the teacher for this course"
      //     );
      //   }
      // }

      let { page = 1, limit = 30, search = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      let pipeline = [
        {
          $match: {
            courseRef: new mongoose.Types.ObjectId(courseId),
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

        {
          $unwind: {
            path: "$answers",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "answers.answerUserRef",
            foreignField: "_id",
            as: "answerUserDetails",
          },
        },

        {
          $unwind: {
            path: "$answerUserDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            courseDetails: 1,
            userDetails: 1,
            createdAt: 1,
            question: 1,
            questionAnswers: {
              answer: "$answers.answer",
              userName: "$answerUserDetails.userName",
              userImage: "$answerUserDetails.image",
              replyTime: "$answerUserDetails.createdAt",
            },
          },
        },

        {
          $group: {
            _id: "$_id",
            userDetails: { $first: "$userDetails" },
            courses: { $first: "$courseDetails" },
            questionUser: { $first: "$userDetails" },
            question: { $first: "$question" },
            createdAt: { $first: "$createdAt" },
            answer: { $push: "$questionAnswers" },
          },
        },

        {
          $project: {
            _id: 1,
            userName: "$userDetails.userName",
            image: "$userDetails.image",
            courseTitle: "$courses.title",
            // userDetails: 1,
            createdAt: 1,
            question: 1,
            answer: 1,
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
      let allQuestions = await ForumModel.aggregate(pipeline);

      //   if (search != "") {
      //     pipeline.push({
      //       $match: {
      //         "userDetails.userName": {
      //           $regex: search,
      //           $options: "i",
      //         },
      //       },
      //     });
      //   }
      //   pipeline.push({ $limit: limit });
      //   pipeline.push({ $skip: (page - 1) * limit });

      //   let filteredSubscription = await SubscriptionModel.aggregate(pipeline);

      //   let questionResult = await ForumModel.find({
      //     courseRef: courseId,
      //   });

      if (allQuestions) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully loaded the forum",
          allQuestions
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to load the forum"
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
module.exports = new ForumController();
