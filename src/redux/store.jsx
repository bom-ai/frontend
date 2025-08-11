// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import groupNamesReducer from "./groupNamesSlice";
import analysisStyleReducer from "./analysisStyleSlice";
import uploadedFrameReducer from "./uploadedFrameSlice";
import jobReducer from "./jobSlice";

export const store = configureStore({
  reducer: {
    groupNames: groupNamesReducer,
    uploadedFrame: uploadedFrameReducer,
    analysisStyle: analysisStyleReducer,
    job: jobReducer,
  },
});
