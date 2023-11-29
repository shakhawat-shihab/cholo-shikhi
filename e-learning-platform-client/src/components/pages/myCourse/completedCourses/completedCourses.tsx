import React, { useEffect } from "react";
import useCourseHook from "../../../../hooks/course/useCourseHook";
import { useSelector } from "react-redux";
import CustommSpinner from "../../../organisms/spinner/spinner";
import CourseCard from "../../../organisms/courseCard/courseCard";
import FullScreenMessage from "../../../organisms/fullScreenMessage/fullScreenMessage";
import ReviewModal from "../../../organisms/reviewModal/reviewModal";
import CourseCardStudent from "../../../organisms/courseCard/courseCardStudent";

type Props = { handleReviewOpen?: (val: string) => void };

export default function CompletedCourses({}: Props) {
  const user = useSelector((state: any) => state.auth.userData);

  const { completedCourse, loadStudentCourses, isLoadingCourse } =
    useCourseHook();

  useEffect(() => {
    if (user) {
      loadStudentCourses(user?.userRef?.studentRef, "completed");
    }
  }, [user]);

  // console.log("completedCourse ", completedCourse);

  // const [showReviewCourse, setShowReviewCourse] = React.useState(false);
  // const [courseId, setCourseId] = React.useState("");
  // const handleReviewOpen = () => {
  //   setShowReviewCourse(!showReviewCourse);
  //   // setCourseId(id);
  // };
  return (
    <div>
      {isLoadingCourse ? (
        <div className="h-full flex justify-center items-center  ">
          <CustommSpinner className="h-16 w-16" />
        </div>
      ) : (
        <div className="">
          {/* <ReviewModal
            showReviewCourse={showReviewCourse}
            handleReviewOpen={handleReviewOpen}
            courseId={courseId}
          /> */}
          {completedCourse?.length ? (
            <div className="grid grid-cols-12 gap-4">
              {completedCourse &&
                completedCourse?.map((x: any) => (
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
