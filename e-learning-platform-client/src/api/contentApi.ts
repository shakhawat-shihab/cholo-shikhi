import { contentCreate } from "../types/content.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class ContentApi {
  endPoints = {
    createContent: "/content/create",
    loadContentByIdGeneral: "/content/get-by-general",
    loadContentByIdStudent: "/content/get-by-student",
    loadContentByIdTeacher: "/content/get-by-teacher",
    loadContentByIdAdmin: "/content/get-by-admin",
    completeContent: "/content/complete-content",
  };

  createContent = async (data: contentCreate) => {
    console.log("data  -   ", data);
    const formData = new FormData();
    data?.title && formData.append("title", data?.title);
    data?.description && formData.append("description", data?.description);
    data?.type && formData.append("type", data?.type);
    data?.isPremium && formData.append("isPremium", data?.isPremium);
    data?.moduleRef && formData.append("moduleRef", data?.moduleRef);
    data?.teacherRef && formData.append("teacherRef", data?.teacherRef);
    data?.courseRef && formData.append("courseRef", data?.courseRef);

    if (
      data?.type == "video" ||
      data?.type == "document" ||
      data?.type == "recordVideo"
    ) {
      data?.content && formData.append("content", data?.content);
    } else if (data?.type == "text") {
      data?.text && formData.append("text", data?.text);
    }
    console.log("formData  -   ", formData);
    let result = await axiosInstanceToken.post(
      this.endPoints.createContent,
      formData
    );
    return result;
  };

  loadContentByIdGeneral = async (props: { contentId: string }) => {
    let url = this.endPoints.loadContentByIdGeneral;
    if (props?.contentId) {
      url += `/${props?.contentId}`;
    }
    console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  loadContentByIdStudent = async (props: {
    contentId: string;
    studentRef: string;
  }) => {
    let url = this.endPoints.loadContentByIdStudent;
    if (props?.contentId) {
      url += `/${props?.contentId}`;
    }
    console.log("url -- ", url);
    let data = await axiosInstanceToken.post(url, {
      studentRef: props.studentRef,
    });
    return data;
  };

  loadContentByIdTeacher = async (props: {
    contentId: string;
    teacherRef: string;
  }) => {
    let url = this.endPoints.loadContentByIdTeacher;
    if (props?.contentId) {
      url += `/${props?.contentId}`;
    }
    // console.log("url ", url);
    let data = await axiosInstanceToken.post(url, {
      teacherRef: props.teacherRef,
    });
    return data;
  };

  loadContentByIdAdmin = async (props: { contentId: string }) => {
    let url = this.endPoints.loadContentByIdAdmin;
    if (props?.contentId) {
      url += `/${props?.contentId}`;
    }
    console.log("url ", url);
    let data = await axiosInstanceToken.post(url);
    return data;
  };

  completeContent = async (props: {
    contentRef: string;
    studentRef: string;
  }) => {
    let url = this.endPoints.completeContent;
    if (props?.contentRef) {
      url += `/${props?.contentRef}`;
    }
    console.log("url ", url);
    let data = await axiosInstanceToken.post(url, {
      studentRef: props.studentRef,
    });
    return data;
  };
}

export default new ContentApi();
