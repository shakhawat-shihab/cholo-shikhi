import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminNotification, GeneralNotification } from "../../types/notification.type";
import notificationApi from "../../api/notificationApi";

const useNotificationHook = () => {
  const [adminNotification, setAdminNotification] =
    useState<AdminNotification | null>(null);

  const [notification,setNotification]=useState<GeneralNotification|undefined>(undefined)
  const [isLoadingNotification, setIsLoadingNotification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const loadAdminNotifications = async () => {
    setIsLoadingNotification(true);
    try {
      const res = await notificationApi.loadAdminNotifications();
      console.log(res?.data?.data);
      setAdminNotification(res?.data?.data);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      setAdminNotification(null);
      // toast.error(message);
    } finally {
      setIsLoadingNotification(false);
    }
  };

  const loadNotificationByUser=async (userRef:string) => {
    setIsLoadingNotification(true);
    try {
      const res = await notificationApi.loadNotificationByUser(userRef);
      console.log("notif   ",res?.data?.data);
      setNotification(res?.data?.data);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      setNotification(undefined);
      // toast.error(message);
    } finally {
      setIsLoadingNotification(false);
    }
  };


  const readAdminNotification=async () => {
    setIsLoadingNotification(true);
    try {
      const res = await notificationApi.readAdminNotification();
      console.log("notif   ",res?.data?.data);
      setAdminNotification(null);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      // toast.error(message);
    } finally {
      setIsLoadingNotification(false);
    }
  };

  const readUserNotification=async (userRef:string) => {
    setIsLoadingNotification(true);
    try {
      const res = await notificationApi.readUserNotification(userRef);
      // console.log("notif   ",res?.data?.data);
      setNotification(undefined);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load modules";
      }
      // toast.error(message);
    } finally {
      setIsLoadingNotification(false);
    }
  };

  return {
    loadAdminNotifications,
    loadNotificationByUser,
    readAdminNotification,
    readUserNotification,
    isLoadingNotification,
    adminNotification,
    notification,
    isSuccess,
  };
};

export default useNotificationHook;
