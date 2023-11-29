import { Typography } from "@material-tailwind/react";
import React from "react";
import { CourseDetails } from "../../../types/course.type";
import Img from "../../atoms/image/img";
import teacher from "../../../assets/images/teacher.png";
import { formatTime } from "../../../utils/formatDate";

type Props = {
  courseDetails?: CourseDetails;
};

export default function CourseOverview({ courseDetails }: Props) {
  return (
    <div>
      {/* teacher info*/}
      <div>
        <Img
          src={
            courseDetails?.userDetails?.image
              ? courseDetails?.userDetails?.image
              : teacher
          }
          className="w-full rounded-full bg-white border "
          alt="teacher image"
          style={{ width: "50px", height: "50px" }}
        />
        <Typography as="h4" className="font-bold text-lg text-black">
          {courseDetails?.userDetails?.firstName
            ? courseDetails?.userDetails?.firstName +
              " " +
              courseDetails?.userDetails?.lastName
            : courseDetails?.userDetails?.userName}
        </Typography>
      </div>
      {/* time */}
      <div>
        <Typography as="h6" className="font-bold text-base">
          {courseDetails && formatTime(new Date(courseDetails.createdAt))}
        </Typography>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-10">
        <div className="md:col-span-6 col-span-12">
          <Typography as="h6" className=" text-xl text-black font-semibold">
            Learning Scope:
          </Typography>

          {/* {courseDetails?.learningScope} */}
          <div
            dangerouslySetInnerHTML={{ __html: courseDetails?.learningScope }}
          />
        </div>
        <div className="md:col-span-6 col-span-12">
          <Typography as="h6" className=" text-xl text-black font-semibold">
            Learning Outcome:
          </Typography>
          <div
            dangerouslySetInnerHTML={{ __html: courseDetails?.learningOutcome }}
          />
        </div>
      </div>
    </div>
  );
}
