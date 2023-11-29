import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MyAnswer, MyQuizAssessment, QuestionData } from "../../types/quizAssessment.type";
import quizAssessmentApi from "../../api/quizAssessmentApi";
import assignmentAssessmentApi from "../../api/assignmentAssessmentApi";
import { PendingAssignment } from "../../types/assignmentAssessment";

const useAssignmentAssessmentHook = () => {
const [pendingAssignment,setPendingAssignment]=useState<PendingAssignment[]>([]);
const [myAssignmentAssessment,setMyAssignmentAssessment]=useState<MyQuizAssessment|undefined>(undefined);
const [myAnswer,setMyAnswer]=useState<MyAnswer|undefined|null>(undefined);
  const [isLoadingAssignmentAssessment, setIsLoadingAssignmentAssessment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getMyAssignmentAssessment = async (props: {
    studentRef: string;
    assignmentRef: string;
  }) => {
    setIsLoadingAssignmentAssessment(true);
    try {
      const res = await assignmentAssessmentApi.getMyAssessment(props);
      setMyAssignmentAssessment(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load assessment";
      }
      setMyAssignmentAssessment(undefined);
    } finally {
        setIsLoadingAssignmentAssessment(false);
    }
  };


  const assignmentAssessmentSubmit = async (props: {
    studentRef: string;
    assignmentRef: string;
    document:File
  }) => {
    setIsLoadingAssignmentAssessment(true);
    setIsSuccess(false);
    try {
      const res = await assignmentAssessmentApi.assignmentAssessmentSubmit(props);
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
      setIsLoadingAssignmentAssessment(false);
    }
  };


  const assignMarks = async (props: {
    studentRef: string; assignmentRef: string, teacherRef:string, marks:number
  }) => {
    setIsLoadingAssignmentAssessment(true);
    setIsSuccess(false);
    try {
      const res = await assignmentAssessmentApi.assignMarks(props);
      console.log(res)
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to submit marks";
      }
      toast.error(message);
    } finally {
      setIsLoadingAssignmentAssessment(false);
    }
  };


const getAssessmentByTeacher=async (props: {
    teacherRef: string;
    assignmentRef: string;
  }) => {
    setIsLoadingAssignmentAssessment(true);
    setIsSuccess(false);
    try {
      const res = await assignmentAssessmentApi.getAssessmentByTeacher(props);
      setPendingAssignment(res?.data?.data);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load";
      }
      toast.error(message);
    } finally {
      setIsLoadingAssignmentAssessment(false);
    }
  };


  

  return {
    isLoadingAssignmentAssessment,
    isSuccess,
    myAssignmentAssessment,
    myAnswer,
    getMyAssignmentAssessment,
    assignmentAssessmentSubmit,
    getAssessmentByTeacher,
    pendingAssignment,
    assignMarks
  };
};

export default useAssignmentAssessmentHook;
