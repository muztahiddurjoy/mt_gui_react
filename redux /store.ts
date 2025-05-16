import { configureStore } from "@reduxjs/toolkit";
import rosReducer from "./slices/ros-slice";
export const store = configureStore({
  reducer: {
    ros: rosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
