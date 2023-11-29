import { teacherCreate } from "../types/teacher.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class teacherApi {
  endPoints = {
    teacherApply: "/teacher/teacher-apply",
    showTeacherRequest: "/teacher/teacher-request",
    approveTeacherRequest: "/teacher/approve-teacher-request",
    denyTeacherRequest: "/teacher/deny-teacher-request",
  };

  loadTeacherRequest = async () => {
    let url = this.endPoints.showTeacherRequest;
    // console.log(url);
    let data = await axiosInstanceToken.get(url);
    // console.log("data ", data);
    return data;
  };

  applyForTeacher = async (input: teacherCreate) => {
    // console.log(input);
    const formData = new FormData();
    formData.append("firstName", input?.firstName);
    formData.append("lastName", input?.lastName);
    formData.append("phone", input?.phone);
    input?.education && formData.append("education", input?.education);
    input?.facebookUrl && formData.append("facebookUrl", input?.facebookUrl);
    input?.twitterUrl && formData.append("twitterUrl", input?.twitterUrl);
    formData.append("resume", input?.resume);

    // console.log("formData ", formData);

    let url = this.endPoints.teacherApply;
    url += `/${input?.userId}`;

    let data = await axiosInstanceToken.post(url, formData);
    return data;
  };

  approveTeacherRequest = async (teacherId: string) => {
    console.log("teacherId ", teacherId);
    let url = this.endPoints.approveTeacherRequest;
    url += `/${teacherId}`;
    let data = await axiosInstanceToken.patch(url);
    return data;
  };

  denyTeacherRequest = async (teacherId: string) => {
    // console.log(input);
    let url = this.endPoints.denyTeacherRequest;
    url += `/${teacherId}`;
    let data = await axiosInstanceToken.patch(url);
    return data;
  };
}

export default new teacherApi();
