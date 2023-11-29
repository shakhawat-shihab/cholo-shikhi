import React from "react";
import { Button } from "@material-tailwind/react";
import { Course } from "../../../../../types/subscription.type";
import demoImg from "../../../../../assets/images/react.jpg";
import useSubscriptionHook from "../../../../../hooks/subscription/useSubscriptionHook";
import Img from "../../../../atoms/image/img";
import { useDispatch } from "react-redux";

export default function SubscriptionCourses(props: {
  course: Course;
  subscriptionId: string;
  userId: string;
}) {
  const { isLoadingApproveDeny, approveCourse, denyCourse } =
    useSubscriptionHook();

  const approveEvent = () => {
    // console.log("approveEvent ");
    // console.log("courseRef ", props?.course?._id);
    // console.log("subscriptionId ", props?.subscriptionId);
    // console.log("userId ", props?.userId);
    approveCourse({
      courseRef: props?.course?._id,
      subscriptionRef: props?.subscriptionId,
      userRef: props?.userId,
    });
  };

  const denyEvent = () => {
    console.log("denyEvent ");
    console.log(
      "props?.course?.statusOfSubscription ",
      props?.course?.statusOfSubscription
    );
    denyCourse({
      courseRef: props?.course?._id,
      subscriptionRef: props?.subscriptionId,
      userRef: props?.userId,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-center   my-2 py-8">
      <div className="col-span-4 flex justify-center">
        <Img
          src={`${
            props?.course?.thumbnail ? props?.course?.thumbnail : demoImg
          }`}
          alt="course image"
          className="w-4/6 "
          // style={{ width: "270px", height: "250px" }}
        />
      </div>

      <div className="col-span-5">
        <h3 className="font-bold ">{props?.course?.title}</h3>
        {props?.course?.teacherFirstName && (
          <h5 className="cart-item-author-container">
            By {props?.course?.teacherFirstName}{" "}
            {props?.course?.teacherLastName}
          </h5>
        )}
      </div>

      <div className=" col-span-3 my-4">
        {props?.course?.statusOfSubscription == "deny" ||
        props?.course?.statusOfSubscription == "pending" ? (
          <Button
            className="cart-item-decrease-btn"
            disabled={isLoadingApproveDeny ? true : false}
            onClick={() => approveEvent()}
            size="sm"
          >
            Approve
          </Button>
        ) : (
          <Button
            className="cart-item-decrease-btn"
            disabled={isLoadingApproveDeny ? true : false}
            onClick={() => denyEvent()}
            size="sm"
          >
            Deny
          </Button>
        )}
      </div>
    </div>
  );
}
