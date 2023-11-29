import { QuestionCreate } from "../types/question.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class questionApi {
  endPoints = {
    createQuestion: "/question/create",
    updateQuestion: "/question/update-by-teacher",
  };

  createQuestion = async (props: QuestionCreate) => {
    // console.log(props);
    let data = await axiosInstanceToken.post(this.endPoints.createQuestion, props);
    return data;
  };

  updateQuestion = async (props: QuestionCreate) => {
    // console.log(props);
    let url=this.endPoints.updateQuestion;
    url+=`/${props?._id}`
    console.log("update url", url);
    let data = await axiosInstanceToken.patch(url, props);
    return data;
  };

 
}

export default new questionApi();
