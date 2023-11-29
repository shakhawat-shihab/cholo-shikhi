import { createSlice } from "@reduxjs/toolkit";

interface wishlistCourse {
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

export interface Wishlist {
  _id: string;
  courseDetails: wishlistCourse[];
}

let initialState: Wishlist = {
  _id: "",
  courseDetails: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    loadWishlistRedux: (state, action) => {
      console.log("action?.payload ", action?.payload);
      state._id = action.payload?._id;
      state.courseDetails = action.payload?.courseDetails;
    },
    addToWishlistRedux: (state, action) => {
      state.courseDetails.push(action.payload);
    },
    removeFromWishlistRedux: (state, action) => {
      state.courseDetails = state.courseDetails.filter(
        (course) => course.courseId !== action.payload
      );
    },
  },
});
export const {
  loadWishlistRedux,
  addToWishlistRedux,
  removeFromWishlistRedux,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
