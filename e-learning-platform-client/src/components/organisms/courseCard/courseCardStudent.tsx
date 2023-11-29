import { IoBookSharp } from "react-icons/io5";
import { PiFeatherBold, PiStudentBold, PiSunFill } from "react-icons/pi";

import demoImg from "../../../assets/images/react.jpg";
import Img from "../../atoms/image/img";
import userImage from "../../../assets/images/teacher.png";
import { useLocation, useNavigate } from "react-router-dom";
import { BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { Button, Progress, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import ReviewModal from "../reviewModal/reviewModal";
import React, { useEffect, useState } from "react";

type Props = {
  props: any;
};

export default function CourseCardStudent({ props }: Props) {
  console.log("props ", props);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: any) => state.auth.userData);

  let clickCard = () => {
    console.log(" clicked card ", props?.title);
    if (location?.pathname?.startsWith("/my-course")) {
      navigate(`/my-course/${props?._id}`);
    }
  };

  function truncateString(inputString: string, maxLength: number) {
    if (inputString.length > maxLength) {
      return inputString.slice(0, maxLength - 3) + "...";
    } else {
      return inputString;
    }
  }

  let [progress, setProgress] = useState(0);
  useEffect(() => {
    if (props?.completedModulesRef && props?.completedModulesRef) {
      let completed = props?.completedModulesRef?.length || 0;
      let all = props?.completedModulesRef?.length || 1;
      let prog = (completed / all) * 100;
      console.log("prog ============ ", prog);
      setProgress(prog);
    }
  }, [props?.completedModulesRef, props?.completedModulesRef]);

  const [showReviewCourse, setShowReviewCourse] = React.useState(false);
  const [courseId, setCourseId] = React.useState("");
  const handleReviewOpen = () => {
    // console.log("inside     ...  ", props?.id);
    // console.log("inside     ...  ", showReviewCourse);
    setShowReviewCourse(!showReviewCourse);
    setCourseId(props?.courseId);
  };

  return (
    <div
      className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 "
      //   onClick={() => clickCard()}
    >
      {showReviewCourse && (
        <ReviewModal
          showReviewCourse={showReviewCourse}
          handleReviewOpen={handleReviewOpen}
          courseId={courseId}
        />
      )}

      <div className="max-w-sm rounded  shadow-lg h-full flex flex-col justify-between">
        <div className="h-5/6 ">
          <Img
            className="w-full"
            src={`${props?.thumbnail ? props?.thumbnail : demoImg}`}
            alt="course thumbnail"
            style={{
              //  width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />

          <div className="px-4">
            {/* teacher */}
            {/* <div className="mb-3 relative">
              <Img
                className="w-full rounded-full -mt-8 bg-white p-1 border "
                src={`${
                  props?.userDetails?.image
                    ? props?.userDetails?.image
                    : userImage
                }`}
                alt="teacher image"
                style={{ width: "70px", height: "70px" }}
              />
              <p className="text-sm">
                <span>{props?.userDetails?.firstName} </span>{" "}
                <span>{props?.userDetails?.lastName}</span>
              </p>
            </div> */}

            {/* title & description */}
            <div className=" mb-4">
              <p className="font-semibold text-lg mb-2 mt-3">
                {truncateString(props?.title, 45)}
              </p>
              {/* <p className="text-gray-600 text-xs ">
                {" "}
                {truncateString(props?.description, 65)}
              </p> */}
            </div>

            {/* category */}
            {/* {props?.categoryRef?.title && (
              <div className=" pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #{props?.categoryRef?.title}
                </span>
              </div>
            )} */}
          </div>
        </div>
        <div className="">
          <div className="border-t px-4 py-3 border-b">
            <div className="w-full">
              <div className="mb-2 flex items-center justify-between gap-4">
                <Typography color="blue-gray" variant="h6">
                  Completed
                </Typography>
                <Typography color="blue-gray" variant="h6">
                  {Math.floor(progress)}%
                </Typography>
              </div>
              <Progress value={progress} />
            </div>
          </div>
          <div className="px-4 py-3 flex justify-between">
            {location?.pathname?.startsWith("/my-course") && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/my-course/${props?.courseId}`);
                }}
                size="sm"
              >
                Continue Course
              </Button>
            )}

            {location?.pathname?.startsWith("/my-course") && (
              <Button
                onClick={(e) => {
                  handleReviewOpen();
                  e.stopPropagation();
                }}
                size="sm"
              >
                Give Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
