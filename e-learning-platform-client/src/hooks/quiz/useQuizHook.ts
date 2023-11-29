import { useEffect, useState } from "react";
import courseApi from "../../api/courseApi";
import { toast } from "react-toastify";
import { category, courseCreate } from "../../utils/types";
import categoryApi from "../../api/categoryApi";
import quizApi from "../../api/quizApi";
import { Quiz, QuizQuestion, quizCreate } from "../../types/quiz.type";

const useQuizHook = () => {
  const [quizzes, setQuizzes] = useState<Quiz | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quizDetials,setQuizDetails]=useState<QuizQuestion|undefined>(undefined)

  const loadAllQuizzes = async (props: {
    teacherRef: string;
    courseRef: string;
  }) => {
    setIsLoadingQuiz(true);
    try {
      const res = await quizApi.getQuizByTeacher(props);
      // console.log(res?.data);
      setQuizzes(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load quiz";
      }
      setQuizzes(null);
      // toast.error(message);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const createQuiz = async (data: quizCreate) => {
    setIsLoadingQuiz(true);
    setIsSuccess(false);
    try {
      const res = await quizApi.createQuiz(data);
      //   console.log("res ", res);
      toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to create quiz";
      }
      setIsSuccess(false);
      toast.error(message);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const loadQuizByIdTeacher = async (props: {
    teacherRef: string;
    quizRef: string;
  }) => {
    setIsLoadingQuiz(true);
    try {
      const res = await quizApi.getQuizWithQuestion(props);
      // console.log(res?.data);
      setQuizDetails(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load quiz";
      }
       setQuizDetails(undefined);
      // toast.error(message);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const completeQuiz = async (props: {
    studentRef: string;
    quizRef: string;
  }) => {
    setIsLoadingQuiz(true);
    try {
      const res = await quizApi.completeQuiz(props);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to complete quiz";
      }
      toast.error(message);
    } finally {
      setIsLoadingQuiz(false);
    }
  };


  return {
    isLoadingQuiz,
    isSuccess,
    quizzes,
    quizDetials,
    createQuiz,
    loadAllQuizzes,
    
    completeQuiz
  };
};

export default useQuizHook;
