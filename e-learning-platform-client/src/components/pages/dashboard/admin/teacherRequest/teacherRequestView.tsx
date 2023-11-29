import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";
import React from "react";
import { TeacherRequest } from "../../../../../types/teacher.type";
import Img from "../../../../atoms/image/img";
import demoImg from "../../../../../assets/images/user.png";
import useTeacherHook from "../../../../../hooks/teacher/useTeacherHook";
import { useSelector } from "react-redux";

type Props = {
  viewRequest?: boolean;
  teacherRequest: TeacherRequest;
  handleRequestOpen: () => void;
};

export default function TeacherRequestView({
  viewRequest = false,
  handleRequestOpen,
  teacherRequest,
}: Props) {
  //   const user = useSelector((state: any) => state.auth?.userData);
  console.log("teacherRequest ", teacherRequest);
  const { approveTeacherRequest, denyTeacherRequest } = useTeacherHook();
  return (
    <div>
      <Dialog
        open={viewRequest}
        handler={handleRequestOpen}
        className="opacity-40 min-h-full"
      >
        <DialogHeader>
          <Button onClick={handleRequestOpen}>Close</Button>
        </DialogHeader>
        <DialogBody className="h-full">
          <div>
            <Img
              src={`${
                teacherRequest?.userDetails?.image
                  ? teacherRequest?.userDetails?.image
                  : demoImg
              }`}
              alt="course image"
              className=""
              style={{ width: "200px" }}
            />
          </div>

          <div className="col-span-5">
            <h3 className="font-bold uppercase">
              {teacherRequest?.userDetails?.firstName}{" "}
              {teacherRequest?.userDetails?.lastName}
            </h3>

            <h5 className="cart-item-author-container">
              {teacherRequest?.userDetails?.email}{" "}
            </h5>
            <h5 className="cart-item-author-container">
              {teacherRequest?.userDetails?.phone}
            </h5>
          </div>

          <div className="flex items-center">
            <Button
              onClick={() => {
                console.log(teacherRequest?.userDetails?._id);
                approveTeacherRequest(teacherRequest?.userDetails?._id);
                handleRequestOpen();
              }}
              size="sm"
            >
              Approve
            </Button>
            <Button
              className="ms-3"
              onClick={() => {
                // denyTeacherRequest(user?.userRef?.teacherRef);
              }}
              size="sm"
            >
              Deny
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}
