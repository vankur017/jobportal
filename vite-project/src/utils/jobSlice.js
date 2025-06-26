import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],        // filtered or displayed jobs
    allJobs: [],     // original list fetched from API
    isLoading: false,
    selectedJob: null,
    error: null,
  },
  reducers: {
    addAllJobs: (state, action) => {
      state.allJobs = action.payload;  // store all jobs
      state.jobs = action.payload;     // also initialize jobs with the full list
    },
    addFilteredJobs: (state, action) => {
      state.jobs = action.payload;     // update only the filtered view
    },
    setSelectedJob: (state, action) => {
      state.jobs = action.payload
    },
    addSuggetedJob: (state, action) => {
      state.jobs = action.payload; // update jobs with suggested jobs
    },
    removeJobs: (state) => {
      state.jobs = [];
      state.allJobs = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addAllJobs,
  addFilteredJobs,
  addSuggetedJob,
  setSelectedJob,
  removeJobs,
  setLoading,
  setError,
} = jobSlice.actions;

export default jobSlice.reducer;
