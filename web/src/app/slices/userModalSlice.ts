import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserModalType } from "../types/user";

const initialState = {
  modalType: UserModalType.DEFAULT,
  id: "",
  
};
const UserModalSlice = createSlice({
  name: "userModel",
  initialState,
  reducers: {
    setUserModalType(state, action: PayloadAction<UserModalType>) {
      state.modalType = action.payload;
    },
    setUserModalId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
  },
});

export const { setUserModalType, setUserModalId } =
  UserModalSlice.actions;

export default UserModalSlice.reducer;
