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
const AssignmentModel = require("../model/Assesment/Assignment");
const { uploadFileAws } = require("../util/awsMethod");
const ProgressModel = require("../model/User/Progress");

class AssignmentController {
  async createAssignment(req, res) {
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
        description,
        isPublishByTeacher,
        courseRef,
        moduleRef,
        teacherRef,
        passMarkPercentage,
        total,
      } = req.body;

      console.log(req.body);

      const courseFind = await CourseModel.findById({ _id: courseRef });
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      // console.log(courseFind);

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

      //upload file
      let url;
      if (req.file) {
        url = await uploadFileAws(
          req.file,
          `study_materials/${moduleRef}/assignments`
        );
      }

      const assignmentResult = await AssignmentModel.create({
        title,
        description,
        isPublishByTeacher,
        documentUrl: url,
        courseRef,
        moduleRef,
        teacherRef,
        passMarkPercentage,
        total,
      });

      if (!assignmentResult?._id) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create assignment"
        );
      }
      const addQuizRefToModule = await ModuleModel.updateOne(
        {
          _id: moduleRef,
        },
        {
          $push: { assignmentsRef: assignmentResult?._id },
        }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully created the assignment",
        assignmentResult
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

  async getAssignmentByIdTeacher(req, res) {
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
      const { assignmentId } = req.params;
      const { teacherRef } = req.body;

      const assignmentFind = await AssignmentModel.findById({
        _id: assignmentId,
      });
      // console.log(assignmentFind);
      if (!assignmentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Assignment is not found"
        );
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
      if (!teacherFind?.coursesRef?.includes(assignmentFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully load the assignment",
        assignmentFind
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

  async getAssignmentById(req, res) {
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
      const { assignmentId } = req.params;

      const assignmentFind = await AssignmentModel.findById({
        _id: assignmentId,
      });
      // console.log(assignmentFind);
      if (!assignmentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Assignment is not found"
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully load the assignment",
        assignmentFind
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

  async updateAssignmentByIdTeacher(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to uodate assignment",
          validation
        );
      }
      const { assignmentId } = req.params;
      const { title, description, isPublishByTeacher, teacherRef, file } =
        req.body;

      console.log("req.body", req.body);
      console.log("title ", title);

      const assignmentFind = await AssignmentModel.findById({
        _id: assignmentId,
      });
      // console.log(assignmentFind);
      if (!assignmentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Assignment is not found"
        );
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
      if (!teacherFind?.coursesRef?.includes(assignmentFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      //upload file
      let url;
      if (req.file) {
        url = await uploadFileAws(
          req.file,
          `study_materials/${assignmentFind?.moduleRef}/assignments`
        );
      }
      // console.log(url);

      const assignmentResult = await AssignmentModel.updateOne(
        { _id: assignmentId },
        {
          $set: {
            title: title,
            description: description,
            isPublishByTeacher: isPublishByTeacher,
            documentUrl: url,
          },
        }
      );

      // console.log(assignmentResult);

      if (assignmentResult?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully updated the assignment"
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to updated the assignment"
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

  // async updateQuizByIdTeacher(req, res) {
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
  //     const {
  //       title,
  //       durationInMinute,
  //       isPublishByTeacher,
  //       courseRef,
  //       teacherRef,
  //     } = req.body;

  //     const quizFind = await QuizModel.findById({ _id: quizId });
  //     if (!quizFind) {
  //       return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
  //     }

  //     const teacherFind = await TeacherModel.findById({ _id: teacherRef });
  //     if (!teacherFind) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.NOT_FOUND,
  //         "Teacher does not exist"
  //       );
  //     }
  //     //   console.log(teacherFind);
  //     //check if teacher have access to this coure
  //     if (!teacherFind?.coursesRef?.includes(quizFind?.courseRef)) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.FORBIDDEN,
  //         "You are not the teacher for this course"
  //       );
  //     }

  //     const quizUpdate = await QuizModel.updateOne(
  //       { _id: quizId },
  //       { $set: { title, durationInMinute, isPublishByTeacher } }
  //     );

  //     return sendResponse(res, HTTP_STATUS.OK, "Successfully updated the quiz");
  //   } catch (error) {
  //     console.log(error);
  //     return sendResponse(
  //       res,
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR,
  //       "Internal server error"
  //     );
  //   }
  // }

  async sortAssignment(req, res) {
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
      const { assignmentSort, courseRef, teacherRef } = req.body;

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
      assignmentSort?.map((element) => {
        // console.log("element ", element);
        bulk.push({
          updateOne: {
            filter: { _id: element?.id },
            update: { $set: { assignmentPos: element?.pos } },
          },
        });
      });

      const assignmentSortResult = await AssignmentModel.bulkWrite(bulk);
      // console.log(assignmentSortResult);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully sorted the assignments"
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

  async completeAssignment(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to complete assignment",
          validation
        );
      }
      const { studentRef, assignmentRef } = req.body;

      const assesmentFind = await AssignmentModel.findOne({
        _id: assignmentRef,
      });
      console.log("assesmentFind ", assesmentFind);
      if (!assesmentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Assignment is not found"
        );
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
        !studentFind.enrolledCoursesRef.includes(assesmentFind?.courseRef) &&
        !studentFind.completedCoursesRef.includes(assesmentFind?.courseRef)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      await ProgressModel.updateOne(
        { studentRef: studentRef, courseRef: assesmentFind?.courseRef },
        { $addToSet: { completedAssignmentsRef: assignmentRef } }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully completed assignment"
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

  async getAssignmentByCourseId(req, res) {
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

      const assignmentFind = await AssignmentModel.find({
        courseRef: courseId,
      }).select("title _id");

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully load all the  assignment of a course",
        assignmentFind
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
module.exports = new AssignmentController();
