import { createSlice } from "@reduxjs/toolkit";

interface cartCourse {
  courseId: string;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  teacherUserId: string;
  teacherfirstName: string;
  teacherlastName: string;
  teacherImage: string;
}

export interface Cart {
  _id: string;
  courseDetails: cartCourse[];
}

let initialState: Cart = {
  _id: "",
  courseDetails: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartRedux: (state, action) => {
      console.log("action?.payload ---------- ", action?.payload);
      state._id = action.payload?._id;
      state.courseDetails = action.payload?.courseDetails;
    },
    addToCartRedux: (state, action) => {
      state.courseDetails.push(action.payload);
    },
    removeFromCartRedux: (state, action) => {
      state.courseDetails = state.courseDetails.filter(
        (course) => course.courseId !== action.payload
      );
    },
  },
});
export const { loadCartRedux, addToCartRedux, removeFromCartRedux } =
  cartSlice.actions;

export default cartSlice.reducer;
