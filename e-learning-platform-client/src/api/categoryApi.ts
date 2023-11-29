import { axiosInstanceToken } from "../utils/axiosCreate";
import { category } from "../utils/types";

class CourseApi {
  endPoints = {
    createCategory: "/category/insert",
    loadCategory: "/category/all",
  };

  createCategory = async (props: category) => {
    console.log(props);
    let data = await axiosInstanceToken.post(this.endPoints.createCategory);
    return data;
  };

  loadcategory = async () => {
    let data = await axiosInstanceToken.get(this.endPoints.loadCategory);
    return data;
  };
}

export default new CourseApi();
