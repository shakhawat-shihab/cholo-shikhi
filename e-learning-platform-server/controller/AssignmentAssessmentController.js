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
const QuizAssessmentModel = require("../model/Assesment/QuizAssessment");
const AssignmentModel = require("../model/Assesment/Assignment");
const AssignmentAssessmentModel = require("../model/Assesment/AssignmentAssessment");
const { uploadFileAws } = require("../util/awsMethod");
const MarksModel = require("../model/Assesment/Marks");
const NotificationModel = require("../model/User/Notification");
const ProgressModel = require("../model/User/Progress");
const { pipeline } = require("nodemailer/lib/xoauth2");

class AssignmentAssessmentController {
  async createAssignmentAssessment(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create assignment",
          validation
        );
      }
      const { studentRef, assignmentRef } = req.body;

      const assignmentFind = await AssignmentModel.findById({
        _id: assignmentRef,
      });
      //   console.log("assignmentFind ", assignmentFind);
      if (!assignmentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Assignment is not found"
        );
      }

      const studentFind = await StudentModel.findById({ _id: studentRef });
      if (!studentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Student does not exist"
        );
      }
      //   console.log(studentFind);
      //check if student have access to this coure
      if (
        !studentFind?.enrolledCoursesRef?.includes(assignmentFind?.courseRef)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      const assignmentAssessment = await AssignmentAssessmentModel.findOne({
        assignmentRef: assignmentRef,
        studentRef: studentRef,
      });

      const startTime = new Date();
      const endTime = new Date(
        startTime.getTime() +
          assignmentFind?.durationInDay * 24 * 60 * 60 * 1000
      );

      //create assignment assessment if not exist
      if (!assignmentAssessment) {
        await AssignmentAssessmentModel.create({
          assignmentRef: assignmentRef,
          studentRef: studentRef,
          courseRef: assignmentFind?.courseRef,
          startTime: startTime,
          endTime: endTime,
        });
      }
      // update if previously exist
      else {
        if (assignmentAssessment?.status == "passed") {
          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "You are already passed in this assignment"
          );
        }
        const timestamp1 = new Date();
        const timestamp2 = new Date(assignmentAssessment?.endTime);
        // Calculate the time difference in milliseconds
        const timeDifferenceInMilliseconds = timestamp2 - timestamp1;
        // Convert the time difference to minute
        const timeDifference =
          timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
        // console.log(timeDifference);
        if (timeDifference > 0) {
          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "Assignment is running"
          );
        }
        // console.log("endTime", endTime);
        await AssignmentAssessmentModel.updateOne(
          { assignmentRef: assignmentRef, studentRef: studentRef },
          {
            $set: {
              startTime,
              endTime,
              marksObtained: 0,
              documentUrl: "",
              link: "",
            },
          }
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully started the assignment"
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

  async submitAssignment(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get assignment",
          validation
        );
      }
      let { studentRef, assignmentRef, link } = req.body;

      const assignmentFind = await AssignmentModel.findById({
        _id: assignmentRef,
      });
      //   console.log("assignmentFind ", assignmentFind);
      if (!assignmentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Assignment is not found"
        );
      }

      const studentFind = await StudentModel.findById({ _id: studentRef });
      if (!studentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Student does not exist"
        );
      }
      //   console.log(studentFind);
      //check if student have access to this coure
      if (
        !studentFind?.enrolledCoursesRef?.includes(assignmentFind?.courseRef)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      // const assignmentAssessment = await AssignmentAssessmentModel.findOne({
      //   assignmentRef: assignmentRef,
      //   studentRef: studentRef,
      // });

      // console.log(quizAssessment);
      // if (!assignmentAssessment) {
      //   return sendResponse(
      //     res,
      //     HTTP_STATUS.FORBIDDEN,
      //     "Start the assignment first"
      //   );
      // }

      //check if assignment is running
      // const timestamp1 = new Date();
      // const timestamp2 = new Date(assignmentAssessment?.endTime);
      // const timeDifferenceInMilliseconds = timestamp2 - timestamp1;
      // const timeDifference =
      //   timeDifferenceInMilliseconds / (24 * 60 * 60 * 1000);
      // // console.log(timeDifference);
      // if (timeDifference < 0) {
      //   return sendResponse(res, HTTP_STATUS.FORBIDDEN, "Sorry Time Over");
      // }

      //upload file
      let url;
      if (req.file) {
        url = await uploadFileAws(req.file, `assignments/${studentRef}`);
      }

      console.log(url);
      let currentTime = new Date();

      //submit assignment
      await AssignmentAssessmentModel.updateOne(
        { assignmentRef: assignmentRef, studentRef: studentRef },
        {
          $set: {
            link: link,
            documentUrl: url,
            endTime: currentTime,
            status: "pending",
          },
        },
        {
          upsert: true,
        }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully submitted the assignment"
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

  async getPendingAssignment(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to load assignment",
          validation
        );
      }
      let { teacherRef, assignmentRef } = req.body;

      const assignmentFind = await AssignmentModel.findById({
        _id: assignmentRef,
      });
      //   console.log("assignmentFind ", assignmentFind);
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
          "teacher does not exist"
        );
      }
      //   console.log(studentFind);
      //check if student have access to this coure
      if (!teacherFind?.coursesRef?.includes(assignmentFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      // const allPendingAssignment = await AssignmentAssessmentModel.find({
      //   assignmentRef: assignmentRef,
      //   status: "pending",
      // });

      let pipeline = [
        {
          $match: {
            assignmentRef: new ObjectId(assignmentRef),
            status: "pending",
          },
        },
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
        {
          $lookup: {
            from: "users",
            localField: "studentDetails.userRef",
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
          $project: {
            documentUrl: 1,
            endTime: 1,
            studentImage: "$userDetails.image",
            studentUserName: "$userDetails.userName",
            userId: "$userDetails._id",
            studentId: "$studentDetails._id",
          },
        },
      ];

      const allPendingAssignment = await AssignmentAssessmentModel.aggregate(
        pipeline
      );

      // console.log(quizAssessment);
      if (!allPendingAssignment || allPendingAssignment?.length == 0) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND);
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the assignment",
        allPendingAssignment
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

  async assignMarksToAssignment(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to assign marks to assignment",
          validation
        );
      }
      let { teacherRef, assignmentRef, studentRef, marks } = req.body;

      const studentFind = await StudentModel.findById({
        _id: studentRef,
      });
      //   console.log("studentFind ", studentFind);
      if (!studentFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Student is not found");
      }

      const assignmentFind = await AssignmentModel.findById({
        _id: assignmentRef,
      });
      //   console.log("assignmentFind ", assignmentFind);
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
          "teacher does not exist"
        );
      }
      //   console.log(studentFind);
      //check if student have access to this coure
      if (!teacherFind?.coursesRef?.includes(assignmentFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }

      let total = assignmentFind?.total;
      let percentageObtained = parseFloat(((marks / total) * 100).toFixed(2));
      console.log(total, percentageObtained);
      console.log(marks);
      if (percentageObtained <= assignmentFind?.passMarkPercentage) {
        await AssignmentAssessmentModel.updateOne(
          {
            assignmentRef: assignmentRef,
            studentRef: studentRef,
          },
          {
            $set: {
              status: "failed",
              marksObtained: marks,
            },
          }
        );
      } else {
        // console.log("Pass korc");
        await AssignmentAssessmentModel.updateOne(
          {
            assignmentRef: assignmentRef,
            studentRef: studentRef,
          },
          {
            $set: {
              status: "passed",
              marksObtained: marks,
            },
          }
        );
        // console.log("Pass korc ", assignmentRef);
        let findMarks = await MarksModel.findOne({
          courseRef: assignmentFind?.courseRef,
          studentRef: studentRef,
        });

        // console.log("findMarks ", findMarks);

        // no marks entry exist for this course
        if (!findMarks) {
          let newlyMarks = await MarksModel.create({
            courseRef: assignmentFind?.courseRef,
            studentRef: studentRef,
            assignmentsRef: [
              { assignmentRef: assignmentRef, marksObtained: marks },
            ],
          });
          // console.log("newlyMarks ", newlyMarks);
        }
        // already have marks entry
        else {
          const index = findMarks?.assignmentsRef?.findIndex(
            (x) => x.assignmentRef.toString() == assignmentRef
          );
          // console.log("index ", index);
          // the course already exist in marks
          if (index != -1) {
            await MarksModel.updateOne(
              {
                courseRef: assignmentFind?.courseRef,
                studentRef: studentRef,
                "assignmentsRef.assignmentRef": assignmentRef,
              },
              {
                $set: {
                  "assignmentsRef.$.marksObtained": marks,
                },
              }
            );
          } else {
            await MarksModel.updateOne(
              {
                courseRef: assignmentFind?.courseRef,
                studentRef: studentRef,
              },
              {
                $push: {
                  assignmentsRef: {
                    assignmentRef: assignmentRef,
                    marksObtained: marks,
                  },
                },
              }
            );
          }
        }

        await ProgressModel.updateOne(
          { courseRef: assignmentFind?.courseRef, studentRef: studentRef },
          {
            $set: {
              courseRef: assignmentFind?.courseRef,
              studentRef: studentRef,
            },
            $addToSet: {
              completedAssignmentsRef: assignmentFind?._id,
            },
          },
          {
            upsert: true,
          }
        );
      }

      await NotificationModel.updateOne(
        {
          userRef: studentFind?.userRef,
        },
        {
          $set: {
            userRef: studentFind?.userRef,
          },
          $push: {
            notifications: {
              content: `You got ${marks} in ${assignmentFind?.title}.`,
              time: new Date(),
            },
          },
        },
        {
          upsert: true,
        }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully assigned the marks"
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

  async getMyAssessment(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to load assignment",
          validation
        );
      }
      const { studentRef, assignmentRef } = req.body;

      const assesmentFind = await AssignmentAssessmentModel.findOne({
        assignmentRef: assignmentRef,
        studentRef: studentRef,
      });

      const studentFind = await StudentModel.findById({ _id: studentRef });
      if (!studentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Student does not exist"
        );
      }

      // dekhte hobe pass korse kina
      const assignment = await AssignmentModel.findOne({
        _id: assignmentRef,
      });

      console.log("assignment ", assignment);

      let assignmentData = {};
      if (assesmentFind) {
        assignmentData.isTried = true;
        // if (new Date(quizAssessment.endTime) > Date.now()) {
        //   assignmentData.isRunning = true;
        // }
        assignmentData.status = assesmentFind.status;
        assignmentData.percentage = assesmentFind.percentage;
      } else {
        assignmentData.isTried = false;
        // assignmentData.status = "pending";
      }
      assignmentData.passMarkPercentage = assignment.passMarkPercentage;
      assignmentData.total = assignment.total;

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Loaded the assessment Info",
        assignmentData
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
module.exports = new AssignmentAssessmentController();
