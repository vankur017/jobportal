import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
    initialState: {
        jobs: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        addAllJobs: (state, action) => {
            state.jobs = action.payload;
        },
        addFilteredJobs: (state, action) => {
            state.jobs = action.payload;
        },
        removeJobs: (state) => {
            state.jobs = '';
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const { addAllJobs, removeJobs, addFilteredJobs, setLoading, setError } = jobSlice.actions;
export default jobSlice.reducer;