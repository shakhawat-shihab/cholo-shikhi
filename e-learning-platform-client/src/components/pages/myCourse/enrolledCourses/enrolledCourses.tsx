import React, { useEffect, useState } from "react";
import useCourseHook from "../../../../hooks/course/useCourseHook";
import { useSelector } from "react-redux";
import CourseCard from "../../../organisms/courseCard/courseCard";
import FullScreenMessage from "../../../organisms/fullScreenMessage/fullScreenMessage";
import CustommSpinner from "../../../organisms/spinner/spinner";
import CourseCardStudent from "../../../organisms/courseCard/courseCardStudent";

type Props = { handleReviewOpen?: () => void };

export default function EnrolledCourses({}: Props) {
  const user = useSelector((state: any) => state.auth.userData);

  const { enrolledCourses, isLoadingCourse, loadStudentCourses } =
    useCourseHook();

  useEffect(() => {
    if (user) {
      loadStudentCourses(user?.userRef?.studentRef, "enrolled");
    }
  }, [user]);

  // console.log("enrolledCourses ", enrolledCourses);

  return (
    <div>
      {isLoadingCourse ? (
        <div className="h-full flex justify-center items-center  ">
          <CustommSpinner className="h-16 w-16" />
        </div>
      ) : (
        <div className="">
          {enrolledCourses?.length ? (
            <div className="grid grid-cols-12 gap-4">
              {enrolledCourses &&
                enrolledCourses?.map((x: any) => (
                  <CourseCardStudent key={x?._id} props={x} />
                ))}
            </div>
          ) : (
            <div>
              <FullScreenMessage message="No Completed course found" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
