import { useEffect, useState } from "react";
import notificationApi from "../../api/notificationApi";
import { Forum } from "../../types/forum.type";
import forumApi from "../../api/forumApi";
import { toast } from "react-toastify";

const useForumHook = () => {
 const [isLoadingForum,setIsloadingForum]=useState(false);
 const [forum, setForum]=useState<Forum|undefined>(undefined);

  const loadForumByCourse = async (courseId:string) => {
    setIsloadingForum(true);
    try {
      const res = await forumApi.loadForumByCourse(courseId);
      console.log("foruuuum ",res?.data?.data);
      setForum(res?.data?.data);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      setForum(undefined);
      // toast.error(message);
    } finally {
      setIsloadingForum(false);
    }
  };


  const replyToQuestion = async (props: {
    questionRef?: string;
    courseRef?: string;
    answer?: string;
    userRef?:string;
  }) => {
    setIsloadingForum(true);
    try {
      const res = await forumApi.replyToQuestion(props);
      // console.log("foruuuum ",res?.data?.data);
      toast.success(res?.data?.message)
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      toast.error(message);
    } finally {
      setIsloadingForum(false);
    }
  };

  const askQuestion = async (props: {
    questionRef?: string;
    courseRef?: string;
    question?: string;
    userRef?:string;
  }) => {
    setIsloadingForum(true);
    try {
      const res = await forumApi.addQuestion(props);
      // console.log("foruuuum ",res?.data?.data);
      toast.success(res?.data?.message)
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to ask question";
      }
      toast.error(message);
    } finally {
      setIsloadingForum(false);
    }
  };





  return {
    loadForumByCourse,
    forum,
    isLoadingForum,
    replyToQuestion,
    askQuestion

  };
};

export default useForumHook;
