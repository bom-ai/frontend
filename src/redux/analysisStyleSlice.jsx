import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  style: null,
};

const analysisStyleSlice = createSlice({
  name: "analysisStyle",
  initialState,
  reducers: {
    setAnalysisStyle: (state, action) => {
      state.style = action.payload;
    },
  },
});

export const { setAnalysisStyle } = analysisStyleSlice.actions;

export default analysisStyleSlice.reducer;
