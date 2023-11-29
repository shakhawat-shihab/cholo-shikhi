import React, { useState } from "react";
import useReviewHook from "../../../hooks/reviews/useReviewHook";
import { useParams } from "react-router-dom";
import ReviewItem from "./reviewItem";

type Props = {};

export default function Review({}: Props) {
  const { courseId } = useParams();
  const { reviews, getAllReviewsOfCourse } = useReviewHook();

  const [reload, setReload] = useState(false);

  React.useEffect(() => {
    console.log("@@@@@@@@ fetaching reviews @@@@@@@@@@");
    if (courseId) getAllReviewsOfCourse({ courseId });
  }, [courseId, reload]);

  return (
    <div>
      {reviews?.map((x) => (
        <ReviewItem
          key={x?._id}
          props={x}
          setReload={setReload}
          reload={reload}
        />
      ))}
    </div>
  );
}
