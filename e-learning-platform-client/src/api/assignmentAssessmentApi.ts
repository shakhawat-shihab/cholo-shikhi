import { axiosInstanceToken } from "../utils/axiosCreate";

class QuizApi {
  endPoints = {
    getMyAssessment: "/assignment-assessment/get-my-assessment",
    startAssessment: "/assignment-assessment/create",
    assignmentAssessmentSubmit: "/assignment-assessment/submit",
    getAssessmentByTeacher: "/assignment-assessment/get-all",
    assignMarks:"/assignment-assessment/assign-marks"
  };

  startAssessment = async (props: {
    studentRef: string;
    assignmentRef: string;
  }) => {
    console.log(props);
    let data = await axiosInstanceToken.post(this.endPoints.startAssessment, props);
    return data;
  };

  getMyAssessment = async (props: {
    studentRef: string;
    assignmentRef: string;
  }) => {
    console.log(props);
    let url = this.endPoints.getMyAssessment;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };


  assignmentAssessmentSubmit = async (props: {
    studentRef: string;
    assignmentRef: string;
    document:File
  }) => {
    console.log("assignment submit ", props);
    const formData=new FormData();
    formData.append("studentRef", props?.studentRef)
    formData.append("assignmentRef", props?.assignmentRef)
    formData.append("document", props?.document)
    let url = this.endPoints.assignmentAssessmentSubmit;
    let data = await axiosInstanceToken.post(url, formData);
    return data;
  };

  getAssessmentByTeacher=async (props: {
    teacherRef: string;
    assignmentRef: string;
  }) => {
    // console.log("assignment submit ", props);
    let url = this.endPoints.getAssessmentByTeacher;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };

  assignMarks = async (props: { studentRef: string; assignmentRef: string, teacherRef:string, marks:number }) => {
    console.log("data to assig marks",props);
    let url = this.endPoints.assignMarks;
    let data = await axiosInstanceToken.patch(url, props);
    return data;
  };

}

export default new QuizApi();
