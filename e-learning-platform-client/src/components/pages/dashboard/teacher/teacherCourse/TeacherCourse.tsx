import React, { useEffect, useState } from "react";
import useCourseHook from "../../../../../hooks/course/useCourseHook";
import { useSelector } from "react-redux";
import CourseCard from "../../../../organisms/courseCard/courseCard";
import { Spinner } from "@material-tailwind/react";
import CustommSpinner from "../../../../organisms/spinner/spinner";

export default function TeacherCourse(props: any) {
  const user = useSelector((state: any) => state?.auth?.userData);
  const [reload, setReload] = useState(false);
  const { loadTeacherCourses, teacherCourses, isLoadingCourse } =
    useCourseHook();

  useEffect(() => {
    if (user) {
      console.log("@@@@@@@@ Calling API @@@@@@@@");
      loadTeacherCourses(user?.userRef?.teacherRef);
    }
  }, [user, reload]);

  // console.log("teacherCourses ================ ", teacherCourses);

  return (
    <div className=" flex justify-center items-center  ">
      <div className=" bg-white w-full  p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2">
        {isLoadingCourse ? (
          <div className="h-screen flex justify-center items-center  ">
            <CustommSpinner className="h-16 w-16" />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {teacherCourses &&
              teacherCourses?.map((x: any) => (
                <CourseCard
                  key={x?._id}
                  props={x}
                  reload={reload}
                  setReload={setReload}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
