import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobId: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobId: (state, action) => {
      state.jobId = action.payload;
    },
    clearJobId: (state) => {
      state.jobId = null;
    },
  },
});

export const { setJobId, clearJobId } = jobSlice.actions;
export default jobSlice.reducer;
