import { contentCreate } from "../types/content.type";
import { reviewCreate } from "../types/review.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class ReviewApi {
  endPoints = {
    createReview: "/review/upsert",
    getReviewById: "/review/get-by-id",
    getReview: "/review/get-review",
    getAllReviewsOfCourse: "/review/get-all",
    deleteReview: "/review/delete",
  };

  createReview = async (data: reviewCreate) => {
    let result = await axiosInstanceToken.post(
      this.endPoints.createReview,
      data
    );
    return result;
  };

  getReviewById = async (props: { reviewId: string }) => {
    let url = this.endPoints.getReviewById;
    if (props?.reviewId) {
      url += `/${props?.reviewId}`;
    }
    console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  getReview = async (props: { studentRef: string; courseRef: string }) => {
    let url = this.endPoints.getReview;
    // console.log("url ", url);
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };

  getAllReviewsOfCourse = async (props: { courseId: string }) => {
    let url = this.endPoints.getAllReviewsOfCourse;
    if (props?.courseId) {
      url += `/${props?.courseId}`;
    }
    // console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  deleteReview = async (props: { courseRef: string; studentRef: string }) => {
    let url = this.endPoints.deleteReview;
    let data = await axiosInstanceToken.post(url, props);
    return data;
  };
}

export default new ReviewApi();
