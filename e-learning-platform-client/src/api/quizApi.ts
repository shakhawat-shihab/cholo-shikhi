import { quizCreate } from "../types/quiz.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class QuizApi {
  endPoints = {
    createQuiz: "/quiz/create",
    getQuizByTeacher: "/quiz/get-by-course-teacher",
    getQuizWithQuestion: "/quiz/get-by-id-teacher",
    completeQuiz: "/quiz/complete-quiz",
  };

  createQuiz = async (props: quizCreate) => {
    console.log(props);
    let data = await axiosInstanceToken.post(this.endPoints.createQuiz, props);
    return data;
  };

  getQuizByTeacher = async (props: {
    teacherRef: string;
    courseRef: string;
  }) => {
    console.log(props);
    let url = this.endPoints.getQuizByTeacher;
    url += `/${props.courseRef}`;
    let data = await axiosInstanceToken.post(url, {
      teacherRef: props.teacherRef,
    });
    return data;
  };

  getQuizWithQuestion = async (props: {
    teacherRef: string;
    quizRef: string;
  }) => {
    console.log(props);
    let url = this.endPoints.getQuizWithQuestion;
    url += `/${props.quizRef}`;
    console.log("url ", url);
    let data = await axiosInstanceToken.post(url, {
      teacherRef: props.teacherRef,
    });
    return data;
  };

  completeQuiz = async (props: { studentRef: string; quizRef: string }) => {
    // console.log(props);
    let url = this.endPoints.completeQuiz;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };
}

export default new QuizApi();
