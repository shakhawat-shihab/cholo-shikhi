import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { category, courseCreate } from "../../utils/types";
import teacherApi from "../../api/teacherApi";
import { TeacherRequestsInfo, teacherCreate } from "../../types/teacher.type";

const useTeacherHook = () => {
  const [teacherRequest, setTeacherRequest] = useState<
    TeacherRequestsInfo | undefined
  >(undefined);
  const [isLoadingTeacher, setIsLoadingTeacher] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const loadAllTeacherRequest = async () => {
    setIsLoadingTeacher(true);
    try {
      const res = await teacherApi.loadTeacherRequest();
      setTeacherRequest(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load teacher request";
      }
      setTeacherRequest(undefined);
      // toast.error(message);
    } finally {
      setIsLoadingTeacher(false);
    }
  };

  const createTeacherRequest = async (data: teacherCreate) => {
    try {
      setIsLoadingTeacher(true);
      setIsSuccess(false);
      const res = await teacherApi.applyForTeacher(data);
      // console.log("res ", res);
      toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to create teacher request";
      }
      toast.error(message);
      setIsSuccess(false);
    } finally {
      setIsLoadingTeacher(false);
    }
  };

  const approveTeacherRequest = async (id: string) => {
    try {
      setIsLoadingTeacher(true);
      setIsSuccess(false);
      const res = await teacherApi.approveTeacherRequest(id);
      // console.log("res ", res);
      toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to approve teacher request";
      }
      toast.error(message);
      setIsSuccess(false);
    } finally {
      setIsLoadingTeacher(false);
    }
  };

  const denyTeacherRequest = async (id: string) => {
    try {
      setIsLoadingTeacher(true);
      setIsSuccess(false);
      const res = await teacherApi.denyTeacherRequest(id);
      // console.log("res ", res);
      toast.success(res?.data?.message);
      setIsSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to deny teacher request";
      }
      toast.error(message);
      setIsSuccess(false);
    } finally {
      setIsLoadingTeacher(false);
    }
  };

  return {
    isLoadingTeacher,
    teacherRequest,
    createTeacherRequest,
    loadAllTeacherRequest,
    approveTeacherRequest,
    denyTeacherRequest,
    isSuccess,
  };
};

export default useTeacherHook;
