import { axiosInstanceToken } from "../utils/axiosCreate";
import { category } from "../utils/types";

class cartApi {
  endPoints = {
    loadWishlist: "/wishlist/my-wishlist",
    addToWishlist: "/wishlist/add-course",
    removeFromWishlist: "/wishlist/remove-course",
    moveToCart: "/wishlist/move-to-cart",
  };

  loadWishlist = async (studentId: string) => {
    let url = this.endPoints.loadWishlist;
    url += `/${studentId}`;
    // console.log(url);
    let data = await axiosInstanceToken.get(url);
    // console.log("data ", data);
    return data;
  };

  addToWishlist = async (input: { studentRef: string; courseRef: string }) => {
    // console.log(input);
    let data = await axiosInstanceToken.patch(
      this.endPoints.addToWishlist,
      input
    );
    return data;
  };

  removeFromWishlist = async (input: {
    studentRef: string;
    courseRef: string;
  }) => {
    let data = await axiosInstanceToken.patch(
      this.endPoints.removeFromWishlist,
      input
    );
    return data;
  };

  moveToCart = async (input: { studentRef: string }) => {
    let data = await axiosInstanceToken.post(this.endPoints.moveToCart, input);
    return data;
  };
}

export default new cartApi();
