import { quizCreate } from "../types/quiz.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class QuizApi {
  endPoints = {
    getMyAssessment: "/quiz-assessment/get-my-assessment",
    startAssessment: "/quiz-assessment/create",
    quizAssessmentChangeQuestion: "/quiz-assessment/change-question",
    quizAssessmentQuestionAnswer: "/quiz-assessment/question-answer",
    quizAssessmentSubmit: "/quiz-assessment/submit",
    quizAssessmentMyAnswer: "/quiz-assessment/my-answer",
  };

  startAssessment = async (props: {
    studentRef: string;
    quizRef: string;
  }) => {
    console.log(props);
    let data = await axiosInstanceToken.post(this.endPoints.startAssessment, props);
    return data;
  };

  getMyAssessment = async (props: {
    studentRef: string;
    quizRef: string;
  }) => {
    console.log(props);
    let url = this.endPoints.getMyAssessment;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };

  quizAssessmentMyAnswer = async (props: {
    studentRef: string;
    quizRef: string;
    questionRef: string;
  }) => {
    console.log(props);
    let url = this.endPoints.quizAssessmentMyAnswer;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };

  quizAssessmentChangeQuestion = async (props: {
    studentRef: string;
    quizRef: string;
    crntQuestionRef?: string;
    operation?: string;
  }) => {
    console.log("change question ", props);
    let url = this.endPoints.quizAssessmentChangeQuestion;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };

  quizAssessmentQuestionAnswer = async (props: {
    studentRef: string;
    quizRef: string;
    crntQuestionRef?: string;
    answer: number[];
  }) => {
    // console.log(props);
    let url = this.endPoints.quizAssessmentQuestionAnswer;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };

  quizAssessmentSubmit = async (props: {
    studentRef: string;
    quizRef: string;
  }) => {
    // console.log(props);
    let url = this.endPoints.quizAssessmentSubmit;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };

}

export default new QuizApi();
