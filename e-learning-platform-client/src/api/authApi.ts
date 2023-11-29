import { axiosInstanceToken } from "../utils/axiosCreate";
import apiConfig from "./apiConfig";

class AuthApi {
  endPoints = {
    logIn: "/auth/log-in",
    signUp: "/auth/sign-up",
    signUpTeacher: "/auth/sign-up-teacher",
    verifyEmail: "/auth/verify-email",
    forgetPassword: "/auth/forget-password",
    checkPasswordResetToken: "/auth/check-token",
    resetPassword: "/auth/reset-password",
    loadUserByToken: "/auth/check-me",
    logOut: "/auth/logOut",
  };

  // loadAllUser = async () => {
  //   // console.log("input ", input);
  //   let data = await axiosInstanceToken.get("/user/all");
  //   console.log("data ", data);
  //   return data;
  // };

  logIn = async (input: { email: string; password: string }) => {
    // console.log("input ", input);
    let data = await axiosInstanceToken.post(this.endPoints.logIn, input);
    // console.log("data ", data);
    return data;
  };

  signUp = async (input: {
    userName: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
  }) => {
    let data = await axiosInstanceToken.post(this.endPoints.signUp, input);

    return data;
  };

  verifyEmail = async (input: { authId: string; token: string }) => {
    let data = await axiosInstanceToken.post(this.endPoints.verifyEmail, input);
    // .then((res) => res.data);
    return data;
  };

  forgetPassword = async (input: { email: string }) => {
    let data = await axiosInstanceToken.post(
      this.endPoints.forgetPassword,
      input
    );
    // .then((res) => res.data);
    return data;
  };

  checkPasswordResetToken = async (input: {
    authId: string;
    token: string;
  }) => {
    let data = await axiosInstanceToken.post(
      this.endPoints.checkPasswordResetToken,
      input
    );
    // .then((res) => res.data);
    return data;
  };

  resetPassword = async (input: {
    password: string;
    confirmPassword: string;
    authId: string;
    token: string;
  }) => {
    let data = await axiosInstanceToken.post(
      this.endPoints.resetPassword,
      input
    );
    // .then((res) => res.data);
    return data;
  };

  checkUser = async (token: string) => {
    // let token = localStorage.getItem("token");
    // console.log(token);
    let url = this.endPoints.loadUserByToken;
    url += `/${token}`;
    if (token) {
      let data = await axiosInstanceToken.get(url);
      return data;
    }
  };
}

export default new AuthApi();
