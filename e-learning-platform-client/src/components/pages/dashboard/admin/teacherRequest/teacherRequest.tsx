import React, { useEffect } from "react";
import useTeacherHook from "../../../../../hooks/teacher/useTeacherHook";
import TeacherRequestItem from "./teacherRequestItem";
import Loader from "../../../../organisms/loader/loader";
import CustommSpinner from "../../../../organisms/spinner/spinner";
import FullScreenMessage from "../../../../organisms/fullScreenMessage/fullScreenMessage";

type Props = {};

export default function TeacherRequest({}: Props) {
  const { loadAllTeacherRequest, teacherRequest, isLoadingTeacher } =
    useTeacherHook();
  useEffect(() => {
    loadAllTeacherRequest();
  }, []);

  // console.log("teacherRequest ", teacherRequest?.requests);

  return (
    <div className=" h-full  flex ">
      <div className=" bg-white w-full p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2">
        <h2 className="pb-8 text-3xl text-center "> Teacher Request </h2>

        {isLoadingTeacher ? (
          <div className="h-screen flex justify-center items-center  ">
            <CustommSpinner className="h-16 w-16" />
          </div>
        ) : (
          <div>
            {teacherRequest?.requests?.length ? (
              <div className="">
                {teacherRequest?.requests?.map((x: any) => (
                  <TeacherRequestItem key={x?._id} teacherRequest={x} />
                ))}
              </div>
            ) : (
              <FullScreenMessage message="No teacher request found" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
