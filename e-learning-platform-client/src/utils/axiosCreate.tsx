import axios from "axios";
import { useSelector } from "react-redux";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
});

const axiosInstanceToken = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
});

axiosInstanceToken.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // console.log("token ", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // const userData = useSelector((state: any) => state.auth.userData);
  // console.log("userData ", userData);
  // if (userData?.userRef?.token) {
  //   config.headers.Authorization = `Bearer ${userData?.userRef?.token}`;
  // }

  return config;
});

export { axiosInstance, axiosInstanceToken };
