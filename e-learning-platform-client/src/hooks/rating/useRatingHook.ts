import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ratingCreate } from "../../types/rating.type";
import ratingApi from "../../api/ratingApi";

const useRatingHook = () => {
  //   const [reviews, setReviews] = useState<>({});
  const [isLoadingRating, setIsLoadingRating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  const createRating = async (data: ratingCreate) => {
    setIsLoadingRating(true);
    setIsSuccess(false);
    setRatingMessage("");
    try {
      const res = await ratingApi.createRating(data);
      setRatingMessage(res?.data?.message);
    //   toast.success(res?.data?.message);
     setIsSuccess(true);
    } catch (e: any) {
      console.log(e);
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to add rating";
      }
      setRatingMessage(message);
    //   toast.error(message);
       setIsSuccess(false);
    } finally {
      setIsLoadingRating(false);
    }
  };

  const deleteRating = async (props: { studentRef:string, courseRef : string }) => {
    setIsLoadingRating(true);
    setIsSuccess(false);
    setRatingMessage("");
    try {
      const res = await ratingApi.deleteRating(props);
      setRatingMessage(res?.data?.message);
      toast.success(res?.data?.message);
     setIsSuccess(true);
    } catch (e: any) {
      let message = "";
      if (e?.response?.data?.message) {
        message = e?.response?.data?.message;
      } else {
        message = "Failed to delete rating";
      }
       setRatingMessage(message);
      toast.error(message);
       setIsSuccess(false);
    } finally {
      setIsLoadingRating(false);
    }
  };

  return {
    createRating,
    deleteRating,
    isSuccess,
    isLoadingRating,
    ratingMessage
  };
};

export default useRatingHook;
