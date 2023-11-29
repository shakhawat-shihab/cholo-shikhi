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
const { docType, videoType } = require("../constants/fileTypes");
const ContentModel = require("../model/Module/Content");
const path = require("path");
const { uploadFileAws } = require("../util/awsMethod");
const DocumentModel = require("../model/Module/DocumentContent");
const VideoModel = require("../model/Module/VideoContent");
const TextModel = require("../model/Module/TextContent");
const ProgressModel = require("../model/User/Progress");
const ObjectId = require("mongodb").ObjectId;

class ContentController {
  async createContent(req, res) {
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
      let {
        title,
        description,
        isPremium,
        type,
        text,
        courseRef,
        teacherRef,
        moduleRef,
      } = req.body;
      //   console.log("req.body ", req.body);

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

      const moduleFind = await ModuleModel.findOne({
        _id: moduleRef,
      });
      // console.log("moduleFind ", moduleFind);
      if (!moduleFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Module is not found");
      }

      if (type == "recordVideo") {
        type = "video";
      }

      const contentResult = await ContentModel.create({
        title,
        description,
        type,
        isPremium,
        courseRef,
        moduleRef,
      });

      if (!contentResult?._id) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create content"
          // moduleResult
        );
      }

      const moduleResult = await ModuleModel.updateOne(
        { _id: moduleRef },
        {
          $push: {
            contentsRef: contentResult?._id,
          },
        }
      );

      //let video file is uploading
      console.log("req.file   ", req.file);
      let extension;
      if (req.file)
        extension = path?.extname(req?.file?.originalname)?.toLowerCase();
      console.log(" extension ", extension);
      if (!extension) req.file.originalname += ".mp4";

      console.log("req.file.originalname ", req.file.originalname);

      let contentUploadResult;

      //document content upload
      if (type == "document" && docType.includes(extension)) {
        let url = await uploadFileAws(
          req.file,
          `study_materials/${moduleRef}/documents`
        );
        contentUploadResult = await DocumentModel.create({
          fileUrl: url,
          courseRef,
          moduleRef,
        });
        await ContentModel.updateOne(
          { _id: contentResult?._id },
          {
            $set: {
              documentContentRef: contentUploadResult?._id,
            },
          }
        );
      }

      // video content upload
      else if (
        type == "video"
        //  ||
        // (type == "recordedVideo" && videoType.includes(extension))
      ) {
        let url = await uploadFileAws(
          req.file,
          `study_materials/${moduleRef}/videos`
        );
        console.log("video url ", url);
        contentUploadResult = await VideoModel.create({
          videoUrl: url,
          courseRef,
          moduleRef,
        });
        await ContentModel.updateOne(
          { _id: contentResult?._id },
          {
            $set: {
              videoContentRef: contentUploadResult?._id,
            },
          }
        );
      }

      // text content upload
      else if (type == "text") {
        contentUploadResult = await TextModel.create({
          text: text,
          courseRef,
          moduleRef,
        });

        await ContentModel.updateOne(
          { _id: contentResult?._id },
          {
            $set: {
              textContentRef: contentUploadResult?._id,
            },
          }
        );
      }

      //   console.log("contentUploadResult ", contentUploadResult);

      return sendResponse(res, HTTP_STATUS.OK, "Successfully added Content");
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Something went wrong!"
      );
    }
  }

  async getContentByTeacher(req, res) {
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
      const { teacherRef } = req.body;
      const { contentId } = req.params;

      const contentFind = await ContentModel.findOne({
        _id: contentId,
      }).populate("courseRef", "title");
      // console.log("contentFind ", contentFind);
      if (!contentFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Content is not found");
      }

      if (!contentFind?.courseRef?._id) {
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
      if (!teacherFind?.coursesRef?.includes(contentFind?.courseRef?._id)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the teacher for this course"
        );
      }
      // all checks ends here

      let pipeline = [
        {
          $match: {
            _id: new ObjectId(contentId),
          },
        },
        {
          $lookup: {
            from: "textcontents",
            localField: "textContentRef",
            foreignField: "_id",
            as: "textDetails",
          },
        },
        {
          $unwind: {
            path: "$textDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "documentcontents",
            localField: "documentContentRef",
            foreignField: "_id",
            as: "documentDetails",
          },
        },
        {
          $unwind: {
            path: "$documentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "videocontents",
            localField: "videoContentRef",
            foreignField: "_id",
            as: "videoDetails",
          },
        },
        {
          $unwind: {
            path: "$videoDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const content = await ContentModel.aggregate(pipeline);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loeded Content",
        content?.[0]
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

  async getContentByAdmin(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {});
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get content",
          validation
        );
      }
      const { contentId } = req.params;

      const contentFind = await ContentModel.findOne({
        _id: contentId,
      }).populate("courseRef", "title");
      // console.log("contentFind ", contentFind);
      if (!contentFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Content is not found");
      }

      if (!contentFind?.courseRef?._id) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      // all checks ends here

      let pipeline = [
        {
          $match: {
            _id: new ObjectId(contentId),
          },
        },
        {
          $lookup: {
            from: "textcontents",
            localField: "textContentRef",
            foreignField: "_id",
            as: "textDetails",
          },
        },
        {
          $unwind: {
            path: "$textDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "documentcontents",
            localField: "documentContentRef",
            foreignField: "_id",
            as: "documentDetails",
          },
        },
        {
          $unwind: {
            path: "$documentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "videocontents",
            localField: "videoContentRef",
            foreignField: "_id",
            as: "videoDetails",
          },
        },
        {
          $unwind: {
            path: "$videoDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const content = await ContentModel.aggregate(pipeline);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loeded Content",
        content[0]
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

  async getContentByStudent(req, res) {
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
      const { studentRef } = req.body;
      const { contentId } = req.params;

      const contentFind = await ContentModel.findOne({
        _id: contentId,
      }).populate("courseRef", "title studentsRef");
      // console.log("contentFind ", contentFind);
      if (!contentFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Content is not found");
      }

      if (!contentFind?.courseRef?._id) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const studentFind = await StudentModel.findOne({
        _id: studentRef,
      });
      // console.log("studentFind ", studentFind);
      if (!studentFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Student is not found");
      }
      console.log(
        studentFind.completedCoursesRef.includes(contentFind?.courseRef?._id)
      );
      console.log(studentFind);
      //check if student have access to this coure
      if (
        !studentFind.enrolledCoursesRef.includes(contentFind?.courseRef?._id) &&
        !studentFind.completedCoursesRef.includes(contentFind?.courseRef?._id)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }
      // all checks ends here

      const progress = await ProgressModel.findOne({
        studentRef: studentRef,
        courseRef: contentFind?.courseRef?._id,
      });

      let content;

      const contentIdExists = progress?.completedContentsRef?.some(
        (x) => x.toString() === contentId
      );

      console.log("content complete ", contentIdExists);

      if (contentIdExists) {
        let pipeline = [
          {
            $match: {
              _id: new ObjectId(contentId),
            },
          },
          {
            $lookup: {
              from: "textcontents",
              localField: "textContentRef",
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
              localField: "documentContentRef",
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
              localField: "videoContentRef",
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
        ];
        // console.log(pipeline);
        content = await ContentModel.aggregate(pipeline);
      } else {
        let pipeline = [
          {
            $match: {
              courseRef: new mongoose.Types.ObjectId(
                contentFind?.courseRef?._id
              ),
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
              description: { $first: "$description" },
              quizzes: { $first: "$quizzesRef" },
              assignments: { $first: "$assignmentsRef" },
            },
          },
        ];
        let modules = await ModuleModel.aggregate(pipeline);

        // console.log("progress ---- ", progress?.completedModulesRef);
        // console.log("modules ----- ", modules);

        if (progress) {
          // modules = modules.toObject();
          // console.log("modules ", modules);
          let firstIncompleteModule = true;
          modules = modules.map((module) => {
            //check for modules
            if (!progress?.completedModulesRef?.includes(module?._id)) {
              module.notCompleted = true;
              if (firstIncompleteModule == true) {
                console.log("firstIncompleteModule ", module?._id);
                module.isRunning = true;
                // check for contents
                let firstIncompleteContent = true;
                module.contents = module?.contents?.map((content) => {
                  if (!progress?.completedContentsRef?.includes(content?._id)) {
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
              }
              firstIncompleteModule = false;
              return module;
            } else {
              return module;
            }
          });

          let found;
          modules?.find((module) => {
            // jegula te notCompleted falsy sei module gula complete hoise
            if (!module?.notCompleted || module?.isRunning) {
              module?.contents?.find((content) => {
                // console.log(content?._id, "---", contentId);
                if (!content?.notCompleted || content?.isRunning) {
                  if (content?._id == contentId) {
                    found = content;
                  }
                }
              });
            }
            if (found) {
              return;
            }
          });
          if (found) {
            console.log("sdfdfdsfsdfsdf goudmf");
            return sendResponse(
              res,
              HTTP_STATUS.OK,
              "Successfully loeded Content",
              found
            );
          }

          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "Complete previous content first"
          );
        }
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded Content",
        content[0]
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

  async getContentGeneral(req, res) {
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

      const { contentId } = req.params;

      let pipeline = [
        {
          $match: {
            _id: new ObjectId(contentId),
          },
        },
        {
          $lookup: {
            from: "textcontents",
            localField: "textContentRef",
            foreignField: "_id",
            as: "textDetails",
          },
        },
        {
          $unwind: {
            path: "$textDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "documentcontents",
            localField: "documentContentRef",
            foreignField: "_id",
            as: "documentDetails",
          },
        },
        {
          $unwind: {
            path: "$documentDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "videocontents",
            localField: "videoContentRef",
            foreignField: "_id",
            as: "videoDetails",
          },
        },
        {
          $unwind: {
            path: "$videoDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];
      // console.log(pipeline);
      let content = await ContentModel.aggregate(pipeline);
      let data = content?.[0];

      //premium content is not viewable to general user
      if (data?.isPremium) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You have no access to this content"
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded Content",
        data
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

  async sortContent(req, res) {
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
      // moduleRef can be passed here
      const { contentSort, courseRef, teacherRef } = req.body;

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
      contentSort?.map((element) => {
        // console.log("element ", element);
        bulk.push({
          updateOne: {
            filter: { _id: element?.id },
            update: { $set: { contentPos: element?.pos } },
          },
        });
      });

      const contentSortResult = await ContentModel.bulkWrite(bulk);
      // console.log(contentSortResult);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully sorted the contents"
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

  async completeContent(req, res) {
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
      const { studentRef } = req.body;
      const { contentId } = req.params;

      const contentFind = await ContentModel.findOne({
        _id: contentId,
      }).populate("courseRef", "title studentsRef");
      // console.log("contentFind ", contentFind);
      if (!contentFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Content is not found");
      }

      if (!contentFind?.courseRef?._id) {
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
        !studentFind.enrolledCoursesRef.includes(contentFind?.courseRef?._id) &&
        !studentFind.completedCoursesRef.includes(contentFind?.courseRef?._id)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }
      // all checks ends here

      // const progress = await ProgressModel.findOne({
      //   studentRef: studentRef,
      //   courseRef: contentFind?.courseRef?._id,
      // });

      // let content;

      // const contentIdExists = progress?.completedContentsRef?.some(
      //   (x) => x.toString() === contentId
      // );

      // let pipeline = [
      //   {
      //     $match: {
      //       courseRef: new mongoose.Types.ObjectId(contentFind?.courseRef?._id),
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
      //     $lookup: {
      //       from: "textcontents",
      //       localField: "contents.textContentRef",
      //       foreignField: "_id",
      //       as: "textContentDetails",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$textContentDetails",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "documentcontents",
      //       localField: "contents.documentContentRef",
      //       foreignField: "_id",
      //       as: "documentContentDetails",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$documentContentDetails",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "videocontents",
      //       localField: "contents.videoContentRef",
      //       foreignField: "_id",
      //       as: "videoContentDetails",
      //     },
      //   },
      //   {
      //     $unwind: {
      //       path: "$videoContentDetails",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },

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
      //       "contents.textContentDetails": "$textContentDetails",
      //       "contents.videoContentDetails": "$videoContentDetails",
      //       "contents.documentContentDetails": "$documentContentDetails",
      //       assignmentsRef: 1,
      //       quizzesRef: 1,
      //     },
      //   },
      //   {
      //     $sort: {
      //       "contents.contentPos": 1,
      //     },
      //   },

      //   {
      //     $group: {
      //       _id: "$_id",
      //       contents: { $push: "$contents" },
      //       modulePos: { $first: "$modulePos" },
      //       title: { $first: "$title" },
      //       description: { $first: "$description" },
      //       quizzes: { $first: "$quizzesRef" },
      //       assignments: { $first: "$assignmentsRef" },
      //     },
      //   },
      // ];
      // let modules = await ModuleModel.aggregate(pipeline);

      // console.log("progress ---- ", progress?.completedModulesRef);
      // console.log("modules ----- ", modules);

      await ProgressModel.updateOne(
        { studentRef: studentRef, courseRef: contentFind?.courseRef?._id },
        { $addToSet: { completedContentsRef: contentId } }
      );

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully completed Content"
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

module.exports = new ContentController();
