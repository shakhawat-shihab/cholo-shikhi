const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const { insertInLog } = require("../util/logFile");
const { sendResponse } = require("../util/common");
const { promisify } = require("util");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const transport = require("../config/mailConfig");
const path = require("path");
const { uploadFileAws } = require("../util/awsMethod");
const AuthModel = require("../model/User/Auth");
const UserModel = require("../model/User/User");
const TeacherModel = require("../model/User/Teacher");
const StudentModel = require("../model/User/Student");
const NotificationModel = require("../model/User/Notification");
const CartModel = require("../model/Course/Cart");
const WishlistModel = require("../model/Course/Wishlist");
const ejsRenderFile = promisify(ejs.renderFile);

class AuthController {
  async login(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {
        email: req?.body?.email,
      });
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to log in",
          validation
        );
      }
      const { email, password } = req.body;
      const auth = await AuthModel.findOne({ email: email })
        .populate("userRef", "-createdAt -updatedAt -__v")
        .select("-createdAt -updatedAt -__v");

      if (!auth) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "User is not registered"
        );
      }

      if (!auth.verified) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "Verify your email address"
        );
      }

      const checkPassword = await bcrypt.compare(password, auth.password);

      if (!checkPassword) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "Invalid credentials"
        );
      }
      const responseAuthModel = auth.toObject();
      delete responseAuthModel.password;

      const jwt = jsonwebtoken.sign(responseAuthModel, process.env.SECRET_KEY, {
        expiresIn: "60 days",
      });

      responseAuthModel.token = jwt;
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully logged in",
        responseAuthModel
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

  async signup(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {
        email: req?.body?.email,
        userName: req?.body?.userName,
      });
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to sign up",
          validation
        );
      }
      const { userName, email, password, role } = req.body;
      // console.log(req.body);

      const userInfo = await UserModel.findOne({
        $or: [{ email: email }, { userName: userName }],
      });

      if (userInfo?.email == email && userInfo?.userName == userName) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          "Email is already registered and userName is not available",
          [
            { msg: "Email is already registered", path: "email" },
            { msg: "userName is not available", path: "userName" },
          ]
        );
      } else if (userInfo?.email == email) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          "Email is already registered",
          [{ msg: "Email is already registered", path: "email" }]
        );
      } else if (userInfo?.userName == userName) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          "UserName is not available",
          [{ msg: "userName is not available", path: "userName" }]
        );
      }

      //create user
      let user = await UserModel.create({
        userName: userName,
        email: email,
      });

      //create student
      /* const student = await StudentModel.create({
        userRef: user?._id,
      });

      await UserModel.updateOne(
        { _id: user?._id },
        { $set: { studentRef: student?._id } }
      );*/

      // hasehd password
      const hashedPassword = await bcrypt.hash(password, 10).then((hash) => {
        return hash;
      });
      // create token //
      let confirmEmailToken = crypto.randomBytes(32).toString("hex");
      // console.log("confirmEmailToken ", confirmEmailToken);
      // 5 hour time
      let confirmEmailExpire = Date.now() + 60 * 60 * 5 * 1000;

      let result;

      if (role == "student") {
        //create student
        const student = await StudentModel.create({
          userRef: user?._id,
        });

        await UserModel.updateOne(
          { _id: user?._id },
          { $set: { studentRef: student?._id } }
        );

        result = await AuthModel.create({
          email: email,
          password: hashedPassword,
          userName: userName,
          userRef: user._id,
          role: role,
          confirmEmailToken,
          confirmEmailExpire,
        });
      } else {
        result = await AuthModel.create({
          email: email,
          password: hashedPassword,
          userName: userName,
          userRef: user._id,
          confirmEmailToken,
          confirmEmailExpire,
        });
      }

      if (!result) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add the user"
        );
      }

      // console.log("result ", result);

      // email url generate
      const emailUrl = path.join(
        process.env.FRONTEND_URL,
        "verify-email",
        confirmEmailToken,
        result?._id.toString()
      );

      // console.log(emailUrl);
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "verifyEmail.ejs"),
        {
          name: userName,
          emailUrl: emailUrl,
        }
      );
      // send email
      const mailSendResult = await transport.sendMail({
        from: "myapp@system.com",
        to: `${userName} ${email}`,
        subject: "Verify Your Email",
        html: htmlBody,
      });
      // console.log("mailSendResult ", mailSendResult);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Check Your Email"
        // user
      );
    } catch (error) {
      console.log("error ", error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  // async signupTeacher(req, res) {
  //   try {
  //     await insertInLog(req?.originalUrl, req.query, {
  //       email: req?.body?.email,
  //       userName: req?.body?.userName,
  //     });
  //     const validation = validationResult(req).array();
  //     if (validation.length > 0) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.UNPROCESSABLE_ENTITY,
  //         "Failed to sign up",
  //         validation
  //       );
  //     }
  //     const { userName, email, password, role = "teacher", resume } = req.body;
  //     // console.log(req.body);

  //     const userInfo = await UserModel.findOne({
  //       $or: [{ email: email }, { userName: userName }],
  //     });

  //     if (userInfo?.email == email && userInfo?.userName == userName) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.CONFLICT,
  //         "Email is already registered and userName is not available",
  //         [
  //           { msg: "Email is already registered", path: "email" },
  //           { msg: "userName is not available", path: "userName" },
  //         ]
  //       );
  //     } else if (userInfo?.email == email) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.CONFLICT,
  //         "Email is already registered",
  //         [{ msg: "Email is already registered", path: "email" }]
  //       );
  //     } else if (userInfo?.userName == userName) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.CONFLICT,
  //         "UserName is not available",
  //         [{ msg: "userName is not available", path: "userName" }]
  //       );
  //     }

  //     const url = await uploadFileAws(req.file, "resumes");

  //     // create user model
  //     let user = await UserModel.create({
  //       userName: userName,
  //       email: email,
  //     });

  //     // create teacher model
  //     const teacher = await TeacherModel.create({
  //       resume: url,
  //       userRef: user?._id,
  //     });

  //     await UserModel.updateOne(
  //       { _id: user?._id },
  //       { $set: { teacherRef: teacher?._id } }
  //     );

  //     // hasehd password
  //     const hashedPassword = await bcrypt.hash(password, 10).then((hash) => {
  //       return hash;
  //     });
  //     // create token //
  //     let confirmEmailToken = crypto.randomBytes(32).toString("hex");
  //     // console.log("confirmEmailToken ", confirmEmailToken);
  //     // 5 hour time
  //     let confirmEmailExpire = Date.now() + 60 * 60 * 5 * 1000;

  //     let result = await AuthModel.create({
  //       email: email,
  //       password: hashedPassword,
  //       userName: userName,
  //       userRef: user._id,
  //       role: "pending",
  //       //role will be updated after admin approval
  //       isPendingTeacher: true,
  //       confirmEmailToken,
  //       confirmEmailExpire,
  //     });

  //     if (!result) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.UNPROCESSABLE_ENTITY,
  //         "Failed to add the user"
  //       );
  //     }

  //     // console.log("result ", result);

  //     // email url generate
  //     const emailUrl = path.join(
  //       process.env.FRONTEND_URL,
  //       "verify-email",
  //       confirmEmailToken,
  //       result?._id.toString()
  //     );

  //     // console.log(emailUrl);
  //     const htmlBody = await ejsRenderFile(
  //       path.join(__dirname, "..", "views", "verifyEmail.ejs"),
  //       {
  //         name: userName,
  //         emailUrl: emailUrl,
  //       }
  //     );
  //     // send email
  //     const mailSendResult = await transport.sendMail({
  //       from: "myapp@system.com",
  //       to: `${userName} ${email}`,
  //       subject: "Verify Your Email",
  //       html: htmlBody,
  //     });
  //     console.log("mailSendResult ", mailSendResult);

  //     return sendResponse(
  //       res,
  //       HTTP_STATUS.OK,
  //       "Check Your Email"
  //       // user
  //     );
  //   } catch (error) {
  //     console.log("error ", error);
  //     return sendResponse(
  //       res,
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR,
  //       "Internal server error"
  //     );
  //   }
  // }

  async verifyEmail(req, res) {
    try {
      // console.log(req.originalUrl);
      await insertInLog(req?.originalUrl, req.query, {});

      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to verify email",
          validation
        );
      }

      const { token, authId } = req.body;

      const auth = await AuthModel.findOne({
        _id: authId,
      }).populate("userRef");

      // console.log("auth ", auth);

      if (!auth) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Invalid request to verify email"
        );
      }

      if (auth.confirmEmailExpire < Date.now()) {
        return sendResponse(
          res,
          HTTP_STATUS.GONE,
          "Email verification request expired"
        );
      }

      if (auth.confirmEmailToken !== token) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "You have provided Invalid token"
        );
      }

      const resultAuth = await AuthModel.updateOne(
        { _id: authId },
        {
          $set: {
            confirmEmailExpire: null,
            confirmEmailToken: null,
            verified: true,
          },
        }
      );

      let resultNotification = await NotificationModel.create({
        userRef: auth?.userRef?._id,
        notifications: [],
      });

      console.log("role ", auth?.role);
      console.log("userRef ", auth?.userRef);
      if (auth?.role == "student") {
        await CartModel.create({
          studentRef: auth?.userRef?.studentRef,
        });
        await WishlistModel.create({
          studentRef: auth?.userRef?.studentRef,
        });
      }

      await UserModel.updateOne(
        { _id: auth?.userRef },
        { $set: { notificationRef: resultNotification?._id } }
      );

      if (resultAuth?.modifiedCount) {
        // console.log(resultAuth)
        return sendResponse(res, HTTP_STATUS.OK, "Successfully Verified Email");
      }
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Something went wrong!"
      );
    }
  }

  async forgetPassword(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {
        authId: req?.body?.email,
      });

      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to process your request",
          validation
        );
      }

      const { email } = req.body;

      const auth = await AuthModel.findOne({ email }).populate("userRef");
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User not found");
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      console.log("resetToken ", resetToken);
      auth.resetPasswordToken = resetToken;
      auth.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
      auth.resetPassword = true;

      await auth.save();

      const resetUrl = path.join(
        process.env.FRONTEND_URL,
        "reset-password",
        resetToken,
        auth?._id.toString()
      );

      // console.log(resetUrl);

      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "forgotPassword.ejs"),
        {
          name: auth.userRef.userName,
          resetURL: resetUrl,
        }
      );

      const result = await transport.sendMail({
        from: "myapp@system.com",
        to: `${auth.userRef.userName} ${email}`,
        subject: "Forget Password",
        html: htmlBody,
      });

      // console.log(result);

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Check your email to get reset link"
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

  async validatePasswordResetRequest(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {
        authId: req?.body?.authId,
      });

      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to process your request",
          validation
        );
      }

      const { token, authId } = req.body;

      const auth = await AuthModel.findOne({
        _id: new mongoose.Types.ObjectId(authId),
      });
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Invalid request");
      }

      if (auth.resetPasswordExpire < Date.now()) {
        return sendResponse(res, HTTP_STATUS.GONE, "Expired request");
      }

      if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
        return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Invalid token");
      }
      return sendResponse(res, HTTP_STATUS.OK, "Request is still valid");
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Something went wrong!"
      );
    }
  }

  async resetPassword(req, res) {
    try {
      await insertInLog(req?.originalUrl, req.query, {
        authId: req?.body?.authId,
      });

      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to process your request",
          validation
        );
      }
      const { token, authId, password, confirmPassword } = req.body;

      const auth = await AuthModel.findOne({
        _id: new mongoose.Types.ObjectId(authId),
      });

      //write validations...
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Invalid request");
      }

      if (auth?.resetPasswordExpire < Date.now()) {
        return sendResponse(res, HTTP_STATUS.GONE, "Expired Token");
      }

      if (auth?.resetPasswordToken != token || auth?.resetPassword == false) {
        return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Invalid token");
      }

      if (password != confirmPassword) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Password didn't match"
        );
      }

      console.log(password, auth.password);
      if (await bcrypt.compare(password, auth?.password)) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Password can't be same as previous"
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10).then((hash) => {
        return hash;
      });

      // write code to save the new password

      const result = await AuthModel.updateOne(
        { _id: authId },
        {
          $set: {
            password: hashedPassword,
            resetPassword: false,
            resetPasswordExpire: null,
            resetPasswordToken: null,
            verified: true,
          },
        }
      );
      // console.log(result);

      if (result?.modifiedCount) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully updated password"
        );
      }
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Something went wrong!"
      );
    }
    // return sendResponse(res, HTTP_STATUS.OK, "Request is still valid");
  }

  async aboutMe(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params);
      const { token } = req.params;
      let isVerified = jsonwebtoken.verify(token, process.env.SECRET_KEY);
      if (!isVerified) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Log in again please",
          responseAuthModel
        );
      }
      const info = jsonwebtoken.decode(token);
      // console.log(info);
      const auth = await AuthModel.findOne({ _id: info?._id })
        .populate("userRef", "-createdAt -updatedAt -__v")
        .select("-createdAt -updatedAt -__v");
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Invalid request");
      }

      const responseAuthModel = auth.toObject();
      delete responseAuthModel.password;

      const jwt = jsonwebtoken.sign(responseAuthModel, process.env.SECRET_KEY, {
        expiresIn: "60 days",
      });
      responseAuthModel.token = jwt;

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Valid Token Provided",
        responseAuthModel
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

module.exports = new AuthController();
