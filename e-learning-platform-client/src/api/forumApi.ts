import { axiosInstanceToken } from "../utils/axiosCreate";

class subscriptionApi {
  endPoints = {
    loadForumByCourse: "forum/load-forum-by-course",
    replyToQuestion: "forum/answer-question",
    addQuestion: "/forum/post-question",
    // remove: "/subscription/remove-subscription-request",
  };


  loadForumByCourse = async (courseId:string) => {
    let url = this.endPoints.loadForumByCourse;
    // if (props?.page) url += `page=${props?.page}&limit=6`;
    // if (props?.search) url += `&search=${props?.search}`;
    // console.log("url ", url);
    url+=`/${courseId}`;
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  addQuestion = async (props: {
    userRef?: string;
    courseRef?: string;
    question?: string;
  }) => {
    let data = await axiosInstanceToken.post(
      this.endPoints.addQuestion,
      props
    );
    return data;
  };

  replyToQuestion = async (props: {
    questionRef?: string;
    courseRef?: string;
    answer?: string;
    userRef?:string;
  }) => {
    let url= this.endPoints.replyToQuestion;
    url+=`/${props?.questionRef}`
    let data = await axiosInstanceToken.patch(
      url,
      { courseRef: props?.courseRef,
    answer: props?.answer, userRef:props?.userRef}
    );
    return data;
  };

 
}

export default new subscriptionApi();
