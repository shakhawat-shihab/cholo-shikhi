import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseCount: 0,
};
export const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setCourseCount: (state, action) => {
      //   console.log("action?.payload ", action?.payload);
      state.courseCount = action.payload;
    },
    addCourse: (state) => {
      state.courseCount += 1;
    },
  },
});
export const { setCourseCount, addCourse } = teacherSlice.actions;

export default teacherSlice.reducer;
