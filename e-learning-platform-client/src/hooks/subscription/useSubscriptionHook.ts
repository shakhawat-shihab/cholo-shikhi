import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import subscriptionApi from "../../api/subscriptionApi";
import { Subscription } from "../../types/subscription.type";
import {
  approveCourseRedux,
  denyCourseRedux,
  loadSubscriptionRedux,
} from "../../redux/slices/subscriptionSlice";

const useSubscriptionHook = () => {
  const dispatch = useDispatch();
  const [subscription, setSubscription] = useState<Subscription>({
    subscriptions: [],
    count: 0,
    limit: 0,
    page: 0,
    total: 0,
  });

  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [isLoadingApproveDeny, setIsLoadingApproveDeny] = useState(false);

  const loadSubscription = async (props: {
    search?: string;
    page?: number;
  }) => {
    setIsLoadingSubscription(true);
    try {
      const res = await subscriptionApi.loadSubscription(props);
      console.log(res?.data);
      setSubscription(res?.data?.data);
      dispatch(loadSubscriptionRedux(res?.data?.data?.subscriptions));
      // toast.success(res?.data?.message);
    } catch (e: any) {
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load subscription request";
      }
      setSubscription({
        subscriptions: [],
        count: 0,
        limit: 0,
        page: 0,
        total: 0,
      });
      // toast.error(message);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const approveCourse = async (props: {
    subscriptionRef?: string;
    courseRef?: string;
    userRef?: string;
  }) => {
    setIsLoadingApproveDeny(true);
    try {
      const res = await subscriptionApi.approveCourse(props);
      console.log("res?.data  for approve course ", res?.data);
      dispatch(approveCourseRedux(props));
      toast.success(res?.data?.message);
    } catch (e: any) {
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to approve subscription request";
      }
      toast.error(message);
    } finally {
      setIsLoadingApproveDeny(false);
    }
  };

  const denyCourse = async (props: {
    subscriptionRef?: string;
    courseRef?: string;
    userRef?: string;
  }) => {
    setIsLoadingApproveDeny(true);
    try {
      const res = await subscriptionApi.denyCourse(props);
      console.log("res?.data  for deny course ", res?.data);
      dispatch(denyCourseRedux(props));
      toast.success(res?.data?.message);
    } catch (e: any) {
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to deny subscription request";
      }
      toast.error(message);
    } finally {
      setIsLoadingApproveDeny(false);
    }
  };

  const removeSubscriptionRequest = async (props: {
    subscriptionRef: string;
    userRef: string;
  }) => {
    setIsLoadingApproveDeny(true);
    try {
      const res = await subscriptionApi.removeSubscriptionRequest(props);
      dispatch(denyCourseRedux(props));
      toast.success(res?.data?.message);
    } catch (e: any) {
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to remove subscription request";
      }
      toast.error(message);
    } finally {
      setIsLoadingApproveDeny(false);
    }
  };

  return {
    isLoadingSubscription,
    loadSubscription,
    approveCourse,
    denyCourse,
    removeSubscriptionRequest,
    isLoadingApproveDeny,
    subscription,
  };
};

export default useSubscriptionHook;
