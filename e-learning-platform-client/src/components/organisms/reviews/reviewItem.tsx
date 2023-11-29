import React from "react";
import { ReviewRating } from "../../../types/review.type";
import ReactStars from "react-rating-stars-component";
import Img from "../../atoms/image/img";
import userImg from "../../../assets/images/user.png";
import helperFunction from "../../../utils/helper";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import ReviewModal from "../reviewModal/reviewModal";

type Props = {
  props: ReviewRating;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ReviewItem({ props, setReload, reload }: Props) {
  const { formatTimeDate } = helperFunction();
  const user = useSelector((state: any) => state.auth?.userData);
  // console.log(user?.userRef?.studentRef, props?.studentRef);

  const [showReviewCourse, setShowReviewCourse] = React.useState(false);
  const [courseId, setCourseId] = React.useState("");
  const handleReviewOpen = () => {
    if (props?.courseRef) {
      setShowReviewCourse(!showReviewCourse);
      setCourseId(props?.courseRef);
    }
  };

  // console.log("new dataaaaaaaaaaaaaaaaaaaaaaaaaaa -", props?.rating);
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
      {showReviewCourse && (
        <ReviewModal
          showReviewCourse={showReviewCourse}
          handleReviewOpen={handleReviewOpen}
          courseId={courseId}
          setReload={setReload}
          reload={reload}
        />
      )}
      <div className="p-4 bg-gray-100  flex items-center justify-between ">
        <div className="flex items-center">
          <Img
            src={props?.userImage ? props?.userImage : userImg}
            style={{ height: "35px", width: "35px" }}
            className="rounded-full border me-4"
          />
          <div>
            <p className="text-base text-black capitalize">{props?.userName}</p>
            <p className="text-xs">
              {props?.createdAt && formatTimeDate(props?.createdAt)}
            </p>
          </div>
        </div>
        {/* {props.rating && ( */}
        <ReactStars
          count={5}
          size={18}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          activeColor="#ffd700"
          value={props.rating}
          edit={false}
        />
        {/* )} */}
      </div>
      <div className="p-3 flex justify-between">
        <div className="me-3">
          <p className="text-gray-700">{props.review}</p>
        </div>
        <div
          className={`${
            user?.userRef?.studentRef == props?.studentRef
              ? "visible me-3"
              : "hidden"
          }`}
        >
          <FaEdit
            size={20}
            className="cursor-pointer "
            onClick={() => {
              handleReviewOpen();
            }}
          />
        </div>
      </div>
    </div>
  );
}
