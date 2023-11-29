import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import wishlistApi from "../../api/wishlistApi";
import {
  addToWishlistRedux,
  loadWishlistRedux,
  removeFromWishlistRedux,
} from "../../redux/slices/wishlistSlice";

interface wishlistCourse {
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

export interface Wishlist {
  _id: string;
  courseDetails: wishlistCourse[];
}

const useWishlistHook = () => {
  const [wishlist, setWishlist] = useState<Wishlist>({
    _id: "",
    courseDetails: [],
  });
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  const dispatch = useDispatch();

  const loadWishlist = async (studentId: string) => {
    setIsLoadingWishlist(true);
    try {
      const res = await wishlistApi.loadWishlist(studentId);
      console.log("res?.data?.data ", res?.data?.data);
      dispatch(loadWishlistRedux(res?.data?.data?.[0]));
      setWishlist(res?.data?.data?.[0]);

      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load wishlist";
      }
      // setCourses([]);
      setWishlist({
        _id: "",
        courseDetails: [],
      });
      // toast.error(message);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const addToWishlist = async (input: {
    studentRef: string;
    courseRef: string;
  }) => {
    setIsLoadingWishlist(true);
    try {
      const res = await wishlistApi.addToWishlist(input);
      //   console.log("wishlist -------------- ", res?.data);
      dispatch(addToWishlistRedux(res?.data?.data?.[0]));
      toast.success(res?.data?.message);
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to add wishlist";
      }
      // setCourses([]);
      // setWishlist([]);
      toast.error(message);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const removeFromWishlist = async (input: {
    studentRef: string;
    courseRef: string;
  }) => {
    setIsLoadingWishlist(true);
    try {
      const res = await wishlistApi.removeFromWishlist(input);
      dispatch(removeFromWishlistRedux(res?.data?.data?.[0]?._id));
      toast.success(res?.data?.message);
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to remove wishlist";
      }
      toast.error(message);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const moveToCart = async (input: { studentRef: string }) => {
    setIsLoadingWishlist(true);
    try {
      const res = await wishlistApi.moveToCart(input);
      dispatch(loadWishlistRedux({ _id: "", courseDetails: [] }));
      toast.success(res?.data?.message);
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to move to wishlist";
      }
      toast.error(message);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  return {
    loadWishlist,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isLoadingWishlist,
  };
};

export default useWishlistHook;
