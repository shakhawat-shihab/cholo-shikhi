import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showDashboard: false,
  category: [],
  difficulty: [],
  sortOrder: "asc",
  sortParam: "createdAt",
};
export const settingsSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    showDashboardDrawer: (state) => {
      console.log("change state to true");
      state.showDashboard = true;
    },
    closeDashboardDrawer: (state) => {
      console.log("change state to false");
      state.showDashboard = false;
    },

    addCategory: (state, action) => {
      console.log("add category ");
      if (state.category.indexOf(action.payload) == -1) {
        console.log("add to redux");
        state.category.push(action.payload);
      }
    },
    removeCategory: (state, action) => {
      console.log("remove category ");
      let index = state.category.indexOf(action.payload);
      if (index != -1) {
        console.log("remove from redux");
        state.category.splice(index, 1);
      }
    },

    setSortingOrder: (state, action) => {
      // console.log("set order");
      state.sortOrder = action.payload;
    },
    setSortingParam: (state, action) => {
      // console.log("set param");
      state.sortParam = action.payload;
    },

    addDifficulty: (state, action) => {
      // console.log("add difficulty ");
      if (state.difficulty.indexOf(action.payload) == -1) {
        state.difficulty.push(action.payload);
      }
    },
    removeDifficulty: (state, action) => {
      // console.log("remove difficulty ");
      let index = state.difficulty.indexOf(action.payload);
      if (index != -1) {
        state.difficulty.splice(index, 1);
      }
    },
  },
});
export const {
  showDashboardDrawer,
  closeDashboardDrawer,
  addCategory,
  removeCategory,
  setSortingOrder,
  setSortingParam,
  addDifficulty,
  removeDifficulty,
} = settingsSlice.actions;

export default settingsSlice.reducer;
