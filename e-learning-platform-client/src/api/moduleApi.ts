import { moduleCreate } from "../types/module.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class ModuleApi {
  endPoints = {
    createModule: "/module/create",
    loadModuleWithoutDetail: "module/modules-by-course-id-teacher",
    loadModuleWithDetail: "module/modules-by-course-id-teacher",
    loadModuleByStudent: "module/modules-by-course-id-student",
    loadModuleByGeneralUser: "module/modules-by-course-id-general",
    completeModule: "module/complete-module",
  };

  createModule = async (props: moduleCreate) => {
    console.log(props);
    let data = await axiosInstanceToken.post(
      this.endPoints.createModule,
      props
    );
    return data;
  };

  loadModuleWithoutDetail = async (props: {
    courseId: string;
    teacherRef: string;
  }) => {
    let url = this.endPoints.loadModuleWithoutDetail;
    if (props?.courseId) {
      url += `/${props?.courseId}?allInformation=0`;
    }
    const obj = { teacherRef: props.teacherRef };
    console.log("url ", url);
    let data = await axiosInstanceToken.post(url, obj);
    return data;
  };

  loadModuleWithDetail = async (props: {
    courseId: string;
    teacherRef: string;
  }) => {
    let url = this.endPoints.loadModuleWithDetail;
    if (props?.courseId) {
      url += `/${props?.courseId}?allInformation=1`;
    }
    const obj = { teacherRef: props.teacherRef };
    console.log("url ", url);
    let data = await axiosInstanceToken.post(url, obj);
    return data;
  };

  loadModuleByGeneralUser = async (props: { courseId: string }) => {
    let url = this.endPoints.loadModuleByGeneralUser;
    if (props?.courseId) {
      url += `/${props?.courseId}?allInformation=1`;
    }
    console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  loadModuleByStudent = async (props: {
    courseId: string;
    studentRef: string;
  }) => {
    let url = this.endPoints.loadModuleByStudent;
    if (props?.courseId) {
      url += `/${props?.courseId}`;
    }
    console.log("url ", url);
    let data = await axiosInstanceToken.post(url, {
      studentRef: props.studentRef,
    });
    return data;
  };

  completeModule = async (props: { moduleRef: string; studentRef: string }) => {
    let url = this.endPoints.completeModule;
    console.log("url ", url);
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };
}

export default new ModuleApi();
