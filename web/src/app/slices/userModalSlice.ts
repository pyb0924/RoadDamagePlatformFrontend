import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserModalStateType } from "../types/user";

const initialState = {
  modelState: UserModalStateType.DEFAULT,
};
const UserModalSlice = createSlice({
  name: "userModel",
  initialState,
  reducers: {
    setUserModalState(state, action: PayloadAction<UserModalStateType>) {
      state.modelState = action.payload;
    },
  },
});

export const { setUserModalState } = UserModalSlice.actions;

export default UserModalSlice.reducer;
