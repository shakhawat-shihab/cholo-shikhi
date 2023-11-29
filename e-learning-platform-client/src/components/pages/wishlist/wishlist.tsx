import React, { useEffect } from "react";
import useCartHook from "../../../hooks/cart/useCartHook";
import { useSelector } from "react-redux";
import FullScreenMessage from "../../organisms/fullScreenMessage/fullScreenMessage";
import TopBanner from "../../organisms/topBanner/topBanner";
import { Button, Spinner, Typography } from "@material-tailwind/react";
import useWishlistHook from "../../../hooks/wishlist/useWishlistHook";
import WishlistItem from "./wishlistItem";

type Props = {};

type wishlistCourse = {
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

export default function Wishlist({}: Props) {
  const { auth, wishlist } = useSelector((state: any) => state);
  const user = auth.userData;
  const { loadWishlist, isLoadingWishlist, moveToCart } = useWishlistHook();

  // console.log("wishlist ------------ ", wishlist);
  useEffect(() => {
    if (user?.role == "student" && user?.userRef?.studentRef) {
      loadWishlist(user?.userRef?.studentRef);
    }
  }, []);

  const arr = [
    {
      link: "/student/wishlist",
      label: "Wishlist",
    },
  ];

  const checkOutWishlist = () => {
    moveToCart({ studentRef: user?.userRef?.studentRef });
  };

  return (
    <div>
      {/* <TopBanner
        imgLink={`https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80`}
        links={arr}
      /> */}
      <Typography as={"h2"} className="text-4xl font-bold text-center my-10">
        Wishlist
      </Typography>
      {wishlist?.courseDetails?.length ? (
        <div>
          <div className="cart-item-container">
            {wishlist?.courseDetails?.map((x: wishlistCourse) => (
              <WishlistItem {...x} key={x?.courseId} />
            ))}
          </div>
          {/* <Button onClick={() => checkOutWishlist()}>
            {isLoadingWishlist ? <Spinner /> : <>Checkout</>}
          </Button> */}
        </div>
      ) : (
        <FullScreenMessage message="Your wishlist is empty" />
      )}
    </div>
  );
}
