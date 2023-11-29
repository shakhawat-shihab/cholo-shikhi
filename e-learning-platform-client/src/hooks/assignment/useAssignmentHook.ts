import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import wishlistApi from "../../api/wishlistApi";
import {
  addToWishlistRedux,
  loadWishlistRedux,
  removeFromWishlistRedux,
} from "../../redux/slices/wishlistSlice";
import { Assignment, AssignmentBasic, assignmentCreate } from "../../types/assignment.type";
import assignmentApi from "../../api/assignmentApi";



const useAssignmentHook = () => {
 
   const [isLoadingAssignment, setIsLoadingAssignment]=useState(false);
   const [assignment, setAssignment]=useState<Assignment|undefined>(undefined);
   const [assignmentBasic, setAssignmentBasic]=useState<AssignmentBasic[]>([]);


  const createAssignment=async (data:assignmentCreate) => {
    setIsLoadingAssignment(true);
    try {
      const res = await assignmentApi.createAssignment(data);
      console.log("res?.data?.data ", res?.data?.data);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to create assignment";
      }
      toast.error(message);
    } finally {
      setIsLoadingAssignment(false);
    }
  };

  const getAssignmentById=async (assignmentId:string) => {
    setIsLoadingAssignment(true);
    try {
      const res = await assignmentApi.getAssignmentById(assignmentId);
      // console.log("res?.data assignment ", res?.data);
      setAssignment(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        // message = "Failed to get assignment";
      }
      toast.error(message);
    } finally {
      setIsLoadingAssignment(false);
    }
  };

    const completeAssignment = async (props: {
    studentRef: string;
    assignmentRef: string;
  }) => {
    setIsLoadingAssignment(true);
    try {
      const res = await assignmentApi.completeAssignment(props);
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
      setIsLoadingAssignment(false);
    }
  };

  const getAllAssignmentByCourseId= async (courseId:string) => {
    setIsLoadingAssignment(true);
    try {
      const res = await assignmentApi.getAllAssignmentByCourseId(courseId);
      // toast.success(res?.data?.message);
      setIsLoadingAssignment(false);
      setAssignmentBasic(res?.data?.data)
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load assignment";
      }
      setAssignmentBasic([])
      // toast.error(message);
    } finally {
      setIsLoadingAssignment(false);
    }
  };




  return {
    isLoadingAssignment,
    assignment,
    assignmentBasic,
    createAssignment,
    getAssignmentById,
    completeAssignment,
    getAllAssignmentByCourseId
  };
};

export default useAssignmentHook;
