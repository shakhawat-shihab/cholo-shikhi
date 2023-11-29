import React from "react";
import { TeacherRequest } from "../../../../../types/teacher.type";
import Img from "../../../../atoms/image/img";
import demoImg from "../../../../../assets/images/user.png";
import { Button } from "@material-tailwind/react";
import TeacherRequestView from "./teacherRequestView";

export default function TeacherRequestItem(props: {
  teacherRequest: TeacherRequest;
}) {
  const [viewRequest, setViewRequest] = React.useState(false);
  const [teacherRequestId, setTeacherRequestId] = React.useState("");
  const handleRequestOpen = () => {
    // console.log("okkkkkkkkkkkkk");
    setViewRequest(!viewRequest);
  };

  //   console.log("sdfsdf ", viewRequest);
  return (
    <div>
      <TeacherRequestView
        viewRequest={viewRequest}
        handleRequestOpen={handleRequestOpen}
        teacherRequest={props?.teacherRequest}
      />
      {/* <div className="shadow-xl mt-4 rounded border border-black px-2 py-4 my-3"> */}
      <div className="flex items-center  justify-between   my-2 py-8  border rounded px-3">
        <div className="">
          <Img
            src={`${
              props?.teacherRequest?.userDetails?.image
                ? props?.teacherRequest?.userDetails?.image
                : demoImg
            }`}
            alt="course image"
            className="w-4/6 "
          />
        </div>
        <div className="">
          <h3 className="font-bold uppercase">
            {props?.teacherRequest?.userDetails?.firstName}{" "}
            {props?.teacherRequest?.userDetails?.lastName}
          </h3>

          <h5 className="cart-item-author-container">
            {props?.teacherRequest?.userDetails?.email}{" "}
          </h5>
          <h5 className="cart-item-author-container">
            {props?.teacherRequest?.userDetails?.phone}
          </h5>
        </div>
        <div className="  my-4">
          <Button
            className="cart-item-decrease-btn"
            onClick={() => {
              setTeacherRequestId(props?.teacherRequest?._id);
              setViewRequest(!viewRequest);
            }}
            size="sm"
          >
            View
          </Button>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
