// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import groupNamesReducer from "./groupNamesSlice";
import uploadedFrameReducer from "./uploadedFrameSlice";

export const store = configureStore({
  reducer: {
    groupNames: groupNamesReducer,
    uploadedFrame: uploadedFrameReducer,
  },
});
