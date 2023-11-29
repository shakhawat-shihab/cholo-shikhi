import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import reviewApi from "../../api/reviewApi";
import { ReviewRating, reviewCreate } from "../../types/review.type";
import { ReviewDetails } from "../../types/rating.type";

const useReviewHook = () => {
  const [reviews, setReviews] = useState<ReviewRating[]|null>([]);
  const [reviewDetails, setReviewDetails] = useState<ReviewDetails | null>(
    null
  );
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createReview = async (data: reviewCreate) => {
    setIsLoadingReview(true);
    try {
      const res = await reviewApi.createReview(data);
      toast.success(res?.data?.message);
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to add review";
      }
      toast.error(message);
    } finally {
      setIsLoadingReview(false);
    }
  };

  const getAllReviewsOfCourse = async (props: { courseId: string }) => {
    setIsLoadingReview(true);
    try {
      const res = await reviewApi.getAllReviewsOfCourse(props);
      //   console.log("res?.data?.data ", res?.data?.data);
       setReviews( res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load reviews";
      }
      setReviews( []);
      
      // toast.error(message);
    } finally {
      setIsLoadingReview(false);
    }
  };

  const getReviewById = async (props: { reviewId: string }) => {
    setIsLoadingReview(true);
    try {
      const res = await reviewApi.getReviewById(props);
      setReviewDetails(res?.data?.data);
      //   console.log("res?.data?.data ", res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load review";
      }
      setReviewDetails(null);
      // toast.error(message);
    } finally {
      setIsLoadingReview(false);
    }
  };

  const getReview = async (props: {
    studentRef: string;
    courseRef: string;
  }) => {
    setIsLoadingReview(true);
    try {
      const res = await reviewApi.getReview(props);
      console.log("review ", res?.data?.data);
      setReviewDetails(res?.data?.data);
      //   console.log("res?.data?.data ", res?.data?.data);
      // toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to load review";
      }
      setReviewDetails(null);
      // toast.error(message);
    } finally {
      setIsLoadingReview(false);
    }
  };

  const deleteReview = async (props: { courseRef: string, studentRef:string }) => {
    setIsLoadingReview(true);
    try {
      const res = await reviewApi.deleteReview(props);
      toast.success(res?.data?.message);
    } catch (e: any) {
      // console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to delete review";
      }
      // setCourses([]);
      //   setWishlist({
      //     _id: "",
      //     courseDetails: [],
      //   });
      // toast.error(message);
    } finally {
      setIsLoadingReview(false);
    }
  };

  return {
    createReview,
    getAllReviewsOfCourse,
    getReviewById,
    deleteReview,
    getReview,
    reviewDetails,
    isLoadingReview,
    reviews
  };
};

export default useReviewHook;
