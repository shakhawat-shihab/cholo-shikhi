import React, { useEffect } from "react";
import useCourseHook from "../../../../../hooks/course/useCourseHook";
import CustommSpinner from "../../../../organisms/spinner/spinner";
import CourseCard from "../../../../organisms/courseCard/courseCard";
import FullScreenMessage from "../../../../organisms/fullScreenMessage/fullScreenMessage";

type Props = {};

export default function CourseRequest({}: Props) {
  const { loadRequestedCourse, courses, isLoadingCourse } = useCourseHook();
  useEffect(() => {
    loadRequestedCourse();
  }, []);
  console.log("courses ", courses);

  return (
    <div className=" h-full  flex ">
      <div className=" bg-white w-full p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2">
        <h2 className="pb-8 text-3xl text-center "> Course Request </h2>
        {isLoadingCourse ? (
          <div className="h-screen flex justify-center items-center  ">
            <CustommSpinner className="h-16 w-16" />
          </div>
        ) : (
          <div>
            {courses?.courses?.length ? (
              <div className="grid grid-cols-12 gap-4">
                {courses?.courses?.map((x) => (
                  <CourseCard key={x?._id} props={x} />
                ))}
              </div>
            ) : (
              <FullScreenMessage message="No Course Found" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
