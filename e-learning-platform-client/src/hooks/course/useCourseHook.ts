import { useEffect, useState } from "react";
import courseApi from "../../api/courseApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  courseCreate,
  studentCourses,
  teacherCourses,
} from "../../utils/types";
import { addCourse, setCourseCount } from "../../redux/slices/teacherSlice";
import { CourseDetails } from "../../types/course.type";

interface Course {
  _id: string;
  rating: number | null;
  userDetails: {
    // Define the structure of userDetails
    // Example:
    // name: string;
    // age: number;
    // ...
  };
  teacherDetails: {
    // Define the structure of teacherDetails
    // Example:
    // name: string;
    // expertise: string;
    // ...
  };
  title: string;
  // Add other properties as needed
}

interface CoursesResponse {
  courses: Course[];
  count: number;
  limit: number;
  page: number;
  total: number;
}

const useCourseHook = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState<CoursesResponse | null>({
    courses: [],
    count: 0,
    limit: 0,
    page: 0,
    total: 0,
  });
  const [teacherCourses, setTeacherCourses] = useState<
    teacherCourses[] | null | undefined
  >([]);

  const [enrolledCourses, setEnrolledCourses] = useState<
    studentCourses | null | undefined
  >(null);

  const [completedCourse, setCompletedCourse] = useState<
    studentCourses | null | undefined
  >(null);

  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>();

  const [isSuccess, setSuccess] = useState(true);

  const [isLoadingCourse, setIsLoadingCourse] = useState(false);
  // const [message, setMessage] = useState("");
  // const dispatch = useDispatch();

  const loadAllCourses = async (props: {
    search?: string;
    page?: number;
    category?: string[];
    sortOrder?: string;
    sortParam?: string;
    difficulty?: string;
  }) => {
    try {
      setIsLoadingCourse(true);
      const res = await courseApi.loadCourses(props);
      // console.log(res?.data);
      setCourses(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load courses";
      }
      // setCourses([]);
      setCourses({
        courses: [],
        count: 0,
        limit: 0,
        page: 0,
        total: 0,
      });
      // toast.error(message);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const getCourseById = async (props: { courseId?: string }) => {
    setIsLoadingCourse(true);
    try {
      const res = await courseApi.getCourseById(props);
      // console.log("course by id ", res?.data);
      // console.log(res?.data);
      setCourseDetails(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load courses";
      }
      setCourseDetails(null);
      // toast.error(message);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const createCourse = async (data: courseCreate) => {
    try {
      setIsLoadingCourse(true);
      setSuccess(false);
      // console.log("creating course");
      const res = await courseApi.createCourse(data);
      // console.log("res ", res);
      toast.success(res?.data?.message);
      dispatch(addCourse());
      setSuccess(true);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to create courses";
      }
      toast.error(message);
      setSuccess(false);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const loadTeacherCourses = async (teacherRef: string) => {
    // console.log("teacher courses ----------------- ", teacherCourses);
    setIsLoadingCourse(true);
    try {
      const res = await courseApi.loadTeacherCourses(teacherRef);
      // console.log(res?.data);
      setTeacherCourses(res?.data?.data);
      dispatch(setCourseCount(res?.data?.data?.length));
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load courses";
      }
      // setCourses([]);
      setTeacherCourses([]);
      // toast.error(message);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const loadStudentCourses = async (studentRef: string, params: string) => {
    setIsLoadingCourse(true);
    try {
      const res = await courseApi.loadStudentCourses(studentRef, params);
      if (params == "enrolled") {
        setEnrolledCourses(res?.data?.data);
      } else if (params == "completed") {
        setCompletedCourse(res?.data?.data);
      }
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load enrolled courses";
      }
      if (params == "enrolled") {
        setEnrolledCourses(null);
      } else if (params == "completed") {
        setCompletedCourse(null);
      }
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const updateCourseById = async (input: {
    data: courseCreate;
    courseId: string;
  }) => {
    setIsLoadingCourse(true);
    setSuccess(false);
    try {
      const res = await courseApi.updateCourseById(input);
      // console.log(res?.data);
      setSuccess(true);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load courses";
      }
      // setCourses([]);
      setSuccess(false);
      // toast.error(message);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const loadRequestedCourse = async () => {
    try {
      setIsLoadingCourse(true);
      const res = await courseApi.loadRequestedCourse();
      setCourses(res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load courses";
      }
      // setCourses([]);
      setCourses({
        courses: [],
        count: 0,
        limit: 0,
        page: 0,
        total: 0,
      });
      // toast.error(message);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const publishCourse = async (studentRef: string) => {
    try {
      setIsLoadingCourse(true);
      setSuccess(false);
      const res = await courseApi.publishCourse(studentRef);
      // console.log(res?.data);
      setSuccess(true);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to publish courses";
      }
      setSuccess(false);
      toast.error(message);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const rejectCourse = async (studentRef: string) => {
    try {
      setIsLoadingCourse(true);
      setSuccess(false);
      const res = await courseApi.rejectCourse(studentRef);
      // console.log(res?.data);
      setSuccess(true);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to publish courses";
      }
      setSuccess(false);
      toast.error(message);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const requestToPublish = async (courseId:string, teacherRef: string) => {
    try {
      setIsLoadingCourse(true);
      setSuccess(false);
      const res = await courseApi.requestToPublish(courseId, teacherRef);
      // console.log(res?.data);
      setSuccess(true);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to request publish";
      }
      setSuccess(false);
      toast.error(message);
    } finally {
      setIsLoadingCourse(false);
    }
  };



  return {
    courses,
    teacherCourses,
    isLoadingCourse,
    loadAllCourses,
    loadTeacherCourses,
    createCourse,
    getCourseById,
    updateCourseById,
    loadStudentCourses,
    loadRequestedCourse,
    publishCourse,
    rejectCourse,
    requestToPublish,
    enrolledCourses,
    completedCourse,
    courseDetails,
    isSuccess,
  };
};

export default useCourseHook;
