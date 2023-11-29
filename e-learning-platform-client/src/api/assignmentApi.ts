import { assignmentCreate } from "../types/assignment.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class AssignmentApi {
  endPoints = {
    createAssignment: "/assignment/create",
    getAssignmentById:"/assignment/get-by-id",
    getAllAssignmentByCourseId:"/assignment/get-all-by-course-id",
    completeAssignment:"/assignment/complete-assignment"
  };

  createAssignment = async (data:assignmentCreate ) => {
    let formData=new FormData();
    data?.title && formData.append("title", data?.title);
      data?.description && formData.append("description", data?.description);
      data?.moduleRef && formData.append("moduleRef", data?.moduleRef);
      formData.append("teacherRef", data.teacherRef);
      formData.append("courseRef", data?.courseRef);
      data?.total && formData.append("total", data?.total);
      data?.passMarkPercentage &&
        formData.append("passMarkPercentage", data?.passMarkPercentage);
      data?.document && formData.append("document", data?.document);

    let result = await axiosInstanceToken.post(
      this.endPoints.createAssignment,
      formData
    );
    return result;
  };


  getAssignmentById = async (assignmentId:string ) => {
    let url=this.endPoints.getAssignmentById;
    url+=`/${assignmentId}`
    let result = await axiosInstanceToken.get(
     url
    );
    return result;
  };


  getAllAssignmentByCourseId = async (courseId:string ) => {
    let url=this.endPoints.getAllAssignmentByCourseId;
    url+=`/${courseId}`
    let result = await axiosInstanceToken.get(
     url
    );
    return result;
  };

   completeAssignment = async (props: { studentRef: string; assignmentRef: string }) => {
    // console.log(props);
    let url = this.endPoints.completeAssignment;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };
}

export default new AssignmentApi();
