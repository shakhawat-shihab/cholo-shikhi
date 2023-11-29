import React from "react";
import { useState, useEffect, useRef } from "react";
import { SlPencil } from "react-icons/sl";
import userImg from "../../../assets/images/user.png";
import { Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import useAuthHook from "../../../hooks/auth/useAuthHook";
import { useLocation } from "react-router-dom";

type Props = {};

export default function MyProfile({}: Props) {
  const [imgObj, setImgObj] = useState<File | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();

  const userData = useSelector((state: any) => state?.auth?.userData);
  const { checkUser, user } = useAuthHook();

  useEffect(() => {
    const checkUserByToken = async () => {
      // console.log("herrrrrrrrrrrrrrrreeeeeeeeeeeee ", userData);
      if (userData?.token) await checkUser(userData?.token);
    };
    checkUserByToken();
  }, []);

  const handleClick = () => {
    inputRef.current && inputRef.current.click();
  };

  const handleFileChange = (e: any) => {
    const fileObject = e.target.files && e.target.files[0];
    if (!fileObject) {
      return;
    }
    console.log("fileObject is", fileObject);
    setImgObj(fileObject);
    if (e.target.files && e.target.files.length > 0) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // console.log("imgObj ----------- ", imgObj);

  return (
    <div className=" flex h-full  ">
      <div
        className={` bg-white w-full  p-2 sm:p-8 md:p-10 shadow-lg rounded-md my-2 
      ${
        !location?.pathname.includes("/dashboard") &&
        "mt-44 mx-w container mx-auto max-w-screen-xl my-10"
      } `}
      >
        <div className="  ">
          <div className="img-container mx-auto ">
            {!imgObj?.name ? (
              <div className="image-edit-btn opacity-100" onClick={handleClick}>
                <SlPencil size={22} />
              </div>
            ) : (
              <div className="image-edit-btn opacity-70" onClick={handleClick}>
                <SlPencil size={22} />
              </div>
            )}

            <input
              style={{ display: "none" }}
              ref={inputRef}
              type="file"
              name="profilePicture"
              onChange={(e) => handleFileChange(e)}
            />
            <img
              src={
                // userData?.userRef?.image
                //   ? userData?.userRef?.image
                //   : imgObj?.name
                //   ? image
                //   : userImg

                imgObj?.name
                  ? image
                  : userData?.userRef?.image
                  ? userData?.userRef?.image
                  : userImg
              }
              alt="course thumbnail"
              className="min-h-full min-w-full"
            />
          </div>
          <div className="my-4  max-w-screen-md mx-auto">
            {/* role */}
            <div className="grid grid-cols-12 py-4">
              <Typography
                as="h2"
                className="col-span-12 sm:text-right text-left"
              >
                Role: {userData?.role}
              </Typography>
            </div>
            {/* userName & email */}
            <div className="grid grid-cols-12 py-4 ">
              <Typography as="h2" className="md:col-span-6 col-span-12">
                User Name:{" "}
                <span className="font-semibold">
                  {userData?.userRef?.userName}
                </span>
              </Typography>
              <Typography as="h2" className="md:col-span-6 col-span-12">
                Email: <span className="font-semibold">{userData?.email}</span>
              </Typography>
            </div>

            {/* firstName & lastName */}
            <div className="grid grid-cols-12  py-4">
              <Typography as="h2" className="sm:col-span-6 col-span-12 ">
                First Name:{" "}
                <span className="font-semibold">
                  {userData?.userRef?.firstName}
                </span>
              </Typography>
              <Typography as="h2" className="sm:col-span-6 col-span-12 ">
                Last name:
                <span className="font-semibold">
                  {userData?.userRef?.lastName}
                </span>
              </Typography>
            </div>

            {/* phone &  */}
            <div className="grid grid-cols-12  py-4">
              <Typography as="h2" className="sm:col-span-6 col-span-12 ">
                Phone:
                <span className="font-semibold">
                  {" "}
                  {userData?.userRef?.phone}
                </span>
              </Typography>
              <Typography as="h2" className="sm:col-span-6 col-span-12 ">
                {/* Last name: {userData?.userRef?.lastName} */}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
