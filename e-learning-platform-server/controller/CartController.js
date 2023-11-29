const { insertInLog } = require("../util/logFile");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../util/common");
const HTTP_STATUS = require("../constants/statusCodes");
const { default: mongoose } = require("mongoose");
const TeacherModel = require("../model/User/Teacher");
const StudentModel = require("../model/User/Student");
const CartModel = require("../model/Course/Cart");
const CourseModel = require("../model/Course/Course");
const { ObjectId } = require("mongodb");
const SubscriptionModel = require("../model/Course/Subscription");
const { addAdminNotification } = require("../util/adminNotification");

class CartController {
  async getCart(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const { studentId } = req.params;
      // console.log("studentId ---------- ", studentId);
      const student = await StudentModel.findById({ _id: studentId });
      if (!student) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Student does not exist"
        );
      }

      // let cart = await CartModel.findOne({ studentRef: studentId }).populate(
      //   "courses.courseRef",
      //   "title thumbnail "
      // );

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

      let cart = await CartModel.aggregate(pipeline);
      console.log(cart);

      if (!cart) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Cart does not exist");
      }

      // // console.log(cart);
      if (
        cart &&
        cart.length &&
        Object?.keys(cart?.[0]?.courseDetails?.[0])?.length === 0
      ) {
        cart?.[0]?.courseDetails?.shift();
        // console.log(cart);
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully got cart for user",
        cart
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

  async addToCart(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add the Book",
          validation
        );
      }

      let { studentRef, courseRef } = req.body;
      console.log(req.body);

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
      console.log("student ", student);
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

      let cart = await CartModel.findOne({ studentRef: studentRef });

      // console.log(cart);

      let result;
      if (!cart) {
        result = await CartModel.create({
          studentRef,
          courses: [{ courseRef }],
        });
      } else {
        if (cart?.courses?.length > 5) {
          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "Can't add more than 5 course in a cart"
          );
        }
        const targetRef = new ObjectId(courseRef);
        const courseExists = cart?.courses?.some((x) =>
          x?.courseRef?.equals(targetRef)
        );
        if (courseExists) {
          return sendResponse(
            res,
            HTTP_STATUS.CONFLICT,
            "Already added to cart"
          );
        }

        result = await CartModel.updateOne(
          { studentRef: studentRef },
          { $addToSet: { courses: { courseRef: courseRef } } }
        );
      }

      if (result?._id) {
        return sendResponse(
          res,
          HTTP_STATUS.CREATED,
          "Cart created successfully",
          course
        );
      }
      if (result?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Course added to cart",
          course
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to add to cart"
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

  async removeFromCart(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to remove the Book",
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

      let cart = await CartModel.findOne({ studentRef: studentRef });

      let result;
      if (!cart) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Cart does not exist");
      } else {
        // console.log(cart?.courses);
        const targetRef = new ObjectId(courseRef);
        const courseExists = cart?.courses?.some((x) =>
          x?.courseRef?.equals(targetRef)
        );
        // console.log(courseExists);
        if (courseExists) {
          result = await CartModel.updateOne(
            { studentRef: studentRef },
            { $pull: { courses: { courseRef: courseRef } } }
          );
        } else {
          return sendResponse(
            res,
            HTTP_STATUS.NOT_FOUND,
            "This Course does not exist in your cart"
          );
        }
      }

      if (result?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Course removed from cart",
          course
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to remove to cart"
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

  async checkoutCart(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to remove the Book",
          validation
        );
      }

      let { studentRef } = req.body;
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

      let cart = await CartModel.findOne({ studentRef: studentRef });

      let result;
      if (!cart) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Cart does not exist");
      }

      let cartArray = cart?.courses?.map((x) => x?.courseRef);
      console.log(cartArray);

      if (cartArray.length != cart?.courses?.length) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "All courses in the cart does not exist"
        );
      }

      let subscriptionResult = await SubscriptionModel.create({
        studentRef,
        courses: cart.courses,
      });

      if (!subscriptionResult?._id) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to checkout"
        );
      }

      await CartModel.updateOne(
        { studentRef: studentRef },
        {
          $set: { courses: [] },
        }
      );

      console.log(studentRef, "  ", subscriptionResult?._id);
      await addAdminNotification({
        type: "enrollmentRequest",
        subscriptionRef: subscriptionResult?._id,
        studentRef: studentRef,
      });

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully checkedout the cart"
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
module.exports = new CartController();
