import { createSlice } from "@reduxjs/toolkit";

const uploadedFrameSlice = createSlice({
  name: "uploadedFrame",
  initialState: {
    frameName: null,
    frameType: null,
    frameBase64: null,
  },
  reducers: {
    setUploadedFrame: (state, action) => {
      const { frameName, frameType, frameBase64 } = action.payload;
      state.frameName = frameName;
      state.frameType = frameType;
      state.frameBase64 = frameBase64;
    },
    clearUploadedFrame: (state) => {
      state.frameName = null;
      state.frameType = null;
      state.frameBase64 = null;
    },
  },
});

export const { setUploadedFrame, clearUploadedFrame } =
  uploadedFrameSlice.actions;
export default uploadedFrameSlice.reducer;
