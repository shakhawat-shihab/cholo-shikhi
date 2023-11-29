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
const { ObjectId } = mongoose.Types;

class ReviewController {
  async createReview(req, res) {
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
      const { studentRef, courseRef, review } = req.body;

      //   console.log(req.body);

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

      const reviewFind = await ReviewModel.findOne({
        studentRef: studentRef,
        courseRef: courseRef,
      });
      //   console.log("reviewFind", reviewFind);

      //review not exist
      if (!reviewFind) {
        let reviewResult = await ReviewModel.create({
          studentRef: studentRef,
          courseRef: courseRef,
          review: review,
        });

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
            studentRef: studentRef,
            courseRef: courseRef,
          },
          {
            $set: {
              studentRef: studentRef,
              courseRef: courseRef,
              review: review,
            },
          }
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully added your review"
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

  async getAllReviewOfCourse(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update review",
          validation
        );
      }
      const { courseId } = req.params;

      // const reviews = await ReviewModel.find({
      //   courseRef: courseId,
      // });

      let pipeline = [
        {
          $match: {
            courseRef: new mongoose.Types.ObjectId(courseId),
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
            from: "ratings",
            localField: "ratingRef",
            foreignField: "_id",
            as: "ratingDetails",
          },
        },
        {
          $unwind: {
            path: "$ratingDetails",
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
            _id: 1,
            courseRef: 1,
            studentRef: 1,
            createdAt: 1,
            review: 1,
            userName: "$userDetails.userName",
            userImage: "$userDetails.image",
            rating: "$ratingDetails.rating",
            ratingId: "$ratingDetails._id",
          },
        },
      ];

      let reviews = await ReviewModel.aggregate(pipeline);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded  all review ",
        reviews
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

  async getReviewById(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update review",
          validation
        );
      }
      const { reviewId } = req.params;

      const review = await ReviewModel.findOne({ _id: reviewId }).populate({
        path: "ratingRef",
        select: "rating __v", // Specify the properties you want to populate
      });

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded  review ",
        review
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

  async getReview(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update review",
          validation
        );
      }
      const { studentRef, courseRef } = req.body;

      const review = await ReviewModel.findOne({
        studentRef,
        courseRef,
      }).populate({
        path: "ratingRef",
        select: "rating __v", // Specify the properties you want to populate
      });

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded  review",
        review
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

  async updateReview(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update review",
          validation
        );
      }
      const { studentRef, review } = req.body;
      const { reviewId } = req.params;
      //   console.log("reviewId ------------ ", reviewId);

      const reviewFind = await ReviewModel.findById({
        _id: reviewId,
      });
      if (!reviewFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Review doesn't exist");
      }

      //   console.log("reviewFind ------------ ", reviewFind);

      const studentFind = await StudentModel.findById({ _id: studentRef });
      //   console.log("studentFind ------------- ", studentFind);
      if (!studentFind?.enrolledCoursesRef?.includes(reviewFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      const resultUpdate = await ReviewModel.updateOne(
        {
          _id: reviewId,
        },
        {
          $set: {
            review: review,
          },
        }
      );

      if (!resultUpdate?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update your review"
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully updated your review"
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

  async deleteReview(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update review",
          validation
        );
      }

      const { courseRef, studentRef } = req.body;

      const reviewFind = await ReviewModel.findOne({ courseRef, studentRef });
      //   console.log(reviewFind);

      if (!reviewFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Review doesn't exist");
      }

      const studentFind = await StudentModel.findById({
        _id: studentRef,
      });
      if (!studentFind?.enrolledCoursesRef?.includes(courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      if (reviewFind?.ratingRef) {
        //just update
        const resultDelete = await ReviewModel.updateOne(
          {
            _id: reviewFind?._id,
          },
          {
            $set: {
              review: "",
            },
          }
        );
        return sendResponse(res, HTTP_STATUS.OK, "Successfully deleted");
      } else {
        // fully delete
        const resultDelete = await ReviewModel.deleteOne({
          _id: reviewFind?._id,
        });

        if (resultDelete?.deletedCount) {
          let result = await CourseModel.updateOne(
            { _id: reviewFind?.courseRef },
            { $pull: { reviewsRef: reviewFind?._id } }
          );
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            "Successfully deleted your review"
          );
        }
      }

      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to delete your review"
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

module.exports = new ReviewController();
