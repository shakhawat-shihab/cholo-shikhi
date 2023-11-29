import React, { useEffect } from "react";
import useSubscriptionHook from "../../../../../hooks/subscription/useSubscriptionHook";
import CustommSpinner from "../../../../organisms/spinner/spinner";
import SubscriptionItem from "./subscriptionItem";
import { useSelector } from "react-redux";
import FullScreenMessage from "../../../../organisms/fullScreenMessage/fullScreenMessage";

type Props = {};

export default function SubscriptionRequest({}: Props) {
  const { subscription, loadSubscription, isLoadingSubscription } =
    useSubscriptionHook();

  const { subscriptions } = useSelector((state: any) => state.subscription);

  useEffect(() => {
    loadSubscription({});
  }, []);
  // console.log("subscriptions ---------- ", subscriptions);
  return (
    <div className=" h-full  flex ">
      <div className=" bg-white w-full p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2">
        <h2 className="pb-8 text-3xl text-center "> Subscription Request </h2>
        {isLoadingSubscription ? (
          <div className="h-screen flex justify-center items-center  ">
            <CustommSpinner className="h-16 w-16" />
          </div>
        ) : (
          <div className="">
            {subscriptions?.length ? (
              subscriptions?.map((x: any) => (
                <SubscriptionItem
                  key={x?._id}
                  subscription={x}
                  subscriptionId={x?._id}
                />
              ))
            ) : (
              <FullScreenMessage message="No Request" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
