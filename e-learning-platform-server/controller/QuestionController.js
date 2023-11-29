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
const QuestionModel = require("../model/Assesment/Question");

class QuizController {
  async createQuestion(req, res) {
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
      const { quizRef, teacherRef, question, options, correctAns } = req.body;

      console.log(req.body);

      const quizFind = await QuizModel.findById({ _id: quizRef });
      console.log("quizFind ", quizFind);
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

      const questionResult = await QuestionModel.create({
        quizRef,
        question,
        options,
        correctAns,
      });

      if (!questionResult?._id) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create question"
        );
      }
      const addQuestionRefToQuiz = await QuizModel.updateOne(
        {
          _id: quizRef,
        },
        {
          $push: { questionsRef: questionResult?._id },
        }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully created the quiz",
        questionResult
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

  async getQuestionByIdTeacher(req, res) {
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
      const { questionId } = req.params;
      const { teacherRef } = req.body;

      const questonFind = await QuestionModel.findById({
        _id: questionId,
      }).populate("courseRef", "title teacherRef");
      console.log("questonFind ", questonFind);
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

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the quiz",
        quizFind
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

  async updateQuestionByIdTeacher(req, res) {
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
      const { questionId } = req.params;
      const { teacherRef, question, options, correctAns } = req.body;

      // console.log(req.body);

      const quizFind = await QuestionModel.findById({
        _id: questionId,
      }).populate("quizRef", "title teacherRef");

      // console.log("quizFind ", quizFind);

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
      // console.log("teacherFind ", teacherFind);

      //check if teacher have access to this coure
      if (quizFind?.quizRef?.teacherRef != teacherRef) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      // console.log("all done ");

      const questionUpdateResult = await QuestionModel.updateOne(
        { _id: questionId },
        { $set: { question, options, correctAns } }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully updated the question",
        questionUpdateResult
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
module.exports = new QuizController();
