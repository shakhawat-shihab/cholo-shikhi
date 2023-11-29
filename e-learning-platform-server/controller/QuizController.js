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
const ProgressModel = require("../model/User/Progress");

class QuizController {
  async createQuiz(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create quiz",
          validation
        );
      }
      const {
        title,
        durationInMinute,
        isPublishByTeacher,
        passMarkPercentage,
        courseRef,
        moduleRef,
        teacherRef,
      } = req.body;

      const courseFind = await CourseModel.findById({ _id: courseRef });
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const teacherFind = await TeacherModel.findById({ _id: teacherRef });
      if (!teacherFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Teacher does not exist"
        );
      }
      //   console.log(teacherFind);
      //check if teacher have access to this coure
      if (!teacherFind?.coursesRef?.includes(courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      const quizResult = await QuizModel.create({
        title,
        durationInMinute,
        passMarkPercentage,
        courseRef,
        teacherRef,
      });

      if (!quizResult?._id) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create course"
        );
      }
      const addQuizRefToModule = await ModuleModel.updateOne(
        {
          _id: moduleRef,
        },
        {
          $push: { quizzesRef: quizResult?._id },
        }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully created the quiz",
        quizResult
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

  async getQuizByIdTeacher(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get quiz",
          validation
        );
      }
      const { quizId } = req.params;
      const { teacherRef } = req.body;

      const quizFind = await QuizModel.findById({ _id: quizId });
      // .populate(
      //   "courseRef",
      //   "title teacherRef"
      // );
      // console.log(quizFind);
      if (!quizFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
      }

      const teacherFind = await TeacherModel.findById({ _id: teacherRef });
      if (!teacherFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Teacher does not exist"
        );
      }
      //   console.log(teacherFind);
      //check if teacher have access to this coure
      if (!teacherFind?.coursesRef?.includes(quizFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      let pipeline = [
        {
          $match: {
            _id: new ObjectId(quizId),
          },
        },
        {
          $lookup: {
            from: "questions",
            localField: "questionsRef",
            foreignField: "_id",
            as: "question",
          },
        },
        {
          $unwind: {
            path: "$question",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            questions: { $push: "$question" },
            title: { $first: "$title" },
          },
        },
      ];

      let quizDetails = await QuizModel.aggregate(pipeline);
      let data = quizDetails?.[0];

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully created the quiz",
        data
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

  // async getQuizByIdStudent(req, res) {
  //   //  student will get the quizes from quizzesAssignment collection
  //   try {
  //     insertInLog(req?.originalUrl, req.query, req.params, req.body);
  //     const validation = validationResult(req).array();
  //     if (validation.length > 0) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.UNPROCESSABLE_ENTITY,
  //         "Failed to get quiz",
  //         validation
  //       );
  //     }
  //     const { quizId } = req.params;
  //     const { studentRef } = req.body;

  //     const quizFind = await QuizModel.findById({ _id: quizId });
  //     // .populate(
  //     //   "courseRef",
  //     //   "title teacherRef"
  //     // );
  //     // console.log(quizFind);
  //     if (!quizFind) {
  //       return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
  //     }

  //     // const teacherFind = await TeacherModel.findById({ _id: studentRef });
  //     // if (!teacherFind) {
  //     //   return sendResponse(
  //     //     res,
  //     //     HTTP_STATUS.NOT_FOUND,
  //     //     "Teacher does not exist"
  //     //   );
  //     // }
  //     // //   console.log(teacherFind);
  //     // //check if teacher have access to this coure
  //     // if (!teacherFind?.coursesRef?.includes(quizFind?.courseRef)) {
  //     //   return sendResponse(
  //     //     res,
  //     //     HTTP_STATUS.FORBIDDEN,
  //     //     "You are not the teacher for this course"
  //     //   );
  //     // }

  //     return sendResponse(
  //       res,
  //       HTTP_STATUS.OK,
  //       "Successfully created the quiz",
  //       quizFind
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return sendResponse(
  //       res,
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR,
  //       "Internal server error"
  //     );
  //   }
  // }

  async getQuizByCourseIdTeacher(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get quiz",
          validation
        );
      }
      const { courseId } = req.params;
      const { teacherRef } = req.body;

      console.log(courseId);

      const courseFind = await CourseModel.findById({ _id: courseId });

      // console.log(quizFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const teacherFind = await TeacherModel.findById({ _id: teacherRef });
      if (!teacherFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Teacher does not exist"
        );
      }
      //   console.log(teacherFind);
      //check if teacher have access to this coure
      if (!teacherFind?.coursesRef?.includes(courseId)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      const quizzes = await QuizModel.find({ courseRef: courseId });

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the quizzes",
        quizzes
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

  async updateQuizByIdTeacher(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get quiz",
          validation
        );
      }
      const { quizId } = req.params;
      const {
        title,
        durationInMinute,
        isPublishByTeacher,
        courseRef,
        teacherRef,
      } = req.body;

      const quizFind = await QuizModel.findById({ _id: quizId });
      if (!quizFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
      }

      const teacherFind = await TeacherModel.findById({ _id: teacherRef });
      if (!teacherFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Teacher does not exist"
        );
      }
      //   console.log(teacherFind);
      //check if teacher have access to this coure
      if (!teacherFind?.coursesRef?.includes(quizFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      const quizUpdate = await QuizModel.updateOne(
        { _id: quizId },
        { $set: { title, durationInMinute, isPublishByTeacher } }
      );

      return sendResponse(res, HTTP_STATUS.OK, "Successfully updated the quiz");
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async sortQuiz(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create Module",
          validation
        );
      }
      //  can be passed here
      const { quizSort, courseRef, teacherRef } = req.body;

      const courseFind = await CourseModel.findOne({
        _id: courseRef,
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
      if (!teacherFind?.coursesRef?.includes(courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      const bulk = [];
      quizSort?.map((element) => {
        // console.log("element ", element);
        bulk.push({
          updateOne: {
            filter: { _id: element?.id },
            update: { $set: { quizPos: element?.pos } },
          },
        });
      });

      const quizSortResult = await QuizModel.bulkWrite(bulk);
      // console.log(quizSortResult);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully sorted the quizzes"
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

  async completeQuiz(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to complete quiz",
          validation
        );
      }
      const { studentRef, quizRef } = req.body;

      const quizFind = await QuizModel.findOne({
        _id: quizRef,
      });
      // console.log("contentFind ", contentFind);
      if (!quizFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
      }

      const studentFind = await StudentModel.findOne({
        _id: studentRef,
      });
      // console.log("studentFind ", studentFind);
      if (!studentFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Student is not found");
      }

      //check if student have access to this coure
      if (
        !studentFind.enrolledCoursesRef.includes(quizFind?.courseRef) &&
        !studentFind.completedCoursesRef.includes(quizFind?.courseRef)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      await ProgressModel.updateOne(
        { studentRef: studentRef, courseRef: quizFind?.courseRef },
        { $addToSet: { completedQuizzessRef: quizRef } }
      );

      return sendResponse(res, HTTP_STATUS.OK, "Successfully completed quiz");
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
module.exports = new QuizController();
