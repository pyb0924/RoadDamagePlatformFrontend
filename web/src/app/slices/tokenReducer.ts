import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenData } from "../types/base";

const initialState: string = "";

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<TokenData>) => {
      state = action.payload.tokenType + " " + action.payload.accessToken;
    },
  },
});

export const { setToken } = tokenSlice.actions;

export default tokenSlice.reducer;
