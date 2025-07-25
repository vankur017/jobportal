import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],        // filtered or displayed jobs
    suggestedJob:[], // suggested jobs
    isLoading: false,
    selectedJob: null,
    error: null,
  },
  reducers: {
    
    addFilteredJobs: (state, action) => {
      state.jobs = action.payload;     // update only the filtered view
    },
    addSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
     
    },
    addSuggetedJob: (state, action) => {
      state.suggestedJob.push(action.payload); // add suggested job to the list
      
    },
      clearSuggestedJobs: (state) => {
      state.suggestedJob = []; // clears the array on logout
    }
    ,
    removeJobs: (state) => {
      state.jobs = [];
    
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
  
  addFilteredJobs,
  addSuggetedJob,
  addSelectedJob,
  removeJobs,
  setLoading,
  clearSuggestedJobs,
  setError,
} = jobSlice.actions;

export default jobSlice.reducer;
