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
const MarksModel = require("../model/Assesment/Marks");
const ProgressModel = require("../model/User/Progress");

class QuizAssessmentController {
  async createQuizAssessment(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to create quiz",
          validation
        );
      }
      const { studentRef, quizRef } = req.body;

      const quizFind = await QuizModel.findById({ _id: quizRef });
      //   console.log("quizFind ", quizFind);
      if (!quizFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
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
      if (!studentFind?.enrolledCoursesRef?.includes(quizFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course....."
        );
      }

      const quizAssessment = await QuizAssessmentModel.findOne({
        quizRef: quizRef,
        studentRef: studentRef,
      });

      const startTime = new Date();
      const endTime = new Date(
        startTime.getTime() + quizFind?.durationInMinute * 60 * 1000
      );

      // console.log("quizAssessment ", quizAssessment);

      //create quiz assessment if not exist
      if (!quizAssessment) {
        await QuizAssessmentModel.create({
          quizRef: quizRef,
          studentRef: studentRef,
          courseRef: quizFind?.courseRef,
          startTime,
          endTime,
        });
      }
      // update if previously exist
      else {
        if (quizAssessment?.status == "passed") {
          return sendResponse(
            res,
            HTTP_STATUS.FORBIDDEN,
            "You are already passed in this quiz......."
          );
        }
        const timestamp1 = new Date();
        const timestamp2 = new Date(quizAssessment?.endTime);
        // Calculate the time difference in milliseconds
        const timeDifferenceInMilliseconds = timestamp2 - timestamp1;
        // Convert the time difference to minute
        const timeDifference = timeDifferenceInMilliseconds / (1000 * 60);
        // console.log(timeDifference);
        if (timeDifference > 0) {
          return sendResponse(res, HTTP_STATUS.FORBIDDEN, "Quiz is running");
        }
        await QuizAssessmentModel.updateOne(
          { quizRef: quizRef, studentRef: studentRef },
          {
            $set: {
              startTime,
              endTime,
              assessment: [],
              marksObtained: 0,
            },
          }
        );
      }

      return sendResponse(res, HTTP_STATUS.OK, "Successfully started the quiz");
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async changeQuestion(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get quiz",
          validation
        );
      }

      const { studentRef, quizRef, crntQuestionRef, operation } = req.body;

      const quizFind = await QuizModel.findById({ _id: quizRef });
      // console.log("quizFind ", quizFind);
      if (!quizFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
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
      //check if teacher have access to this coure
      if (!studentFind?.enrolledCoursesRef?.includes(quizFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      // find quiz assessment
      const quizAssessment = await QuizAssessmentModel.findOne({
        quizRef: quizRef,
        studentRef: studentRef,
      });
      if (!quizAssessment) {
        return sendResponse(res, HTTP_STATUS.FORBIDDEN, "Start the quiz first");
      }
      //check if quiz is running
      const timestamp1 = new Date();
      const timestamp2 = new Date(quizAssessment?.endTime);
      const timeDifferenceInMilliseconds = timestamp2 - timestamp1;
      const timeDifference = timeDifferenceInMilliseconds / (1000 * 60);
      // console.log(timeDifference);
      if (timeDifference < 0) {
        return sendResponse(res, HTTP_STATUS.FORBIDDEN, "Quiz is finished");
      }
      let previousExist = true,
        nextExist = true;
      let questionRef;

      if (!crntQuestionRef) {
        questionRef = quizFind?.questionsRef?.[0];
        previousExist = false;
      } else {
        let index = quizFind?.questionsRef?.findIndex(
          (x) => x == crntQuestionRef
        );
        console.log("index ", index);
        if (operation == "next") {
          if (index + 1 >= quizFind?.questionsRef?.length - 1) {
            nextExist = false;
          }
          questionRef = quizFind?.questionsRef?.[index + 1];
        } else if (operation == "previous") {
          if (index - 1 <= 0) {
            previousExist = false;
          }
          questionRef = quizFind?.questionsRef?.[index - 1];
        }

        if (index == -1) {
          return sendResponse(
            res,
            HTTP_STATUS.OK,
            "Sorry you give a wrong reference of the current question",
            quizFind
          );
        }
        // questionRef = quizFind?.questionsRef?.[index];
      }
      // console.log(questionRef);

      let question = await QuestionModel.findOne({ _id: questionRef });
      if (!question) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Question not found");
      }
      question = question.toObject();
      question.nextExist = nextExist;
      question.previousExist = previousExist;
      question.endTime = quizAssessment?.endTime;
      delete question.correctAns;
      // console.log(quizAssessment);
      let indexInAssessment = quizAssessment?.assessment?.findIndex((x) => {
        // both are objectId so giving == will not work here
        if (x?.questionRef.toString() == questionRef.toString()) {
          // console.log("found");
          return true;
        }
      });
      // console.log("indexInAssessment ", indexInAssessment);
      if (indexInAssessment != -1) {
        question.userAns =
          quizAssessment?.assessment?.[indexInAssessment]?.submittedAns;
      }

      // let myAnswer = quizAssessment?.assessment?.find((x) => {
      //   if (x.questionRef == questionRef) {
      //     return x;
      //   }
      // });
      // question.assessment = myAnswer;

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully loaded the question",
        question
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

  async questionAnswer(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get quiz",
          validation
        );
      }
      let { studentRef, quizRef, crntQuestionRef, answer } = req.body;

      // console.log(typeof answer);
      if (typeof answer == "string") answer = JSON.parse(answer);
      // if (typeof answer != "string") stringAnswer = JSON.stringify(answer);

      const quizFind = await QuizModel.findById({ _id: quizRef });
      // console.log("quizFind ", quizFind);
      if (!quizFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
      }
      //check if question exist inside the quiz
      if (!quizFind?.questionsRef?.includes(crntQuestionRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Question doesn't exist inside the quiz"
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
      //check if teacher have access to this coure
      if (!studentFind?.enrolledCoursesRef?.includes(quizFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      //findQuestion
      const questionFind = await QuestionModel.findOne({
        _id: crntQuestionRef,
      });
      if (!questionFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Question does not exist"
        );
      }

      // find quiz assessment
      const quizAssessment = await QuizAssessmentModel.findOne({
        quizRef: quizRef,
        studentRef: studentRef,
      });
      if (!quizAssessment) {
        return sendResponse(res, HTTP_STATUS.FORBIDDEN, "Start the quiz first");
      }
      //check if quiz is running
      const timestamp1 = new Date();
      const timestamp2 = new Date(quizAssessment?.endTime);
      const timeDifferenceInMilliseconds = timestamp2 - timestamp1;
      const timeDifference = timeDifferenceInMilliseconds / (1000 * 60);
      // console.log(timeDifference);
      if (timeDifference < 0) {
        return sendResponse(res, HTTP_STATUS.FORBIDDEN, "Quiz is finished");
      }

      // console.log("quizAssessment ", quizAssessment);
      // console.log("questionFind ", questionFind);

      let checkCurrentAnswer = (actualAns, myAns) => {
        actualAns = actualAns?.sort();
        myAns = myAns?.sort();
        // console.log(actualAns, myAns);
        // console.log(JSON.stringify(actualAns), JSON.stringify(myAns));
        if (JSON.stringify(actualAns) == JSON.stringify(myAns)) {
          return true;
        }
        return false;
      };
      let isCurrentAnswerCorrect = checkCurrentAnswer(
        questionFind?.correctAns,
        answer
      );
      // console.log("isCurrentAnswerCorrect ", isCurrentAnswerCorrect);

      let index = quizAssessment?.assessment?.findIndex(
        (x) => x.questionRef == crntQuestionRef
      );
      // console.log("index ", index);
      //previously not answerd
      if (index == -1) {
        if (isCurrentAnswerCorrect) {
          await QuizAssessmentModel.updateOne(
            { quizRef: quizRef, studentRef: studentRef },
            {
              $push: {
                assessment: {
                  questionRef: crntQuestionRef,
                  submittedAns: answer,
                },
              },
              $inc: { marksObtained: 1 },
            }
          );
        } else {
          await QuizAssessmentModel.updateOne(
            { quizRef: quizRef, studentRef: studentRef },
            {
              $push: {
                assessment: {
                  questionRef: crntQuestionRef,
                  submittedAns: answer,
                },
              },
            }
          );
        }
      }
      //previously answerd
      else {
        let isPreviousAnswerCorrect = checkCurrentAnswer(
          questionFind?.correctAns,
          quizAssessment?.assessment?.[index]?.submittedAns
        );
        // console.log("isPreviousAnswerCorrect ", isPreviousAnswerCorrect);
        // previous answer was incorrect, current answer is correct
        if (isCurrentAnswerCorrect && !isPreviousAnswerCorrect) {
          await QuizAssessmentModel.updateOne(
            {
              quizRef: quizRef,
              studentRef: studentRef,
              "assessment.questionRef": crntQuestionRef,
            },
            {
              $set: {
                "assessment.$.submittedAns": answer,
              },
              $inc: { marksObtained: 1 },
            }
          );
        }
        // previous answer  ncorrect, current answer is incorrect
        else if (!isCurrentAnswerCorrect && isPreviousAnswerCorrect) {
          // console.log("dec");
          await QuizAssessmentModel.updateOne(
            {
              quizRef: quizRef,
              studentRef: studentRef,
              "assessment.questionRef": crntQuestionRef,
            },
            {
              $set: {
                "assessment.$.submittedAns": answer,
              },
              $inc: { marksObtained: -1 },
            }
          );
        }
        // both answer anre correct or both ans is incorrect
        else if (
          (!isCurrentAnswerCorrect && !isPreviousAnswerCorrect) ||
          (isCurrentAnswerCorrect && isPreviousAnswerCorrect)
        ) {
          await QuizAssessmentModel.updateOne(
            {
              quizRef: quizRef,
              studentRef: studentRef,
              "assessment.questionRef": crntQuestionRef,
            },
            {
              $set: {
                "assessment.$.submittedAns": answer,
              },
            }
          );
        }
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully submitted the answer for this question"
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

  async submitQuiz(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to get quiz",
          validation
        );
      }
      let { studentRef, quizRef } = req.body;

      const quizFind = await QuizModel.findById({ _id: quizRef });
      // console.log("quizFind ", quizFind);
      if (!quizFind) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Quiz is not found");
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
      //check if teacher have access to this coure
      if (!studentFind?.enrolledCoursesRef?.includes(quizFind?.courseRef)) {
        return sendResponse(
          res,
          HTTP_STATUS.FORBIDDEN,
          "You are not the student for this course"
        );
      }

      // find quiz assessment
      const quizAssessment = await QuizAssessmentModel.findOne({
        quizRef: quizRef,
        studentRef: studentRef,
      });
      // console.log(quizAssessment);
      if (!quizAssessment) {
        return sendResponse(res, HTTP_STATUS.FORBIDDEN, "Start the quiz first");
      }
      //check if quiz is running
      const timestamp1 = new Date();
      const timestamp2 = new Date(quizAssessment?.endTime);
      const timeDifferenceInMilliseconds = timestamp2 - timestamp1;
      const timeDifference = timeDifferenceInMilliseconds / (1000 * 60);
      // console.log(timeDifference);
      if (timeDifference < 0) {
        return sendResponse(res, HTTP_STATUS.FORBIDDEN, "Sorry Time Over");
      }

      let total = quizFind?.questionsRef.length;
      let marksObtained = quizAssessment?.marksObtained;
      // console.log(total, marksObtained);
      let percentage = parseFloat(((marksObtained / total) * 100).toFixed(2));
      // console.log(percentage, quizFind?.passMarkPercentage);

      let currentTime = new Date();

      if (percentage >= quizFind?.passMarkPercentage) {
        await QuizAssessmentModel.updateOne(
          { quizRef: quizRef, studentRef: studentRef },
          {
            $set: {
              percentage: percentage,
              status: "passed",
              endTime: currentTime,
            },
          }
        );

        await ProgressModel.updateOne(
          { courseRef: quizFind?.courseRef, studentRef: studentRef },
          {
            $addToSet: {
              completedQuizzesRef: quizFind?._id,
            },
            $set: {
              courseRef: quizFind?.courseRef,
              studentRef: studentRef,
            },
          },
          {
            upsert: true,
          }
        );

        let findMarks = await MarksModel.findOne({
          courseRef: quizFind?.courseRef,
          studentRef: studentRef,
        });

        // console.log("findMarks ", findMarks);

        // no marks entry exist for this course
        if (!findMarks) {
          let newlyMarks = await MarksModel.create({
            courseRef: quizFind?.courseRef,
            studentRef: studentRef,
            quizzesRef: [{ quizRef: quizRef, marksObtained: marksObtained }],
          });
          // console.log("newlyMarks ", newlyMarks);
        }
        // already have marks entry
        else {
          const index = findMarks?.quizzesRef?.findIndex(
            (x) => x.quizRef.toString() == quizRef
          );
          // console.log("index ", index);
          // the course already exist in marks
          if (index != -1) {
            await MarksModel.updateOne(
              {
                courseRef: quizFind?.courseRef,
                studentRef: studentRef,
                "quizzesRef.quizRef": quizRef,
              },
              {
                $set: {
                  "quizzesRef.$.marksObtained": marksObtained,
                },
              }
            );
          } else {
            await MarksModel.updateOne(
              {
                courseRef: quizFind?.courseRef,
                studentRef: studentRef,
              },
              {
                $push: {
                  quizzesRef: {
                    quizRef: quizRef,
                    marksObtained: marksObtained,
                  },
                },
              }
            );
          }
        }
      } else {
        await QuizAssessmentModel.updateOne(
          { quizRef: quizRef, studentRef: studentRef },
          { $set: { percentage: percentage, endTime: currentTime } }
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully submitted the quiz"
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
          "Failed to load quiz",
          validation
        );
      }
      const { studentRef, quizRef } = req.body;

      const quizAssesmentFind = await QuizAssessmentModel.find({
        quizRef: quizRef,
        studentRef: studentRef,
      });

      if (!quizAssesmentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Assessment is not found"
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
      // if (
      //   !studentFind?.enrolledCoursesRef?.includes(quizAssesmentFind?.courseRef)
      // ) {
      //   return sendResponse(
      //     res,
      //     HTTP_STATUS.FORBIDDEN,
      //     "You are not the student for this course....."
      //   );
      // }

      const quizAssessment = await QuizAssessmentModel.findOne({
        quizRef: quizRef,
        studentRef: studentRef,
      });

      // dekhte hobe pass korse kina
      const quiz = await QuizModel.findOne({
        _id: quizRef,
      });

      // console.log("quiz ", quiz);

      let quizData = {};
      if (quizAssessment) {
        quizData.isTried = true;
        if (new Date(quizAssessment.endTime) > Date.now()) {
          quizData.isRunning = true;
        }
        quizData.status = quizAssessment.status;
        quizData.submittedAt = quizAssessment.updatedAt;
        quizData.marksObtained = quizAssessment.marksObtained;
        quizData.percentage = quizAssessment.percentage;
      }
      quizData.duration = quiz.durationInMinute;
      quizData.passMarkPercentage = quiz.passMarkPercentage;
      quizData.questionCount = quiz.questionsRef.length;

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Loaded the assessment Info",
        quizData
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

  async getMyAnswer(req, res) {
    try {
      insertInLog(req?.originalUrl, req.query, req.params, req.body);
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to load my answer",
          validation
        );
      }
      const { studentRef, quizRef, questionRef } = req.body;

      const quizAssesmentFind = await QuizAssessmentModel.findOne({
        quizRef: quizRef,
        studentRef: studentRef,
      });

      if (!quizAssesmentFind) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Assessment is not found"
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

      // console.log(quizAssesmentFind?.assessment);

      let myAnswer = quizAssesmentFind?.assessment?.find((x) => {
        if (x.questionRef == questionRef) {
          return x;
        }
      });

      return sendResponse(res, HTTP_STATUS.OK, "Loaded my answer", myAnswer);
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
module.exports = new QuizAssessmentController();
