import { axiosInstanceToken } from "../utils/axiosCreate";

class subscriptionApi {
  endPoints = {
    loadSubscription: "/subscription/all?",
    approveCourse: "/subscription/approve-course-access",
    removeCourse: "/subscription/deny-course-access",
    removeSubscriptionRequest: "/subscription/remove-subscription-request",

    // loadCoursesTeacher: "/course/get-teacher-course",
  };

  //   createCourse = async (data: courseCreate) => {
  //     console.log(data);
  //     console.log("createCourse in api ", data);

  //     const formData = new FormData();
  //     data?.title && formData.append("title", data?.title);
  //     data?.description && formData.append("description", data?.description);
  //     data?.learningScope &&
  //       formData.append("learningScope", data?.learningScope);
  //     data?.learningOutcome &&
  //       formData.append("learningOutcome", data?.learningOutcome);
  //     data?.teacherRef && formData.append("teacherRef", data?.teacherRef);
  //     data?.thumbnail && formData.append("thumbnail", data?.thumbnail);
  //     data?.category && formData.append("category", data?.category);

  //     console.log("form data ", formData);
  //     let res = await axiosInstanceToken.post(
  //       this.endPoints.createCourse,
  //       formData
  //     );
  //     return res;
  //   };

  loadSubscription = async (props: { search?: string; page?: number }) => {
    console.log("props?.page", props?.page);
    let url = this.endPoints.loadSubscription;
    if (props?.page) url += `page=${props?.page}&limit=6`;
    if (props?.search) url += `&search=${props?.search}`;
    console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  approveCourse = async (props: {
    subscriptionRef?: string;
    courseRef?: string;
    userRef?: string;
  }) => {
    let data = await axiosInstanceToken.patch(
      this.endPoints.approveCourse,
      props
    );
    return data;
  };

  denyCourse = async (props: {
    subscriptionRef?: string;
    courseRef?: string;
    userRef?: string;
  }) => {
    let data = await axiosInstanceToken.patch(
      this.endPoints.removeCourse,
      props
    );
    return data;
  };

  removeSubscriptionRequest = async (props: {
    userRef: string;
    subscriptionRef: string;
  }) => {
    let data = await axiosInstanceToken.patch(
      this.endPoints.removeSubscriptionRequest,
      props
    );
    return data;
  };
}

export default new subscriptionApi();
