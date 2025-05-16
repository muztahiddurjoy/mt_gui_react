import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Ros } from "roslib";

export interface RosState {
  isConnected: boolean;
  ros: Ros | null;
}

const initialState: RosState = {
  isConnected: false,
  ros: null,
};

export const rosSlice = createSlice({
  name: "ros",
  initialState,
  reducers: {
    setRos: (state, action: PayloadAction<Ros | null>) => {
      state.ros = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setRos, setConnected } = rosSlice.actions;
export default rosSlice.reducer;
