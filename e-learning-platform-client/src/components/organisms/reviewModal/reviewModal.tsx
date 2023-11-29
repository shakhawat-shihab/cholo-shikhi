import {
  ChatBubbleBottomCenterIcon,
  CommandLineIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Step,
  Stepper,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import useRatingHook from "../../../hooks/rating/useRatingHook";
import useReviewHook from "../../../hooks/reviews/useReviewHook";
import { FaTrashAlt } from "react-icons/fa";

type Props = {
  showReviewCourse?: boolean;
  courseId: string;
  handleReviewOpen: () => void;
  reload?: boolean;
  setReload?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ReviewModal({
  showReviewCourse = false,
  courseId,
  handleReviewOpen,
  reload,
  setReload,
}: Props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const handleNext = () => {
    !isLastStep && setActiveStep((cur) => cur + 1);
  };
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  const user = useSelector((state: any) => state?.auth?.userData);
  const [star, setStar] = useState(0);

  const [reviewMessage, setReviewMessage] = useState("");

  const {
    createRating,
    deleteRating,
    isLoadingRating,
    ratingMessage,
    isSuccess,
  } = useRatingHook();

  const {
    createReview,
    isLoadingReview,
    deleteReview,
    getReview,
    reviewDetails,
  } = useReviewHook();

  useState(() => {
    let getReviewInEffect = async () => {
      await getReview({
        studentRef: user?.userRef?.studentRef,
        courseRef: courseId,
      });
    };
    if (showReviewCourse && courseId) getReviewInEffect();
  }, [showReviewCourse]);

  useEffect(() => {
    console.log("reviewDetails ===> ", reviewDetails);
    console.log("star ===> ", reviewDetails?.ratingRef?.rating);
  }, [reviewDetails]);

  const submitRating = async () => {
    if (courseId && user?.userRef?.studentRef && star > 0) {
      await createRating({
        studentRef: user?.userRef?.studentRef,
        courseRef: courseId,
        rating: star,
      });
    }
    // if (star == 0) {
    //   await deleteRating({
    //     studentRef: user?.userRef?.studentRef,
    //     courseRef: courseId,
    //   });
    // }
    setActiveStep((cur) => cur + 1);
    setReload && setReload(!reload);
  };

  const removeRating = async () => {
    await deleteRating({
      studentRef: user?.userRef?.studentRef,
      courseRef: courseId,
    });
    setActiveStep((cur) => cur + 1);
    setReload && setReload(!reload);
  };

  const submitReview = async () => {
    if (courseId && user?.userRef?.studentRef) {
      await createReview({
        studentRef: user?.userRef?.studentRef,
        courseRef: courseId,
        review: reviewMessage,
      });
    }
    handleReviewOpen();
    setReload && setReload(!reload);
  };

  const removeReview = async () => {
    console.log("removing review");
    if (courseId && user?.userRef?.studentRef) {
      await deleteReview({
        studentRef: user?.userRef?.studentRef,
        courseRef: courseId,
      });
    }
    handleReviewOpen();
    setReload && setReload(!reload);
  };

  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    console.log("changing is ratingMessage ", ratingMessage);
    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [ratingMessage]);

  // console.log("reviewDetails ===> ewtwtwrt ", reviewDetails);

  return (
    <div>
      <Dialog
        open={showReviewCourse}
        handler={handleReviewOpen}
        className="opacity-40"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="flex justify-end">
          <div className="">
            <IconButton onClick={handleReviewOpen} className="p-0">
              <IoCloseSharp size={25} className="" />
            </IconButton>
          </div>
        </DialogHeader>

        <DialogHeader className="py-0 justify-center">
          <div>
            <div className="w-56">
              <Stepper
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
              >
                <Step onClick={() => setActiveStep(0)}>
                  <StarIcon className="h-5 w-5" />
                  <div className="absolute  w-max text-center">
                    <Typography
                      variant="h6"
                      color={activeStep === 0 ? "blue-gray" : "gray"}
                      className="mt-16"
                    >
                      Rating
                    </Typography>
                  </div>
                </Step>
                <Step
                  onClick={() => {
                    setActiveStep(1);
                  }}
                >
                  <ChatBubbleBottomCenterIcon className="h-5 w-5" />
                  <div className="absolute  w-max text-center">
                    <Typography
                      variant="h6"
                      color={activeStep === 0 ? "blue-gray" : "gray"}
                      className="mt-16"
                    >
                      Review
                    </Typography>
                  </div>
                </Step>
              </Stepper>
            </div>

            <div className=" flex justify-between my-8">
              <Button
                size="sm"
                className="py-1 capitalize"
                onClick={handlePrev}
                disabled={isFirstStep}
              >
                Previous
              </Button>
              <Button
                size="sm"
                className="py-1  capitalize"
                onClick={handleNext}
                disabled={isLastStep}
              >
                Next
              </Button>
            </div>
            <div
              className={`${isVisible ? "block" : "hidden"}  ${
                isSuccess ? "text-green-700" : "text-red-700"
              }  text-xs  capitalize hover:text-red-500`}
            >
              <p>{ratingMessage}</p>
            </div>
          </div>
        </DialogHeader>
        <DialogBody>
          <div>
            {isFirstStep && (
              <div>
                <div>
                  <Typography variant="h6" className="mt-2 text-center">
                    Please Give a Rating
                  </Typography>
                </div>
                <div className=" flex justify-center items-center">
                  {isLoadingReview == false && (
                    <ReactStars
                      count={5}
                      onChange={(value: number) =>
                        // console.log("start value", value);
                        setStar(value)
                      }
                      size={24}
                      isHalf={true}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                      activeColor="#ffd700"
                      edit={true}
                      value={reviewDetails?.ratingRef?.rating}
                    />
                  )}
                  {reviewDetails?.ratingRef?.rating && (
                    <FaTrashAlt
                      className="text-red-700 ms-4 cursor-pointer"
                      size={22}
                      title="remove rating"
                      onClick={() => removeRating()}
                    />
                  )}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button onClick={() => submitRating()}>Submit</Button>
                </div>
              </div>
            )}

            {isLastStep && (
              <div>
                <div className="text-center flex flex-col justify-center items-center ">
                  <Typography variant="h6" className="mt-2 text-center">
                    Please Give a Review
                  </Typography>
                  <div className="flex justify-center w-96">
                    <Textarea
                      className=""
                      label="Enter a Review"
                      defaultValue={reviewDetails?.review}
                      onChange={(e: any) => setReviewMessage(e?.target?.value)}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <Button onClick={() => submitReview()}>Submit</Button>
                  {reviewDetails?.review && (
                    <Button className="ms-3" onClick={() => removeReview()}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}
