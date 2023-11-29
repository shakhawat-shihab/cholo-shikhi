import React from "react";
import { SubscriptionData } from "../../../../../types/subscription.type";
import { Button } from "@material-tailwind/react";
import useSubscriptionHook from "../../../../../hooks/subscription/useSubscriptionHook";
import SubscriptionCourses from "./subscriptionCourses";
import Img from "../../../../atoms/image/img";
import userImg from "../../../../../assets/images/user.png";
import helperFunction from "../../../../../utils/helper";

export default function SubscriptionItem(props: {
  subscription: SubscriptionData;
  subscriptionId: string;
}) {
  const { isLoadingSubscription, removeSubscriptionRequest } =
    useSubscriptionHook();

  const removeRequest = () => {
    // console.log("subscriptionId ", props?.subscriptionId);
    removeSubscriptionRequest({
      userRef: props?.subscription?.userDetails?._id,
      subscriptionRef: props?.subscriptionId,
    });
  };

  const { formatTimeDate } = helperFunction();
  return (
    <div className="shadow-xl mt-4 rounded border border-black px-2 py-4 my-3">
      <div className="flex justify-start p-2">
        <div className="flex justify-center items-center">
          <Img
            src={
              props?.subscription?.userDetails?.image
                ? props?.subscription?.userDetails?.image
                : userImg
            }
            style={{ height: "50px", width: "50px" }}
          />
          <div className="ms-4">
            <p className="capitalize  fw-bold text-xl">
              {props?.subscription?.userDetails?.userName}
            </p>
            <p className="text-xs">
              {formatTimeDate(props?.subscription?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="cart-item-decrease-btn"
          disabled={isLoadingSubscription ? true : false}
          onClick={() => removeRequest()}
          size="sm"
        >
          Remove Request
        </Button>
      </div>

      {props?.subscription?.courses?.map((x) => (
        <SubscriptionCourses
          key={x?._id}
          course={x}
          subscriptionId={props?.subscriptionId}
          userId={props?.subscription?.userDetails?._id}
        />
      ))}
    </div>
  );
}
