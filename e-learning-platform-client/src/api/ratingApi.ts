import { ratingCreate } from "../types/rating.type";
import { axiosInstanceToken } from "../utils/axiosCreate";

class RatingApi {
  endPoints = {
    createRating: "/rating/upsert",
    getRatingByStudent: "/rating/get-by-student-id",
    deleteRating: "/rating/delete",
  };

  createRating = async (data: ratingCreate) => {
    let result = await axiosInstanceToken.post(
      this.endPoints.createRating,
      data
    );
    return result;
  };

  getRatingByStudent = async (props: { studentId: string }) => {
    let url = this.endPoints.getRatingByStudent;
    if (props?.studentId) {
      url += `/${props?.studentId}`;
    }
    console.log("url ", url);
    let data = await axiosInstanceToken.get(url);
    return data;
  };

  deleteRating = async (props: { studentRef: string; courseRef: string }) => {
    let result = await axiosInstanceToken.post(
      this.endPoints.deleteRating,
      props
    );
    return result;
  };
}

export default new RatingApi();
