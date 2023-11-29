import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MyAnswer, MyQuizAssessment, QuestionData } from "../../types/quizAssessment.type";
import quizAssessmentApi from "../../api/quizAssessmentApi";

const useQuizAssessmentHook = () => {
const [myAssessment,setMyAssessment]=useState<MyQuizAssessment|undefined>(undefined);
const [myAnswer,setMyAnswer]=useState<MyAnswer|undefined|null>(undefined);
  const [question, setQuestion] = useState<QuestionData | undefined>(undefined);
  const [isLoadingQuizAssessment, setIsLoadingQuizAssessment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getMyAssessment = async (props: {
    studentRef: string;
    quizRef: string;
  }) => {
    setIsLoadingQuizAssessment(true);
    try {
      const res = await quizAssessmentApi.getMyAssessment(props);
      setMyAssessment(res?.data?.data);

      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load assessment";
      }
      setMyAssessment(undefined);
    } finally {
        setIsLoadingQuizAssessment(false);
    }
  };

  const startQuizAssessment = async (props: {
    studentRef: string;
    quizRef: string;
  }) => {
    setIsLoadingQuizAssessment(true);
    setIsSuccess(false);
    try {
      const res = await quizAssessmentApi.startAssessment(props);
      //   console.log("res ", res);
      toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to start quiz";
      }
      setIsSuccess(false);
      toast.error(message);
    } finally {
      setIsLoadingQuizAssessment(false);
    }
  };

  const quizAssessmentChangeQuestion = async (props: {
    studentRef: string;
    quizRef: string;
    crntQuestionRef?: string;
    operation?: string;
  }) => {
    setIsLoadingQuizAssessment(true);
    setIsSuccess(false);
    try {
      const res = await quizAssessmentApi.quizAssessmentChangeQuestion(props);
      //   console.log("res ", res);
      setQuestion(res?.data?.data);
    //   toast.success(res?.data?.message);
    //   setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load question";
      }
      setQuestion(undefined);
      toast.error(message);
    } finally {
      setIsLoadingQuizAssessment(false);
    }
  };

  const quizAssessmentQuestionAnswer = async (props: {
    studentRef: string;
    quizRef: string;
    crntQuestionRef?: string;
    answer: number[];
  }) => {
    setIsLoadingQuizAssessment(true);
    setIsSuccess(false);
    try {
      const res = await quizAssessmentApi.quizAssessmentQuestionAnswer(props);
      //   console.log("res ", res);
    //   setQuestion(res?.data?.data);
      // toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to answer question";
      }
     
      // toast.error(message);
    } finally {
      setIsLoadingQuizAssessment(false);
    }
  };

  const quizAssessmentSubmit = async (props: {
    studentRef: string;
    quizRef: string;
    
  }) => {
    setIsLoadingQuizAssessment(true);
    setIsSuccess(false);
    try {
      const res = await quizAssessmentApi.quizAssessmentSubmit(props);
      //   console.log("res ", res);
    //   setQuestion(res?.data?.data);
      toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to submit";
      }
     
      toast.error(message);
    } finally {
      setIsLoadingQuizAssessment(false);
    }
  };

  const quizAssessmentMyAnswer= async (props: {
    studentRef: string;
    quizRef: string;
    questionRef: string;
  }) => {
    setIsLoadingQuizAssessment(true);
    try {
      const res = await quizAssessmentApi.quizAssessmentMyAnswer(props);
      setMyAnswer(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load my answer";
      }
      setMyAnswer(undefined);
    } finally {
        setIsLoadingQuizAssessment(false);
    }
  };
  

  return {
    isLoadingQuizAssessment,
    isSuccess,
    myAssessment,
    question,
    myAnswer,
    quizAssessmentMyAnswer,
    getMyAssessment,
    startQuizAssessment,
    quizAssessmentChangeQuestion,
    quizAssessmentQuestionAnswer,
    quizAssessmentSubmit
  };
};

export default useQuizAssessmentHook;
