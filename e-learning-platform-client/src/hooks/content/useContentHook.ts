import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Module, moduleCreate } from "../../types/module.type";
import moduleApi from "../../api/moduleApi";
import { ContentDetails, contentCreate } from "../../types/content.type";
import contentApi from "../../api/contentApi";

const useContentHook = () => {
  //   const [content, setContents] = useState<Module | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [content, setContent] = useState<ContentDetails | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const createContent = async (data: contentCreate) => {
    try {
      setIsLoadingContent(true);
      setIsSuccess(false);
      console.log(data);
      const res = await contentApi.createContent(data);
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
      setIsLoadingContent(false);
    }
  };

  const loadContentByIdGeneral = async (props: { contentId: string }) => {
    try {
      setIsLoadingContent(true);
      setIsForbidden(false);
      const res = await contentApi.loadContentByIdGeneral(props);
      setContent(res?.data?.data);
      // toast.success(res?.data?.message);
      console.log("content ", res?.data?.data);
    } catch (e: any) {
      console.log("error --- ", e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load content";
      }
      if (e.response.status == 403) {
        setIsForbidden(true);
      }
      setContent(undefined);
      // toast.error(message);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const loadContentByIdStudent = async (props: {
    contentId: string;
    studentRef: string;
  }) => {
    try {
      setIsLoadingContent(true);
      setIsForbidden(false);
      const res = await contentApi.loadContentByIdStudent(props);
      setContent(res?.data?.data);
      // toast.success(res?.data?.message);
      // console.log("content ", res?.data?.data);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load content";
      }
      if (e.response.status == 403) {
        setIsForbidden(true);
      }
      setContent(undefined);
      // toast.error(message);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const loadContentByIdAdmin = async (props: { contentId: string }) => {
    try {
      setIsLoadingContent(true);
      setIsForbidden(false);
      const res = await contentApi.loadContentByIdAdmin(props);
      setContent(res?.data?.data);
      // toast.success(res?.data?.message);
      // console.log("content ", res?.data?.data);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load content";
      }
      if (e.response.status == 403) {
        setIsForbidden(true);
      }
      setContent(undefined);
      // toast.error(message);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const loadContentByIdTeacher = async (props: {
    contentId: string;
    teacherRef: string;
  }) => {
    try {
      setIsLoadingContent(true);
      setIsForbidden(false);
      const res = await contentApi.loadContentByIdTeacher(props);
      setContent(res?.data?.data);
      // toast.success(res?.data?.message);
      // console.log("content ", res?.data?.data);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load content";
      }
      if (e.response.status == 403) {
        setIsForbidden(true);
      }
      setContent(undefined);
      // toast.error(message);
    } finally {
      setIsLoadingContent(false);
    }
  };

   const completeContent = async (props: {
    contentRef: string;
    studentRef: string;
  }) => {
    try {
      console.log("props ",props)
      setIsLoadingContent(true);
      const res = await contentApi.completeContent(props);
      // setContent(res?.data?.data);
      toast.success(res?.data?.message);
      // console.log("content ", res?.data?.data);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to complete content";
      }
      // toast.error(message);
    } finally {
      setIsLoadingContent(false);
    }
  };

  return {
    createContent,
    loadContentByIdGeneral,
    loadContentByIdStudent,
    loadContentByIdTeacher,
    loadContentByIdAdmin,
    completeContent,
    content,
    isLoadingContent,
    isSuccess,
    isForbidden,
  };
};

export default useContentHook;
