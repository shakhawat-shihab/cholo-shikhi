import { createSlice } from "@reduxjs/toolkit";
import {
  Course,
  SubscriptionData,
  UserDetails,
} from "../../types/subscription.type";

const initialCourse: Course = {
  _id: "",
  title: "",
  teacherUserName: "",
  teacherFirstName: "",
  teacherLastName: "",
  thumbnail: "",
  statusOfSubscription: "",
};

const initialUserDetails: UserDetails = {
  _id: "",
  userName: "",
  email: "",
};

const initialSubscriptionData: SubscriptionData = {
  _id: "",
  isCheckedAdmin: "",
  createdAt: "",
  courses: [initialCourse],
  userDetails: initialUserDetails,
};

const initialState = {
  subscriptions: [initialSubscriptionData],
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    loadSubscriptionRedux: (state, action) => {
      // console.log("action.payload ", action.payload);
      state.subscriptions = action.payload;
    },
    approveCourseRedux: (state, action) => {
      // console.log("action.payload ", action.payload);
      // state.subscriptions =
      state.subscriptions = state?.subscriptions?.map((x) => {
        if (x?._id == action?.payload?.subscriptionRef) {
          // console.log("subscription === ", x, x?._id);
          let courses = x?.courses?.map((course) => {
            if (course?._id == action?.payload?.courseRef) {
              course.statusOfSubscription = "approve";
            }
            return course;
          });
          x.courses = courses;
        }
        return x;
      });
    },
    denyCourseRedux: (state, action) => {
      // console.log("action.payload ", action.payload);
      // state.subscriptions =
      state.subscriptions = state?.subscriptions?.map((x) => {
        if (x?._id == action?.payload?.subscriptionRef) {
          // console.log("subscription ======---- ", x, x?._id);
          let courses = x?.courses?.map((course) => {
            if (course?._id == action?.payload?.courseRef) {
              course.statusOfSubscription = "deny";
              // console.log("course ======---- ", course);
            }
            return course;
          });
          x.courses = courses;
        }
        return x;
      });
    },

    removeSubscriptionRequestRedux: (state, action) => {
      state.subscriptions = state?.subscriptions?.filter((x) => {
        if (x?._id != action?.payload?.subscriptionRef) {
          return x;
        }
      });
    },
  },
});
export const {
  loadSubscriptionRedux,
  approveCourseRedux,
  denyCourseRedux,
  removeSubscriptionRequestRedux,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
