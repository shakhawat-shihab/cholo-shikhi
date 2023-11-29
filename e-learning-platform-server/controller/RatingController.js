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
const ReviewModel = require("../model/Course/Review");
const RatingModel = require("../model/Course/Rating");
const { ObjectId } = mongoose.Types;

class RatingController {
  async createRating(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create review",
          validation
        );
      }
      const { studentRef, courseRef, rating } = req.body;

      const courseFind = await CourseModel.findById({ _id: courseRef });
      //   console.log("courseFind ------------- ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const studentFind = await StudentModel.findById({ _id: studentRef });
      //   console.log("studentFind ------------- ", studentFind);
      if (!studentFind?.enrolledCoursesRef?.includes(courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      const ratingFind = await RatingModel.findOne({
        studentRef: studentRef,
        courseRef: courseRef,
      });
      //   console.log("reviewFind", reviewFind);

      if (!ratingFind) {
        let ratingResult = await RatingModel.create({
          studentRef: studentRef,
          courseRef: courseRef,
          rating: rating,
        });

        //rating is new
        if (ratingResult) {
          await CourseModel.updateOne(
            { _id: courseRef },
            { $push: { ratingsRef: ratingResult?._id } }
          );

          const reviewFind = await ReviewModel.findOne({
            studentRef: studentRef,
            courseRef: courseRef,
          });

          //review not exist
          if (!reviewFind) {
            //create review
            let reviewResult = await ReviewModel.create({
              studentRef: studentRef,
              courseRef: courseRef,
              ratingRef: ratingResult?._id,
            });
            //push reference to course
            if (reviewResult) {
              await CourseModel.updateOne(
                { _id: courseRef },
                { $push: { reviewsRef: reviewResult?._id } }
              );
            }
          }
          //review exist
          else {
            await ReviewModel.updateOne(
              {
                _id: reviewFind?._id,
              },
              {
                $set: {
                  studentRef: studentRef,
                  courseRef: courseRef,
                  ratingRef: ratingResult?._id,
                },
              }
            );
          }

          return sendResponse(
            res,
            HTTP_STATUS.OK,
            "Successfully added your rating"
          );
        }
      } else {
        await RatingModel.updateOne(
          {
            studentRef: studentRef,
            courseRef: courseRef,
          },
          {
            $set: {
              rating: rating,
            },
          }
        );

        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully updated your rating"
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to add your rating"
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

  async deleteRating(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create review",
          validation
        );
      }
      const { studentRef, courseRef } = req.body;

      const courseFind = await CourseModel.findById({ _id: courseRef });
      //   console.log("courseFind ------------- ", courseFind);
      if (!courseFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Course is not found");
      }

      const studentFind = await StudentModel.findById({ _id: studentRef });
      //   console.log("studentFind ------------- ", studentFind);
      if (!studentFind?.enrolledCoursesRef?.includes(courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      const ratingFind = await RatingModel.findOne({
        studentRef: studentRef,
        courseRef: courseRef,
      });

      if (!ratingFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Rating not Found");
      }

      // console.log(ratingFind);
      const reviewFind = await ReviewModel.findOne({
        studentRef: studentRef,
        courseRef: courseRef,
      });

      const ratingRes = await RatingModel.deleteOne({
        _id: ratingFind?._id,
      });

      if (reviewFind.review == "") {
        // delete both review and rating
        const resultDelete = await ReviewModel.deleteOne({
          _id: reviewFind?._id,
        });

        if (resultDelete?.deletedCount) {
          let result = await CourseModel.updateOne(
            { _id: reviewFind?.courseRef },
            { $pull: { reviewsRef: reviewFind?._id } }
          );
        }
      } else {
        //just remove rating reference from review
        let ans = await ReviewModel.updateOne(
          {
            ratingRef: ratingFind?._id,
          },
          {
            $set: {
              ratingRef: null,
            },
          }
        );
      }

      // console.log(ans);

      // console.log("ratingRes ", ratingRes);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully deletd your rating"
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

module.exports = new RatingController();
