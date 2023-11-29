import { IoBookSharp } from "react-icons/io5";
import { PiFeatherBold, PiStudentBold, PiSunFill } from "react-icons/pi";

import demoImg from "../../../assets/images/react.jpg";
import Img from "../../atoms/image/img";
import userImage from "../../../assets/images/teacher.png";
import { useLocation, useNavigate } from "react-router-dom";

import { BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { Button } from "@material-tailwind/react";
import useCartHook from "../../../hooks/cart/useCartHook";
import { useSelector } from "react-redux";
import useWishlistHook from "../../../hooks/wishlist/useWishlistHook";
import useCourseHook from "../../../hooks/course/useCourseHook";
import { Dispatch, SetStateAction } from "react";
import { MdStars } from "react-icons/md";

type Props = {
  props: any;
  reload?: boolean;
  setReload?: Dispatch<SetStateAction<boolean>>;
};

export default function CourseCard({ props, setReload, reload }: Props) {
  console.log("props ", props);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: any) => state.auth.userData);

  const { addToCart, isLoadingCart } = useCartHook();
  const { requestToPublish } = useCourseHook();
  const { addToWishlist, isLoadingWishlist } = useWishlistHook();

  let clickCard = () => {
    console.log(props?.title);
    if (location?.pathname?.startsWith("/teacher/dashboard")) {
      navigate(`/teacher/dashboard/manage-course/${props?._id}`);
    } else if (location?.pathname?.startsWith("/my-course")) {
      navigate(`/my-course/${props?._id}`);
    } else if (
      location?.pathname?.startsWith("/admin/dashboard/course-request")
    ) {
      navigate(`/admin/dashboard/course-request/${props?._id}`);
    } else {
      navigate(`/course-detail/${props?._id}`);
    }
  };

  function truncateString(inputString: string, maxLength: number) {
    if (inputString?.length > maxLength) {
      return inputString?.slice(0, maxLength - 3) + "...";
    } else {
      return inputString;
    }
  }

  const addToCartEvent = (e: any) => {
    console.log("add to cart ", user);
    e.stopPropagation();
    if (user?.role != "student") {
      navigate("/login");
      return;
    }
    addToCart({ studentRef: user?.userRef?.studentRef, courseRef: props?._id });
  };

  const addToWishlistEvent = (e: any) => {
    console.log("add to wishlist ", user);
    e.stopPropagation();
    if (user?.role != "student") {
      navigate("/login");
      return;
    }
    addToWishlist({
      studentRef: user?.userRef?.studentRef,
      courseRef: props?._id,
    });
  };

  const requestPublish = async (e: any) => {
    e.stopPropagation();
    await requestToPublish(props?._id, user?.userRef?.teacherRef);
    if (setReload) setReload(!reload);
  };

  return (
    <div
      className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 "
      onClick={() => clickCard()}
    >
      <div className="max-w-sm rounded  shadow-lg h-full flex flex-col justify-between">
        <div className="h-5/6 ">
          <Img
            className="w-full"
            src={`${props?.thumbnail ? props?.thumbnail : demoImg}`}
            alt="course thumbnail"
            style={{
              //  width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />

          <div className="px-4">
            {/* teacher */}
            <div className="mb-3 relative">
              <Img
                className="w-full rounded-full -mt-8 bg-white p-1 border "
                src={`${
                  props?.userDetails?.image
                    ? props?.userDetails?.image
                    : userImage
                }`}
                alt="teacher image"
                style={{ width: "70px", height: "70px" }}
              />
              <p className="text-sm">
                <span>{props?.userDetails?.firstName} </span>{" "}
                <span>{props?.userDetails?.lastName}</span>
              </p>
            </div>

            {/* title & description */}
            <div className=" mb-4">
              <p className="font-semibold text-base mb-2">
                {truncateString(props?.title, 45)}
              </p>
              <p className="text-gray-600 text-xs ">
                {" "}
                {truncateString(props?.description, 65)}
              </p>
            </div>

            {/* category */}
            {props?.categoryRef?.title && (
              <div className=" pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #{props?.categoryRef?.title}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="">
          <div className="border-t px-4 py-3 border-b">
            <div className="flex justify-between">
              <div className="flex ">
                <div className="flex items-center">
                  <IoBookSharp
                    title="Modules"
                    size={16}
                    className="text-gray-700"
                  />
                  {
                    <span className="py-1 px-2 rounded-full  text-gray-800 text-xs">
                      {props?.modulesRef?.length}
                    </span>
                  }
                </div>
                <div className="flex items-center ms-3">
                  <BsPeopleFill
                    title="Modules"
                    size={16}
                    className="text-gray-700"
                  />
                  {
                    <span className="py-1 px-2 rounded-full  text-gray-800 text-xs">
                      {props?.studentsRef?.length}
                    </span>
                  }
                </div>
              </div>

              <div className="flex items-center">
                {props?.rating && (
                  <div className="flex items-center">
                    <MdStars
                      title="Modules"
                      size={16}
                      className="text-gray-700"
                    />
                    {
                      <span className="py-1 px-2 rounded-full  text-gray-800 text-xs">
                        {props?.rating}
                      </span>
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
          {location?.pathname?.startsWith("/teacher/dashboard") && (
            <div className="px-4 py-3 border-b">
              <div className="flex justify-between items-center">
                {/* <span className={`${props?.courseStatus=="requested"? "text-yello-600": ""}  capitalize`}> */}
                {props?.courseStatus == "pending" && (
                  <span className="capitialize text-blue-600"> Pending </span>
                )}
                {props?.courseStatus == "requested" && (
                  <span className="capitialize text-yellow-900">Requested</span>
                )}
                {props?.courseStatus == "published" && (
                  <span className="capitialize text-green-900">Published</span>
                )}
                {props?.courseStatus == "rejected" && (
                  <span className="capitialize text-red-900"> Rejected </span>
                )}
                {(props?.courseStatus == "pending" ||
                  props?.courseStatus == "rejected") && (
                  <Button size="sm" onClick={(e) => requestPublish(e)}>
                    {" "}
                    Publish{" "}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="px-4 py-3 flex justify-between">
            {location?.pathname?.startsWith("/teacher/dashboard") ? (
              <Button
                onClick={(e) => {
                  navigate(`/teacher/dashboard/manage-course/${props?._id}`);
                  e.stopPropagation();
                }}
                size="sm"
                disabled={isLoadingCart ? true : false}
              >
                Edit Course
              </Button>
            ) : (
              <></>
            )}

            {location?.pathname?.startsWith("/courses") &&
              user?.role != "teacher" &&
              user?.role != "admin" && (
                <Button
                  onClick={(e) => addToCartEvent(e)}
                  size="sm"
                  disabled={isLoadingCart ? true : false}
                >
                  Add to cart
                </Button>
              )}
            {location?.pathname?.startsWith("/courses") &&
              user?.role != "teacher" &&
              user?.role != "admin" && (
                <Button
                  onClick={(e) => addToWishlistEvent(e)}
                  size="sm"
                  disabled={isLoadingWishlist ? true : false}
                >
                  <BsHeartFill size={18} />
                </Button>
              )}

            {location?.pathname?.startsWith("/my-course") && (
              <Button
                onClick={(e) => {
                  console.log("--------------------- ", props?._id);
                  // handleReviewOpen();
                  // e.stopPropagation();
                }}
                size="sm"
              >
                Give Review
              </Button>
            )}

            {location?.pathname?.startsWith("/my-course") && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/my-course/${props?._id}`);
                }}
                size="sm"
              >
                Continue Course
              </Button>
            )}

            {location?.pathname?.startsWith(
              "/admin/dashboard/course-request"
            ) && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/dashboard/course-request/${props?._id}`);
                }}
                size="sm"
              >
                View Course
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
