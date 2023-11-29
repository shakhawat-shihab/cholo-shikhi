const HTTP_STATUS = require("../constants/statusCodes");
const jsonwebtoken = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../util/common");

const isAuthenticated = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized access");
    }
    const jwt = req.headers.authorization.split(" ")[1];
    const validate = jsonwebtoken.verify(jwt, process.env.SECRET_KEY);
    // console.log(validate);
    // jwt verified
    if (validate) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jsonwebtoken.JsonWebTokenError) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Token invalid");
    }
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Please log in again");
    }
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const isAdmin = (req, res, next) => {
  try {
    const jwt = req.headers.authorization.split(" ")[1];
    const validate = jsonwebtoken.decode(jwt);
    // console.log(validate);
    if (validate.role == "admin") {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized access."
      );
    }
  } catch (error) {
    // console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const isTeacher = (req, res, next) => {
  try {
    const jwt = req.headers.authorization.split(" ")[1];
    const validate = jsonwebtoken.decode(jwt);
    if (validate.role == "teacher") {
      next();
    } else {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized access");
    }
  } catch (error) {
    // console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const isStudent = (req, res, next) => {
  try {
    const jwt = req.headers.authorization.split(" ")[1];
    const validate = jsonwebtoken.decode(jwt);
    if (validate.role == "student") {
      next();
    } else {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized access");
    }
  } catch (error) {
    // console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const checkUserIdWithParamsId = (req, res, next) => {
  try {
    // console.log(req.params);
    const { userId } = req.params;
    const jwt = req?.headers?.authorization?.split(" ")[1];
    if (!jwt) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
    }
    const validate = jsonwebtoken.decode(jwt);
    // console.log(validate?.userRef?._id, userId);
    if (validate?.userRef?._id == userId) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "You have access to  your information only"
      );
    }
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const checkTeacherIdWithParamsId = (req, res, next) => {
  try {
    // console.log(req.params);
    const { teacherId } = req.params;
    const jwt = req?.headers?.authorization?.split(" ")[1];
    if (!jwt) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
    }
    const validate = jsonwebtoken.decode(jwt);
    // console.log(validate?.userRef?.teacherRef, teacherId);
    if (validate?.userRef?.teacherRef == teacherId) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "You have access to  your information only"
      );
    }
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const checkStudentIdWithParamsId = (req, res, next) => {
  try {
    // console.log(req.params);
    const { studentId } = req.params;
    const jwt = req?.headers?.authorization?.split(" ")[1];
    if (!jwt) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
    }
    const validate = jsonwebtoken.decode(jwt);
    // console.log(validate?.userRef?.studentRef, studentId);
    if (validate?.userRef?.studentRef == studentId) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "You have access to  your information only"
      );
    }
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const checkUserIdWithBodyId = (req, res, next) => {
  try {
    // console.log(req.body);
    const { userId } = req.body;
    const jwt = req?.headers?.authorization?.split(" ")[1];
    if (!jwt) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
    }
    const validate = jsonwebtoken.decode(jwt);
    // console.log(validate?.userRef?._id);
    if (validate?.userRef?._id == userId) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "You have access to  your information only"
      );
    }
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const checkTeacherIdWithBodyId = (req, res, next) => {
  try {
    const { teacherRef } = req.body;
    // console.log(req.body);
    const jwt = req?.headers?.authorization?.split(" ")[1];
    if (!jwt) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
    }
    const validate = jsonwebtoken.decode(jwt);
    // console.log("-- ", validate?.userRef, " -- ", teacherRef);

    if (validate?.userRef?.teacherRef == teacherRef) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "You have access to  your information only"
      );
    }
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

const checkStudentIdWithBodyId = (req, res, next) => {
  try {
    const { studentRef } = req.body;
    // console.log(req.body);
    const jwt = req?.headers?.authorization?.split(" ")[1];
    if (!jwt) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
    }
    const validate = jsonwebtoken.decode(jwt);
    // console.log(validate?.userRef?.studentRef, studentRef);

    if (validate?.userRef?.studentRef == studentRef) {
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "You have access to  your information only"
      );
    }
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};
const passAuthorization = (req, res, next) => {
  try {
    // console.log(req.body);
    const jwt = req?.headers?.authorization?.split(" ")[1];
    if (!jwt) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized Access");
    }
    const validate = jsonwebtoken.decode(jwt);
    // console.log(validate?.userRef?.studentRef, studentRef);

    if (validate) {
      req.authorizedData = validate;
      next();
    } else {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "You have access to  your information only"
      );
    }
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isTeacher,
  isStudent,
  checkUserIdWithParamsId,
  checkUserIdWithBodyId,
  checkStudentIdWithParamsId,
  checkStudentIdWithBodyId,
  checkTeacherIdWithBodyId,
  checkTeacherIdWithParamsId,
  passAuthorization,
};
