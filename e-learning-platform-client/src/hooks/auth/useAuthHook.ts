import { useEffect, useState } from "react";
import courseApi from "../../api/courseApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { courseCreate, teacherCourses } from "../../utils/types";
import authApi from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import {
  addUserData,
  loadUserInfo,
  removeUserData,
} from "../../redux/slices/authSlice";

const useAuthHook = () => {
  const [user, setUser] = useState();
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logIn = async (props: { email: string; password: string }) => {
    setIsLoadingAuth(true);
    try {
      const res = await authApi.logIn(props);
      // console.log(res?.data);
      setUser(res?.data?.data);
      toast.success(res?.data?.message);
      dispatch(addUserData(res?.data?.data));
      localStorage.setItem("token", res?.data?.data?.token);
      navigate("/");
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to log in";
      }
      toast.error(message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signUp = async (props: {
    userName: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoadingAuth(true);
    try {
      const res = await authApi.signUp(props);
      console.log(res?.data);
      toast.success(res?.data?.message);
      navigate("/");
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to sign up";
      }
      toast.error(message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const verifyEmail = async (props: { authId: string; token: string }) => {
    setIsLoadingAuth(true);
    setSuccess(false);
    setResponse("");
    try {
      const res = await authApi.verifyEmail(props);
      console.log(res?.data);
      //   setCourses(res?.data?.data);
      // toast.success(res?.data?.message);
      setSuccess(true);
      setResponse(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to verify Email";
        setSuccess(false);
        setResponse(message);
      }
      // toast.error(message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const forgetPassword = async (props: { email: string }) => {
    setIsLoadingAuth(true);
    try {
      const res = await authApi.forgetPassword(props);
      console.log(res?.data);
      //   setCourses(res?.data?.data);
      toast.success(res?.data?.message);
      navigate("/");
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to send verification email";
      }
      toast.error(message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const checkPasswordResetToken = async (props: {
    authId: string;
    token: string;
  }) => {
    setIsLoadingAuth(true);
    try {
      const res = await authApi.checkPasswordResetToken(props);
      console.log(res?.data);
      //   setCourses(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Can't change password. Try again";
      }
      navigate("/login");
      toast.error(message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const resetPassword = async (props: {
    password: string;
    confirmPassword: string;
    authId: string;
    token: string;
  }) => {
    setIsLoadingAuth(true);
    try {
      const res = await authApi.resetPassword(props);
      console.log(res?.data);
      //   setCourses(res?.data?.data);
      toast.success(res?.data?.message);
      navigate("/login");
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to reset password";
      }
      toast.error(message);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const checkUser = async (token: string) => {
    setIsLoadingAuth(true);
    try {
      const res = await authApi.checkUser(token);
      console.log(res?.data);
      //   setCourses(res?.data?.data);
      // toast.success(res?.data?.message);
      console.log(res);
      dispatch(loadUserInfo(res?.data?.data));
      // navigate("/log-in");
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "User is not valid";
      }
      // toast.error(message);
      dispatch(removeUserData());
      navigate("/log-in");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  return {
    isLoadingAuth,
    user,
    success,
    response,
    checkPasswordResetToken,
    verifyEmail,
    logIn,
    signUp,
    resetPassword,
    forgetPassword,
    checkUser,
  };
};

export default useAuthHook;
