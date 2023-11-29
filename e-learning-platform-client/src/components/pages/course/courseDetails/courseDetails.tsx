import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBanner from "../../../organisms/topBanner/topBanner";
import useCourseHook from "../../../../hooks/course/useCourseHook";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import Img from "../../../atoms/image/img";
import demoThumbnail from "../../../../assets/images/react.jpg";
import { formatTime } from "../../../../utils/formatDate";
import CourseDetailsSection from "../../../organisms/courseDetailsSection/courseDetailsSection";
import { FaHeartbeat } from "react-icons/fa";
import { BsCart4, BsCartFill } from "react-icons/bs";
import { IoBookSharp } from "react-icons/io5";
import { MdAssignmentTurnedIn, MdOutlineQuiz } from "react-icons/md";

type Props = {};

export default function CourseDetails({}: Props) {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    courseDetails,
    getCourseById,
    isLoadingCourse,
    publishCourse,
    rejectCourse,
  } = useCourseHook();

  useEffect(() => {
    if (courseId) {
      getCourseById({ courseId });
    }
  }, [courseId]);

  // console.log("courseDetails ", courseDetails);

  const arr = [
    {
      link: "/courses",
      label: "Courses",
    },
    {
      link: `/course/${courseId}`,
      label: "Course Details",
    },
  ];

  const approveCourse = () => {
    if (courseDetails?._id) publishCourse(courseDetails?._id);
    navigate("/admin/dashboard/course-request");
  };
  const denyCourse = () => {
    if (courseDetails?._id) rejectCourse(courseDetails?._id);
    navigate("/admin/dashboard/course-request");
  };

  return (
    <div className="">
      {/* {location?.pathname?.startsWith("/course-detail") && (
        <TopBanner
          imgLink={`https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80`}
          links={arr}
        />
      )} */}
      <Typography variant="h2" className="text-center mt-5 mb-10">
        Course Details
      </Typography>
      <div className=" mx-10">
        <div className="grid grid-cols-12 gap-5 h-screen">
          {/* left side */}
          <div className=" col-span-12 md:col-span-8 ">
            <div className="w-full md:hidden block mb-5">
              <Img
                src={
                  courseDetails?.thumbnail
                    ? courseDetails?.thumbnail
                    : demoThumbnail
                }
                className=" bg-white border h-44 xs:h-64 sm:h-72 w-full "
                alt="teacher image"
              />
              {/* admin view */}
              {location?.pathname?.startsWith(
                "/admin/dashboard/course-request"
              ) && (
                <div>
                  <div className="flex ">
                    <Button className="w-full" onClick={() => approveCourse()}>
                      Approve
                    </Button>
                  </div>
                  <div className="flex mt-3">
                    <Button className="w-full" onClick={() => denyCourse()}>
                      Deny
                    </Button>
                  </div>
                </div>
              )}

              {/* normal view */}
              {location?.pathname?.startsWith("/course") && (
                <div>
                  <div className="flex justify-between  mt-6 mb-4">
                    {window.innerWidth > 800 ? (
                      <Button className="w-10/12">Add To Cart</Button>
                    ) : (
                      <IconButton className="max-w-sm w-1/2">
                        <BsCartFill />
                      </IconButton>
                    )}
                    <IconButton className="ms-2 max-w-sm  w-1/2">
                      {" "}
                      <FaHeartbeat />{" "}
                    </IconButton>
                  </div>
                  <div className="flex ">
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </div>
              )}
            </div>
            {/* course basic info */}
            <div>
              <Typography as="h2" className="font-bold text-2xl">
                {courseDetails?.title}
              </Typography>
              <Typography as="h4" className="font-bold text-lg">
                {courseDetails?.description}
              </Typography>
            </div>

            {/* course details tab */}
            <div className="mt-9 overflow-y-scrollkk">
              <CourseDetailsSection courseDetails={courseDetails} />
            </div>
          </div>

          {/*  */}
          {/* right side */}
          {/*  */}
          <div className="md:col-span-4 md:block hidden bg-gray-200 border ">
            <div className="w-full">
              {/* thumbnail image */}
              <Img
                src={
                  courseDetails?.thumbnail
                    ? courseDetails?.thumbnail
                    : demoThumbnail
                }
                className="w-full  bg-white border "
                alt="teacher image"
              />

              <div>
                Course includes:
                <div className="">
                  {/* modules */}
                  <div className=" my-2">
                    <div className="flex items-center">
                      <div className="rounded px-2 py-1 bg-gray-700 ">
                        <IoBookSharp
                          title="Modules"
                          size={10}
                          className="text-white "
                        />
                      </div>
                      <span className="bg-gray-700 text-white px-2 rounded ms-1 text-xs">
                        {courseDetails?.modulesRef?.length
                          ? courseDetails?.modulesRef?.length
                          : 3}
                        Modules{" "}
                      </span>
                    </div>
                  </div>
                  {/* quizes */}
                  <div className="my-2">
                    <div className="flex items-center">
                      <div className="rounded px-2 py-1 bg-gray-700 ">
                        <MdOutlineQuiz
                          title="Modules"
                          size={10}
                          className="text-white "
                        />
                      </div>
                      <span className="bg-gray-700 text-white px-2 rounded ms-1 text-xs">
                        4 Quizzes
                      </span>
                    </div>
                  </div>
                  {/* assignment */}
                  <div className="my-2 ">
                    <div className="flex items-center">
                      <div className="rounded px-2 py-1 bg-gray-700 ">
                        <MdAssignmentTurnedIn
                          title="Modules"
                          size={10}
                          className="text-white "
                        />
                      </div>
                      <span className="bg-gray-700 text-white px-2 rounded ms-1 text-xs">
                        4 Assignments
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* admin view */}
              {location?.pathname?.startsWith(
                "/admin/dashboard/course-request"
              ) && (
                <div>
                  <div className="flex ">
                    <Button className="w-full" onClick={() => approveCourse()}>
                      Approve
                    </Button>
                  </div>
                  <div className="flex mt-3">
                    <Button className="w-full" onClick={() => denyCourse()}>
                      Deny
                    </Button>
                  </div>
                </div>
              )}

              {/* normal view */}
              {location?.pathname?.startsWith("/course") && (
                <div>
                  <div className="flex justify-between  mt-6 mb-4">
                    {window.innerWidth > 800 ? (
                      <Button className="w-10/12">Add To Cart</Button>
                    ) : (
                      <IconButton className="max-w-sm w-1/2">
                        <BsCartFill />
                      </IconButton>
                    )}
                    <IconButton className="ms-2 max-w-sm  w-1/2">
                      {" "}
                      <FaHeartbeat />{" "}
                    </IconButton>
                  </div>
                  <div className="flex ">
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
