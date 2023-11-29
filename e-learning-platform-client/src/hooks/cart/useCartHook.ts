import { useEffect, useState } from "react";
import courseApi from "../../api/courseApi";
import { toast } from "react-toastify";
import cartApi from "../../api/cartApi";
import { useDispatch } from "react-redux";
import {
  addToCartRedux,
  loadCartRedux,
  removeFromCartRedux,
} from "../../redux/slices/cartSlice";

interface cartCourse {
  courseId: string;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  teacherUserId: string;
  teacherfirstName: string;
  teacherlastName: string;
  teacherImage: string;
}

export interface Cart {
  _id: string;
  courseDetails: cartCourse[];
}

const useCartHook = () => {
  const [cart, setCart] = useState<Cart>({
    _id: "",
    courseDetails: [],
  });
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  const dispatch = useDispatch();

  const loadCart = async (studentId: string) => {
    setIsLoadingCart(true);
    try {
      const res = await cartApi.loadCart(studentId);
      console.log("res?.data?.data ", res?.data?.data);
      dispatch(loadCartRedux(res?.data?.data?.[0]));
      
      setCart(res?.data?.data?.[0]);

      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load courses";
      }
      // setCourses([]);
      setCart({
        _id: "",
        courseDetails: [],
      });
      // toast.error(message);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const addToCart = async (input: {
    studentRef: string;
    courseRef: string;
  }) => {
    setIsLoadingCart(true);
    try {
      const res = await cartApi.addTocart(input);
      console.log("cart -------------- ", res?.data);
      dispatch(addToCartRedux(res?.data?.data?.[0]));
      toast.success(res?.data?.message);
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to add course";
      }
      // setCourses([]);
      // setCart([]);
      toast.error(message);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const removeFromCart = async (input: {
    studentRef: string;
    courseRef: string;
  }) => {
    try {
      setIsLoadingCart(true);
      const res = await cartApi.removeFromCart(input);
      dispatch(removeFromCartRedux(res?.data?.data?.[0]?._id));
      toast.success(res?.data?.message);
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to remove course";
      }
      toast.error(message);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const checkoutCart = async (input: { studentRef: string }) => {
    try {
      setIsLoadingCart(true);
      const res = await cartApi.checkoutCart(input);
      dispatch(loadCartRedux({ _id: "", courseDetails: [] }));
      toast.success(res?.data?.message);
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed tocheckout";
      }
      toast.error(message);
    } finally {
      setIsLoadingCart(false);
    }
  };

  return {
    loadCart,
    cart,
    addToCart,
    removeFromCart,
    checkoutCart,
    isLoadingCart,
  };
};

export default useCartHook;
