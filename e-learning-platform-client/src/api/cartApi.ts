import { axiosInstanceToken } from "../utils/axiosCreate";
import { category } from "../utils/types";

class cartApi {
  endPoints = {
    loadCart: "/cart/my-cart",
    addTocart: "/cart/add-course",
    removeFromCart: "/cart/remove-course",
    checkoutCart: "/cart/checkout",
  };

  loadCart = async (studentId: string) => {
    let url = this.endPoints.loadCart;
    url += `/${studentId}`;
    // console.log(url);
    let data = await axiosInstanceToken.get(url);
    console.log("data ", data);
    return data;
  };

  addTocart = async (input: { studentRef: string; courseRef: string }) => {
    // console.log(input);
    let data = await axiosInstanceToken.patch(this.endPoints.addTocart, input);
    return data;
  };

  removeFromCart = async (input: { studentRef: string; courseRef: string }) => {
    let data = await axiosInstanceToken.patch(
      this.endPoints.removeFromCart,
      input
    );
    return data;
  };

  checkoutCart = async (input: { studentRef: string }) => {
    let data = await axiosInstanceToken.post(
      this.endPoints.checkoutCart,
      input
    );
    return data;
  };
}

export default new cartApi();
