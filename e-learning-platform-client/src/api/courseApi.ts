import { axiosInstanceToken } from "../utils/axiosCreate";
import { courseCreate } from "../utils/types";

class CourseApi {
  endPoints = {
    createCourse: "/course/create",
    updateCourse: "/course/update",
    loadCourses: "/course/all?",
    getCourseById: "/course/get-by-id",
    loadCoursesTeacher: "/course/get-teacher-course",
    loadStudentCourses: "/course/get-student-course",
    requestToPublish: "/course/request-to-publish",
    loadRequestedCourse: "/course/get-requested-courses",
    publishCourse: "/course/publish-course",
    rejectCourse: "/course/reject-course",
  };

  createCourse = async (data: courseCreate) => {
    console.log(data);
    // console.log("createCourse in api ", data);

    const formData = new FormData();
    data?.title && formData.append("title", data?.title);
    data?.description && formData.append("description", data?.description);
    data?.learningScope &&
      formData.append("learningScope", data?.learningScope);
    data?.learningOutcome &&
      formData.append("learningOutcome", data?.learningOutcome);
    data?.language && formData.append("language", data?.language);
    data?.difficulty && formData.append("difficulty", data?.difficulty);
    data?.teacherRef && formData.append("teacherRef", data?.teacherRef);
    data?.thumbnail && formData.append("thumbnail", data?.thumbnail);
    data?.category && formData.append("category", data?.category);

    // console.log("form data ", formData);
    let res = await axiosInstanceToken.post(
      this.endPoints.createCourse,
      formData
    );
    return res;
  };

  loadCourses = async (props: {
    search?: string;
    page?: number;
    sortOrder?: string;
    sortParam?: string;
    difficulty?: string;
    category?: string[];
  }) => {
    console.log("props?.page", props?.page);
    let url = this.endPoints.loadCourses;
    if (props?.page) url += `page=${props?.page}&limit=3`;
    if (props?.search) url += `&search=${props?.search}`;
    if (props?.category) {
      props?.category?.map((x) => {
        url += `&category=${x}`;
      });
    }
    if (props?.sortParam) {
      url += `&sortParam=${props?.sortParam}`;
    }
    if (props?.sortOrder) {
      url += `&sortOrder=${props?.sortOrder}`;
    }
    if (props?.difficulty) {
      url += `&difficulty=${props?.difficulty}`;
    }

    console.log("url ----------- ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  getCourseById = async (props: { courseId?: string }) => {
    let url = this.endPoints.getCourseById;
    if (props?.courseId) url += `/${props?.courseId}`;
    // console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  loadTeacherCourses = async (teacherRef: string) => {
    let url = this.endPoints.loadCoursesTeacher;
    if (teacherRef) url += `/${teacherRef}`;
    // if (props?.page) url += `page=${props?.page}&limit=2`;
    // if (props?.search) url += `&search=${props?.search}`;
    console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  updateCourseById = async (input: {
    data: courseCreate;
    courseId: string;
  }) => {
    let url = this.endPoints.updateCourse;
    if (input?.courseId) url += `/${input?.courseId}`;
    console.log("url ", url);
    console.log("data ", input?.data);
    const { data } = input;

    const formData = new FormData();
    data?.title && formData.append("title", data?.title);
    data?.description && formData.append("description", data?.description);
    data?.learningScope &&
      formData.append("learningScope", data?.learningScope);
    data?.learningOutcome &&
      formData.append("learningOutcome", data?.learningOutcome);
    data?.teacherRef && formData.append("teacherRef", data?.teacherRef);
    data?.thumbnail && formData.append("thumbnail", data?.thumbnail);
    data?.category && formData.append("category", data?.category);
    let result = await axiosInstanceToken.patch(url, formData);
    return result;
  };

  loadStudentCourses = async (studentRef: string, params: string) => {
    let url = this.endPoints.loadStudentCourses;
    if (studentRef) url += `/${studentRef}?value=${params}`;
    // console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  loadRequestedCourse = async () => {
    let url = this.endPoints.loadRequestedCourse;
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  publishCourse = async (courseId: string) => {
    let url = this.endPoints.publishCourse;
    url += `/${courseId}`;
    let data = await axiosInstanceToken.patch(url);
    return data;
  };

  rejectCourse = async (courseId: string) => {
    let url = this.endPoints.rejectCourse;
    url += `/${courseId}`;
    let data = await axiosInstanceToken.patch(url);
    return data;
  };

  requestToPublish = async (courseId: string, teacherRef: string) => {
    let url = this.endPoints.requestToPublish;
    url += `/${courseId}`;
    let data = await axiosInstanceToken.post(url, { teacherRef: teacherRef });
    return data;
  };
}

export default new CourseApi();
