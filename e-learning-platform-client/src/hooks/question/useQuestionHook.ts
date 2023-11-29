import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Quiz, quizCreate } from "../../types/quiz.type";
import questionApi from "../../api/questionApi";
import { QuestionCreate } from "../../types/question.type";



const useQuestionHook = () => {
//   const [quizzes, setQuizzes] = useState<Quiz | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const createQuestion = async (data: QuestionCreate) => {
    try {
        setIsLoadingQuestion(true);
        setIsSuccess(false);
      const res = await questionApi.createQuestion(data);
      //   console.log("res ", res);
      toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to create question";
      }
      setIsSuccess(false);
      toast.error(message);
    } finally {
        setIsLoadingQuestion(false);
    }
  };

  const updateQuestion = async (data: QuestionCreate) => {
    try {
        setIsLoadingQuestion(true);
        setIsSuccess(false);
      const res = await questionApi.updateQuestion(data);
      //   console.log("res ", res);
      toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to update question";
      }
      setIsSuccess(false);
      toast.error(message);
    } finally {
        setIsLoadingQuestion(false);
    }
  };

  return {
    isLoadingQuestion,
    isSuccess,
    createQuestion,
    updateQuestion
  };
};

export default useQuestionHook;
