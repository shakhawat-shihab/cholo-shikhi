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
const ProgressModel = require("../model/User/Progress");

const { ObjectId } = mongoose.Types;

class ModuleController {
  async getModulesByStudent(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Module can't be loaded",
          validation
        );
      }

      const { courseId } = req.params;
      const { studentRef } = req.body;

      // check if course exist
      const courseFind = await CourseModel.findOne({
        _id: courseId,
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
      //check if student have access to this coure
      if (
        !studentFind?.enrolledCoursesRef?.includes(courseId) &&
        !studentFind?.completedCoursesRef?.includes(courseId)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not enrolled to this course"
        );
      }

      let modules;

      // if the course is in completedCoursesRef then return all modules
      if (studentFind?.completedCoursesRef?.includes(courseId)) {
        /*********************************************************** */
        /* ekane aggregation use kore module er sb content ante hobe */
        modules = await ModuleModel.find({ courseRef: courseId });
      }
      // if the course is in enrolledCoursesRef then return the modules which is running and completed (from progress collection)
      else if (studentFind?.enrolledCoursesRef?.includes(courseId)) {
        // let pipeline = [
        //   {
        //     $match: {
        //       courseRef: new mongoose.Types.ObjectId(courseId),
        //     },
        //   },

        //   // contents populating starts here
        //   {
        //     $lookup: {
        //       from: "contents",
        //       localField: "contentsRef",
        //       foreignField: "_id",
        //       as: "contents",
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: "$contents",
        //       preserveNullAndEmptyArrays: true,
        //     },
        //   },
        //   {
        //     $sort: {
        //       "contents.contentPos": 1,
        //       "contents.createdAt": 1,
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: "$_id",
        //       // createdAt: { $first: "$createdAt" },
        //       contents: { $push: "$contents" },
        //       modulePos: { $first: "$modulePos" },
        //       title: { $first: "$title" },
        //       description: { $first: "$description" },
        //       quizzes: { $first: "$quizzesRef" },
        //       assignments: { $first: "$assignmentsRef" },
        //     },
        //   },
        //   // contents populating ends here

        //   //quiz populating starts
        //   {
        //     $lookup: {
        //       from: "quizzes",
        //       localField: "quizzes",
        //       foreignField: "_id",
        //       as: "quizzesDetails",
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: "$quizzesDetails",
        //       preserveNullAndEmptyArrays: true,
        //     },
        //   },
        //   {
        //     $sort: {
        //       "quizzesDetails.quizPos": 1,
        //       "quizzesDetails.createdAt": 1,
        //     },
        //   },

        //   {
        //     $group: {
        //       _id: "$_id",
        //       contents: { $first: "$contents" },
        //       title: { $first: "$title" },
        //       modulePos: { $first: "$modulePos" },
        //       description: { $first: "$description" },
        //       quizzes: { $push: "$quizzesDetails" },
        //       assignments: { $first: "$assignments" },
        //     },
        //   },
        //   //quiz populating ends

        //   //assignments populating starts
        //   {
        //     $lookup: {
        //       from: "assignments",
        //       localField: "assignments",
        //       foreignField: "_id",
        //       as: "assignmentDetails",
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: "$assignmentDetails",
        //       preserveNullAndEmptyArrays: true,
        //     },
        //   },
        //   {
        //     $sort: {
        //       "assignmentDetails.assignmentPos": 1,
        //       "assignmentDetails.createdAt": 1,
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: "$_id",
        //       contents: { $first: "$contents" },
        //       title: { $first: "$title" },
        //       modulePos: { $first: "$modulePos" },
        //       description: { $first: "$description" },
        //       quizzes: { $first: "$quizzes" },
        //       assignments: { $push: "$assignmentDetails" },
        //     },
        //   },
        //   //assignments populating ends

        //   // project all
        //   {
        //     $project: {
        //       title: 1,
        //       description: 1,
        //       modulePos: 1,
        //       "contents._id": 1,
        //       "contents.title": 1,
        //       "contents.description": 1,
        //       "contents.type": 1,
        //       "contents.isPremium": 1,
        //       "contents.contentPos": 1,
        //       "contents.textContentRef": 1,
        //       "contents.videoContentRef": 1,
        //       "contents.documentContentRef": 1,
        //       //quizzes
        //       "quizzes._id": 1,
        //       "quizzes.title": 1,
        //       "quizzes.description": 1,
        //       "quizzes.durationInMinute": 1,

        //       //assignments
        //       "assignments._id": 1,
        //       "assignments.title": 1,
        //       "assignments.description": 1,
        //       "assignments.durationInDay": 1,
        //       "assignments.total": 1,
        //       assignmentsRef: 1,
        //       quizzesRef: 1,
        //     },
        //   },
        //   {
        //     $sort: {
        //       modulePos: 1,
        //       createdAt: 1,
        //     },
        //   },
        // ];

        let pipeline = [
          {
            $match: {
              courseRef: new mongoose.Types.ObjectId(courseId),
            },
          },

          // contents populating starts here
          {
            $lookup: {
              from: "contents",
              localField: "contentsRef",
              foreignField: "_id",
              as: "contents",
            },
          },
          {
            $unwind: {
              path: "$contents",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "textcontents",
              localField: "contents.textContentRef",
              foreignField: "_id",
              as: "textContentDetails",
            },
          },
          {
            $unwind: {
              path: "$textContentDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "documentcontents",
              localField: "contents.documentContentRef",
              foreignField: "_id",
              as: "documentContentDetails",
            },
          },
          {
            $unwind: {
              path: "$documentContentDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "videocontents",
              localField: "contents.videoContentRef",
              foreignField: "_id",
              as: "videoContentDetails",
            },
          },
          {
            $unwind: {
              path: "$videoContentDetails",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              title: 1,
              description: 1,
              createdAt: 1,
              modulePos: 1,
              "contents._id": 1,
              "contents.title": 1,
              "contents.description": 1,
              "contents.type": 1,
              "contents.isPremium": 1,
              "contents.contentPos": 1,
              "contents.textContentDetails": "$textContentDetails",
              "contents.videoContentDetails": "$videoContentDetails",
              "contents.documentContentDetails": "$documentContentDetails",

              assignmentsRef: 1,
              quizzesRef: 1,
            },
          },
          {
            $sort: {
              "contents.contentPos": 1,
            },
          },

          {
            $group: {
              _id: "$_id",
              contents: { $push: "$contents" },
              modulePos: { $first: "$modulePos" },
              title: { $first: "$title" },
              createdAt: { $first: "$createdAt" },
              description: { $first: "$description" },
              quizzes: { $first: "$quizzesRef" },
              assignments: { $first: "$assignmentsRef" },
            },
          },

          // contents populating ends here

          //quiz populating starts
          {
            $lookup: {
              from: "quizzes",
              localField: "quizzes",
              foreignField: "_id",
              as: "quizzesDetails",
            },
          },
          {
            $unwind: {
              path: "$quizzesDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: {
              "quizzesDetails.quizPos": 1,
            },
          },
          {
            $group: {
              _id: "$_id",
              contents: { $first: "$contents" },
              title: { $first: "$title" },
              createdAt: { $first: "$createdAt" },
              modulePos: { $first: "$modulePos" },
              description: { $first: "$description" },
              quizzes: { $push: "$quizzesDetails" },
              assignments: { $first: "$assignments" },
            },
          },
          //quiz populating ends

          //assignments populating starts
          {
            $lookup: {
              from: "assignments",
              localField: "assignments",
              foreignField: "_id",
              as: "assignmentDetails",
            },
          },
          {
            $unwind: {
              path: "$assignmentDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: {
              "assignmentDetails.assignmentPos": 1,
            },
          },
          {
            $group: {
              _id: "$_id",
              contents: { $first: "$contents" },
              title: { $first: "$title" },
              createdAt: { $first: "$createdAt" },
              modulePos: { $first: "$modulePos" },
              description: { $first: "$description" },
              quizzes: { $first: "$quizzes" },
              assignments: { $push: "$assignmentDetails" },
            },
          },
          //assignments populating ends

          {
            $sort: {
              modulePos: 1,
              createdAt: 1,
            },
          },
        ];

        modules = await ModuleModel.aggregate(pipeline);

        let progress = await ProgressModel.findOne({
          studentRef: studentRef,
          courseRef: courseId,
        });
        // console.log("progress ", progress?.completedModulesRef);
        // console.log("modules ", modules);

        if (progress) {
          // modules = modules.toObject();
          // console.log("modules ", modules);
          let firstIncompleteModule = true;
          modules = modules.map((module) => {
            //check for modules
            if (
              !progress?.completedModulesRef?.includes(module?._id)
              // ||
              // firstIncompleteModule
            ) {
              module.notCompleted = true;
              if (firstIncompleteModule == true) {
                console.log("firstIncompleteModule ", module?._id);
                module.isRunning = true;
                // check for contents
                let firstIncompleteContent = true;
                module.contents = module?.contents?.map((content) => {
                  if (
                    !progress?.completedContentsRef?.includes(content?._id)
                    // ||
                    // firstIncompleteContent
                  ) {
                    content.notCompleted = true;
                    if (firstIncompleteContent == true) {
                      console.log("firstIncompleteContent ", content?._id);
                      content.isRunning = true;
                    }
                    firstIncompleteContent = false;
                    return content;
                  } else {
                    return content;
                  }
                });

                // check for quizzes
                let firstIncompleteQuiz = true;

                module.quizzes = module?.quizzes?.map((quiz) => {
                  if (
                    !progress?.completedQuizzesRef?.includes(quiz?._id)
                    // ||
                    // firstIncompleteQuiz
                  ) {
                    console.log("quiz?.id------ ", quiz?._id);
                    quiz.notCompleted = true;
                    if (firstIncompleteQuiz == true) {
                      console.log("firstIncompleteQuiz ", quiz?._id);
                      quiz.isRunning = true;
                    }
                    firstIncompleteQuiz = false;
                    return quiz;
                  } else {
                    return quiz;
                  }
                });

                // console.log(
                //   "progress?.completedAssignmentsRef ",
                //   progress?.completedAssignmentsRef
                // );
                // check for assignments
                let firstIncompleteAssignment = true;
                module.assignments = module?.assignments?.map((assignment) => {
                  // console.log(
                  //   "for eveery assignment?.id------ ",
                  //   assignment?._id
                  // );
                  if (
                    !progress?.completedAssignmentsRef?.includes(
                      assignment?._id
                    )
                    // ||
                    // firstIncompleteAssignment
                  ) {
                    assignment.notCompleted = true;
                    // console.log("if not exist in progress", assignment?._id);
                    if (firstIncompleteAssignment == true) {
                      // console.log(
                      //   "firstIncompleteAssignmentQuiz ",
                      //   assignment?._id
                      // );
                      assignment.isRunning = true;
                    }
                    firstIncompleteAssignment = false;
                    return assignment;
                  } else {
                    return assignment;
                  }
                });
              }
              firstIncompleteModule = false;
              return module;
            } else {
              return module;
            }
          });
        }
        // if progress not found then return same data as admin
        // else {
        // }
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the modules",
        modules
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

  async completeModule(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Module can't be loaded",
          validation
        );
      }

      const { studentRef, moduleRef } = req.body;

      // check if course exist
      const moduleFind = await ModuleModel.findOne({
        _id: moduleRef,
      });
      // console.log("courseFind ", courseFind);
      if (!moduleFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Module is not found");
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
        !studentFind?.enrolledCoursesRef?.includes(moduleFind?.courseRef) &&
        !studentFind?.completedCoursesRef?.includes(moduleFind?.courseRef)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not enrolled to this course"
        );
      }

      await ProgressModel.updateOne(
        { studentRef: studentRef, courseRef: moduleFind?.courseRef },
        { $addToSet: { completedModulesRef: moduleRef } }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully completed the modules"
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

  async getAllModulesByTeacher(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Module can't be loaded",
          validation
        );
      }

      const { courseId } = req.params;
      const { teacherRef } = req.body;
      const { allInformation } = req.query;

      // check if course exist
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

      let pipeline = [
        {
          $match: {
            courseRef: new mongoose.Types.ObjectId(courseId),
          },
        },

        // contents populating starts here
        {
          $lookup: {
            from: "contents",
            localField: "contentsRef",
            foreignField: "_id",
            as: "contents",
          },
        },
        {
          $unwind: {
            path: "$contents",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "textcontents",
            localField: "contents.textContentRef",
            foreignField: "_id",
            as: "textContentDetails",
          },
        },
        {
          $unwind: {
            path: "$textContentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "documentcontents",
            localField: "contents.documentContentRef",
            foreignField: "_id",
            as: "documentContentDetails",
          },
        },
        {
          $unwind: {
            path: "$documentContentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "videocontents",
            localField: "contents.videoContentRef",
            foreignField: "_id",
            as: "videoContentDetails",
          },
        },
        {
          $unwind: {
            path: "$videoContentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            title: 1,
            description: 1,
            createdAt: 1,
            modulePos: 1,
            "contents.title": 1,
            "contents.description": 1,
            "contents.type": 1,
            "contents.isPremium": 1,
            "contents.contentPos": 1,
            "contents.textContentDetails": "$textContentDetails",
            "contents.videoContentDetails": "$videoContentDetails",
            "contents.documentContentDetails": "$documentContentDetails",

            assignmentsRef: 1,
            quizzesRef: 1,
          },
        },
        {
          $sort: {
            "contents.contentPos": 1,
          },
        },

        {
          $group: {
            _id: "$_id",
            contents: { $push: "$contents" },
            modulePos: { $first: "$modulePos" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            description: { $first: "$description" },
            quizzes: { $first: "$quizzesRef" },
            assignments: { $first: "$assignmentsRef" },
          },
        },

        // contents populating ends here

        //quiz populating starts
        {
          $lookup: {
            from: "quizzes",
            localField: "quizzes",
            foreignField: "_id",
            as: "quizzesDetails",
          },
        },
        {
          $unwind: {
            path: "$quizzesDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "quizzesDetails.quizPos": 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            contents: { $first: "$contents" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            modulePos: { $first: "$modulePos" },
            description: { $first: "$description" },
            quizzes: { $push: "$quizzesDetails" },
            assignments: { $first: "$assignments" },
          },
        },
        //quiz populating ends

        //assignments populating starts
        {
          $lookup: {
            from: "assignments",
            localField: "assignments",
            foreignField: "_id",
            as: "assignmentDetails",
          },
        },
        {
          $unwind: {
            path: "$assignmentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "assignmentDetails.assignmentPos": 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            contents: { $first: "$contents" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            modulePos: { $first: "$modulePos" },
            description: { $first: "$description" },
            quizzes: { $first: "$quizzes" },
            assignments: { $push: "$assignmentDetails" },
          },
        },
        //assignments populating ends

        {
          $sort: {
            modulePos: 1,
            createdAt: 1,
          },
        },
      ];

      /*********************************************************** */
      /* ekane aggregation use kore module er sb content ante hobe */
      // let modules = await ModuleModel.find({ courseRef: courseId });
      let modules = await ModuleModel.aggregate(pipeline);

      console.log("allInformation ", allInformation);
      if (allInformation == 0) {
        // module.toObject();
        // delete module.content;

        modules = modules.map((x) => {
          // console.log(x);
          delete x.contents;
          delete x.quizzes;
          delete x.assignments;
          return x;
        });
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the modules",
        modules
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

  async getModulesByGeneralUser(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Module can't be loaded",
          validation
        );
      }

      const { courseId } = req.params;
      const { allInformation } = req.query;

      // check if course exist
      const courseFind = await CourseModel.findOne({
        _id: courseId,
      });
      // console.log("courseFind ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      let pipeline = [
        {
          $match: {
            courseRef: new mongoose.Types.ObjectId(courseId),
          },
        },

        // contents populating starts here
        {
          $lookup: {
            from: "contents",
            localField: "contentsRef",
            foreignField: "_id",
            as: "contents",
          },
        },
        {
          $unwind: {
            path: "$contents",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "textcontents",
            localField: "contents.textContentRef",
            foreignField: "_id",
            as: "textContentDetails",
          },
        },
        {
          $unwind: {
            path: "$textContentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "documentcontents",
            localField: "contents.documentContentRef",
            foreignField: "_id",
            as: "documentContentDetails",
          },
        },
        {
          $unwind: {
            path: "$documentContentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "videocontents",
            localField: "contents.videoContentRef",
            foreignField: "_id",
            as: "videoContentDetails",
          },
        },
        {
          $unwind: {
            path: "$videoContentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            title: 1,
            description: 1,
            createdAt: 1,
            modulePos: 1,
            "contents._id": 1,
            "contents.title": 1,
            "contents.description": 1,
            "contents.type": 1,
            "contents.isPremium": 1,
            "contents.contentPos": 1,
            "contents.textContentDetails": "$textContentDetails",
            "contents.videoContentDetails": "$videoContentDetails",
            "contents.documentContentDetails": "$documentContentDetails",

            assignmentsRef: 1,
            quizzesRef: 1,
          },
        },
        {
          $sort: {
            "contents.contentPos": 1,
          },
        },

        {
          $group: {
            _id: "$_id",
            contents: { $push: "$contents" },
            modulePos: { $first: "$modulePos" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            description: { $first: "$description" },
            quizzes: { $first: "$quizzesRef" },
            assignments: { $first: "$assignmentsRef" },
          },
        },

        // contents populating ends here

        //quiz populating starts
        {
          $lookup: {
            from: "quizzes",
            localField: "quizzes",
            foreignField: "_id",
            as: "quizzesDetails",
          },
        },
        {
          $unwind: {
            path: "$quizzesDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "quizzesDetails.quizPos": 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            contents: { $first: "$contents" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            modulePos: { $first: "$modulePos" },
            description: { $first: "$description" },
            quizzes: { $push: "$quizzesDetails" },
            assignments: { $first: "$assignments" },
          },
        },
        //quiz populating ends

        //assignments populating starts
        {
          $lookup: {
            from: "assignments",
            localField: "assignments",
            foreignField: "_id",
            as: "assignmentDetails",
          },
        },
        {
          $unwind: {
            path: "$assignmentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "assignmentDetails.assignmentPos": 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            contents: { $first: "$contents" },
            title: { $first: "$title" },
            createdAt: { $first: "$createdAt" },
            modulePos: { $first: "$modulePos" },
            description: { $first: "$description" },
            quizzes: { $first: "$quizzes" },
            assignments: { $push: "$assignmentDetails" },
          },
        },
        //assignments populating ends

        {
          $sort: {
            modulePos: 1,
            createdAt: 1,
          },
        },
      ];

      /*********************************************************** */
      /* ekane aggregation use kore module er sb content ante hobe */
      // let modules = await ModuleModel.find({ courseRef: courseId });
      let modules = await ModuleModel.aggregate(pipeline);

      console.log("allInformation ", allInformation);
      if (allInformation == 0) {
        // module.toObject();
        // delete module.content;

        modules = modules.map((x) => {
          // console.log(x);
          delete x.contents;
          delete x.quizzes;
          delete x.assignments;
          return x;
        });
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the modules",
        modules
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

  async createModule(req, res) {
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
      const { title, description, isPremium, courseRef, teacherRef } = req.body;

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

      const moduleResult = await ModuleModel.create({
        title,
        description,
        isPremium,
        courseRef,
        teacherRef,
      });

      if (moduleResult?._id) {
        await CourseModel.updateOne(
          { _id: courseRef },
          { $addToSet: { modulesRef: moduleResult?._id } }
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully added Module",
        moduleResult
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

  async sortModule(req, res) {
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
      const { moduleSort, courseRef, teacherRef } = req.body;

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
      moduleSort?.map((element) => {
        // console.log("element ", element);
        bulk.push({
          updateOne: {
            filter: { _id: element?.id },
            update: { $set: { modulePos: element?.pos } },
          },
        });
      });

      const moduleSortResult = await ModuleModel.bulkWrite(bulk);
      // console.log(moduleSortResult);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully sorted the module"
        // moduleResult
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

module.exports = new ModuleController();
