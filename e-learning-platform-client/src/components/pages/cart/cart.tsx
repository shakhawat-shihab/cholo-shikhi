import React, { useEffect } from "react";
import useCartHook from "../../../hooks/cart/useCartHook";
import { useSelector } from "react-redux";
import FullScreenMessage from "../../organisms/fullScreenMessage/fullScreenMessage";
import TopBanner from "../../organisms/topBanner/topBanner";
import { Button, Spinner, Typography } from "@material-tailwind/react";
import CartItem from "./cartItem";

type Props = {};

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

export default function Cart({}: Props) {
  const { auth, cart } = useSelector((state: any) => state);
  const user = auth.userData;
  const { loadCart, isLoadingCart, checkoutCart } = useCartHook();

  // console.log("cart ----------- ", cart);
  useEffect(() => {
    if (user?.role == "student" && user?.userRef?.studentRef) {
      loadCart(user?.userRef?.studentRef);
    }
  }, []);

  const arr = [
    {
      link: "/student/cart",
      label: "Cart",
    },
  ];

  const checkOut = () => {
    checkoutCart({ studentRef: user?.userRef?.studentRef });
  };

  return (
    <div>
      {/* <TopBanner
        imgLink={`https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80`}
        links={arr}
      /> */}
      <Typography as={"h2"} className="text-4xl font-bold text-center my-10">
        Cart
      </Typography>
      {cart?.courseDetails?.length ? (
        <div className="container mx-auto">
          <div className="cart-item-container">
            {cart?.courseDetails?.map((x: cartCourse) => (
              <CartItem {...x} key={x?.courseId} />
            ))}
          </div>
          <div className="text-center my-8">
            <Button onClick={() => checkOut()}>
              {isLoadingCart ? <Spinner /> : <>Checkout</>}
            </Button>
          </div>
        </div>
      ) : (
        <FullScreenMessage message="Your Cart is empty" />
      )}
    </div>
  );
}
