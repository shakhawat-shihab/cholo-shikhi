const express = require("express");
const app = express();
var cors = require("cors");
const dotenv = require("dotenv");
dotenv.config("dotenv");

const HTTP_STATUS = require("./constants/statusCodes");
const { sendResponse } = require("./util/common");
const authRoute = require("./route/Auth");
const userRoute = require("./route/User");
const courseRoute = require("./route/Course");
const categoryRoute = require("./route/Category");
const teacherRoute = require("./route/Teacher");
const moduleRoute = require("./route/Module");
const subscriptionRoute = require("./route/Subscription");
const cartRoute = require("./route/Cart");
const quizRoute = require("./route/Quiz");
const assignmentRoute = require("./route/Assignment");
const quizAssessmentRoute = require("./route/QuizAssessment");
const assignmentAssessmentRoute = require("./route/AssignmentAssessment");
const questionRoute = require("./route/Question");
const contentRoute = require("./route/Content");
const wishlistRoute = require("./route/Wishlist");
const reviewRoute = require("./route/Review");
const ratingRoute = require("./route/Rating");
const forumRoute = require("./route/Forum");
const notificationRoute = require("./route/Notification");
const databaseConnection = require("./config/dbConfig");
const { getFormattedTime } = require("./util/dateConvert");
const { insertInLog } = require("./util/logFile");
const multer = require("multer");
const QuizAssessmentController = require("./controller/QuizAssessmentController");

app.use(cors({ origin: "*" }));
app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

//declare basdirectory for the project
global.__basedir = __dirname;

app.use((err, req, res, next) => {
  // console.log("error -- ", err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Invalid JSON provided"
    );
  }

  if (err instanceof multer.MulterError) {
    return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, err.message);
  }
  next();
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/category", categoryRoute);
app.use("/module", moduleRoute);
app.use("/content", contentRoute);
app.use("/quiz", quizRoute);
app.use("/assignment", assignmentRoute);
app.use("/question", questionRoute);
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);
app.use("/review", reviewRoute);
app.use("/rating", ratingRoute);
app.use("/teacher", teacherRoute);
app.use("/subscription", subscriptionRoute);
app.use("/forum", forumRoute);
app.use("/quiz-assessment", quizAssessmentRoute);
app.use("/assignment-assessment", assignmentAssessmentRoute);
app.use("/notification", notificationRoute);

app.get("/", async (req, res) => {
  insertInLog(req?.originalUrl, req.query, { email: req?.body?.email });
  return sendResponse(res, HTTP_STATUS.OK, "Route is working");
});

app.use("*", (req, res) => {
  return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "There is no such route");
});

databaseConnection(() => {
  app.listen(8000, () => {
    let date = new Date();
    console.log(
      `App is running on port 8000 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `
    );
    getFormattedTime();
  });
});
