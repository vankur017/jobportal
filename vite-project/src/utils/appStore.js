import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./jobSlice"; // Import your jobSlice reducer

const appStore = configureStore({
  reducer: {
    // Add your reducers here
    job: jobReducer, // Register the jobSlice reducer
    },
});

export default appStore;