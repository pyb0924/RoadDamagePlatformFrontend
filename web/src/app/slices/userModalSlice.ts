import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserModalStateType, UserModalData } from "../types/user";

const initialState = {
  modalState: UserModalStateType.DEFAULT,
  modalData: {
    username: "",
    password: "",
    permissions: [] as string[],
  },
};
const UserModalSlice = createSlice({
  name: "userModel",
  initialState,
  reducers: {
    setUserModalState(state, action: PayloadAction<UserModalStateType>) {
      state.modalState = action.payload;
    },
    setUserModalData(state, action: PayloadAction<UserModalData>) {
      state.modalData = action.payload;
    },
    cleanUserModalData(state) {
      state.modalData = {
        username: "",
        password: "",
        permissions: [] as string[],
      };
    },
  },
});

export const { setUserModalState, setUserModalData, cleanUserModalData } =
  UserModalSlice.actions;

export default UserModalSlice.reducer;
