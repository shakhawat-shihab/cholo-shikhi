import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Module, ModuleDetails, moduleCreate } from "../../types/module.type";
import moduleApi from "../../api/moduleApi";

const useModuleHook = () => {
  const [modules, setModules] = useState<Module | null>(null);
  const [moduleDetails, setModuleDetails] = useState<ModuleDetails | null>(
    null
  );
  const [isLoadingModule, setIsLoadingModule] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const loadModuleWithoutDetail = async (props: {
    courseId: string;
    teacherRef: string;
  }) => {
    setIsLoadingModule(true);
    try {
      const res = await moduleApi.loadModuleWithoutDetail(props);
      // console.log(res?.data);
      setModules(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      setModules(null);
      // toast.error(message);
    } finally {
      setIsLoadingModule(false);
    }
  };

  const loadModuleWithDetail = async (props: {
    courseId: string;
    teacherRef: string;
  }) => {
    setIsLoadingModule(true);
    try {
      const res = await moduleApi.loadModuleWithDetail(props);

      setModuleDetails(res?.data?.data);
      res?.data?.data;
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      setModuleDetails(null);
      null;
      // toast.error(message);
    } finally {
      setIsLoadingModule(false);
    }
  };

  const loadModuleByStudent = async (props: {
    courseId: string;
    studentRef: string;
  }) => {
    try {
      setIsLoadingModule(true);
      const res = await moduleApi.loadModuleByStudent(props);
      console.log("studentModule ",res?.data?.data);
      setModuleDetails(res?.data?.data);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      setModuleDetails(null);
    } finally {
      setIsLoadingModule(false);
    }
  };

  const loadModuleByGeneralUser = async (props: { courseId: string }) => {
    setIsLoadingModule(true);
    try {
      const res = await moduleApi.loadModuleByGeneralUser(props);
      console.log(res?.data?.data);
      setModuleDetails(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      setModuleDetails(null);
      // toast.error(message);
    } finally {
      setIsLoadingModule(false);
    }
  };

  const createModule = async (data: moduleCreate) => {
    setIsLoadingModule(true);
    try {
      const res = await moduleApi.createModule(data);
      //   console.log("res ", res);
      setIsSuccess(true);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to create module";
      }
      setIsSuccess(false);
      toast.error(message);
    } finally {
      setIsLoadingModule(false);
    }
  };

  const completeModule = async (data: { moduleRef: string; studentRef: string }) => {
    setIsLoadingModule(true);
    try {
      const res = await moduleApi.completeModule(data);
      setIsSuccess(true);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to complete module";
      }
      setIsSuccess(false);
      toast.error(message);
    } finally {
      setIsLoadingModule(false);
    }
  };



  return {
    modules,
    isLoadingModule,
    createModule,
    loadModuleWithoutDetail,
    loadModuleByGeneralUser,
    loadModuleByStudent,
    loadModuleWithDetail,
    completeModule,
    moduleDetails,
    isSuccess,
  };
};

export default useModuleHook;
