const { insertInLog } = require("../util/logFile");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");
const { default: mongoose } = require("mongoose");
const StudentModel = require("../model/User/Student");
const CourseModel = require("../model/Course/Course");
const { ObjectId } = require("mongodb");
const WishlistModel = require("../model/Course/Wishlist");

class WishlistController {
  async getWishlist(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const { studentId } = req.params;
      const student = await StudentModel.findById({ _id: studentId });
      if (!student) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Student does not exist"
        );
      }

      let pipeline = [
        {
          $match: {
            studentRef: new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courses.courseRef",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "teachers",
            localField: "course.teacherRef",
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

        {
          $project: {
            courseDetails: {
              courseId: "$course._id",
              title: "$course.title",
              description: "$course.description",
              thumbnail: "$course.thumbnail",
              createdAt: "$course.createdAt",
              teacherUserId: "$userDetails._id",
              teacherfirstName: "$userDetails.firstName",
              teacherlastName: "$userDetails.lastName",
              teacherImage: "$userDetails.image",
            },
          },
        },

        {
          $group: {
            _id: "$_id",
            courseDetails: { $push: "$courseDetails" },
          },
        },

        {
          $sort: {
            createdAt: 1,
          },
        },
      ];

      let wishlist = await WishlistModel.aggregate(pipeline);

      // let wishlist = await WishlistModel.findOne({
      //   studentRef: studentId,
      // }).populate("courses.courseRef", "title  ");

      if (!wishlist) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Wishlist does not exist"
        );
      }

      // console.log(cart);
      if (
        wishlist &&
        wishlist?.length &&
        Object?.keys(wishlist?.[0]?.courseDetails?.[0])?.length === 0
      ) {
        wishlist?.[0]?.courseDetails?.shift();
        // console.log(wishlist);
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully got wishlist for user",
        wishlist
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

  async addToWishlist(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add in wishlist",
          validation
        );
      }

      let { studentRef, courseRef } = req.body;
      // console.log(req.body);

      let pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(courseRef),
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

        {
          $project: {
            courseDetails: {
              courseId: "$_id",
              title: "$title",
              description: "$description",
              thumbnail: "$thumbnail",
              createdAt: "$createdAt",
              teacherUserId: "$userDetails._id",
              teacherfirstName: "$userDetails.firstName",
              teacherlastName: "$userDetails.lastName",
              teacherImage: "$userDetails.image",
            },
          },
        },
      ];

      let course = await CourseModel.aggregate(pipeline);

      const student = await StudentModel.findById({ _id: studentRef });
      //check if student exist
      if (!student) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Student does not exist"
        );
      }
      // check if this course is already enrolled
      if (
        student.enrolledCoursesRef.includes(courseRef) ||
        student.completedCoursesRef.includes(courseRef)
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          "Already enrolled the course"
        );
      }

      // let course = await CourseModel.findOne({
      //   _id: courseRef,
      //   // isPublishedCourse: true,
      // });

      //check if course exist
      if (!course) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Course does not exist"
        );
      }

      let wishlist = await WishlistModel.findOne({ studentRef: studentRef });

      // console.log(wishlist);

      let result;
      if (!wishlist) {
        result = await WishlistModel.create({
          studentRef,
          courses: [{ courseRef }],
        });
      } else {
        const targetRef = new ObjectId(courseRef);
        const courseExists = wishlist?.courses?.some((x) =>
          x?.courseRef?.equals(targetRef)
        );
        if (courseExists) {
          return sendResponse(
            res,
            HTTP_STATUS.CONFLICT,
            "Already added to wishlist"
          );
        }

        result = await WishlistModel.updateOne(
          { studentRef: studentRef },
          { $addToSet: { courses: { courseRef: courseRef } } }
        );
      }

      if (result?._id) {
        return sendResponse(
          res,
          HTTP_STATUS.CREATED,
          "wishlist created successfully",
          course
        );
      }
      if (result?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Course added to wishlist",
          course
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to add to wishlist"
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

  async removeFromWishlist(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to remove the course",
          validation
        );
      }

      let { studentRef, courseRef } = req.body;
      // console.log(req.body);

      const student = await StudentModel.findById({ _id: studentRef });
      //check if student exist
      if (!student) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Student does not exist"
        );
      }

      let pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(courseRef),
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

        {
          $project: {
            courseDetails: {
              courseId: "$_id",
              title: "$title",
              description: "$description",
              thumbnail: "$thumbnail",
              createdAt: "$createdAt",
              teacherUserId: "$userDetails._id",
              teacherfirstName: "$userDetails.firstName",
              teacherlastName: "$userDetails.lastName",
              teacherImage: "$userDetails.image",
            },
          },
        },
      ];

      let course = await CourseModel.aggregate(pipeline);

      //check if course exist
      if (!course) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Course does not exist"
        );
      }

      let wishlist = await WishlistModel.findOne({ studentRef: studentRef });

      let result;
      if (!wishlist) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "wishlist does not exist"
        );
      } else {
        // console.log(wishlist?.courses);
        const targetRef = new ObjectId(courseRef);
        const courseExists = wishlist?.courses?.some((x) =>
          x?.courseRef?.equals(targetRef)
        );
        // console.log(courseExists);
        if (courseExists) {
          result = await WishlistModel.updateOne(
            { studentRef: studentRef },
            { $pull: { courses: { courseRef: courseRef } } }
          );
        } else {
          return sendResponse(
            res,
            HTTP_STATUS.NOT_FOUND,
            "This Course does not exist in your wishlist"
          );
        }
      }

      if (result?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Course removed from wishlist",
          course
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to remove to wishlist"
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
module.exports = new WishlistController();
