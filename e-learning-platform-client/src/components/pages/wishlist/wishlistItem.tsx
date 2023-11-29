import React from "react";
import useCartHook from "../../../hooks/cart/useCartHook";
import demoImg from "../../../assets/images/react.jpg";
import { useSelector } from "react-redux";
import useWishlistHook from "../../../hooks/wishlist/useWishlistHook";
import { Button } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
import Img from "../../atoms/image/img";

type cartCourse = {
  courseId: string;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  teacherUserId: string;
  teacherfirstName: string;
  teacherlastName: string;
  teacherImage: string;
};

export default function WishlistItem(props: cartCourse) {
  const { isLoadingWishlist, removeFromWishlist } = useWishlistHook();
  const { auth } = useSelector((state: any) => state);
  const user = auth.userData;

  const removeItemEvent = () => {
    // console.log("remove ", props, user);
    console.log(props?.courseId, user?.userRef?._id);
    removeFromWishlist({
      courseRef: props?.courseId,
      studentRef: user?.userRef?.studentRef,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-center  border-b-2 border-black my-2 py-8">
      <div className="col-span-4 flex justify-center">
        <Img
          src={`${props?.thumbnail ? props?.thumbnail : demoImg}`}
          alt="course image"
          className="w-4/6 "
          // style={{ width: "270px", height: "250px" }}
        />
      </div>

      <div className="col-span-5">
        <h3 className="font-bold ">{props?.title}</h3>
        {props?.teacherfirstName && (
          <h5 className="cart-item-author-container">
            By {props?.teacherfirstName} {props?.teacherlastName}
          </h5>
        )}
      </div>

      <div className=" col-span-3 my-4">
        <Button
          className="cart-item-decrease-btn"
          disabled={isLoadingWishlist ? true : false}
          onClick={() => removeItemEvent()}
          size="sm"
        >
          {window.innerWidth < 450 ? <MdDelete size={18} /> : <>Remove</>}
        </Button>
      </div>
    </div>
  );
}
