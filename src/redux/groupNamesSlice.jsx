// src/store/firstCellsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const groupNamesSlice = createSlice({
  name: "groupNames",
  initialState: {
    values: [],
  },
  reducers: {
    setGroupNames: (state, action) => {
      state.values = action.payload;
    },
    clearGroupNames: (state) => {
      state.values = [];
    },
  },
});

export const { setGroupNames, clearGroupNames } = groupNamesSlice.actions;
export default groupNamesSlice.reducer;
