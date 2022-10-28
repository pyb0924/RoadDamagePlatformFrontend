import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isEditUserModalOpen: false,
  isAddUserModalOpen: false,
};
const UserModalSlice = createSlice({
  name: "userModel",
  initialState,
  reducers: {
    setAddUserModalOpen(state, action: PayloadAction<boolean>) {
      state.isAddUserModalOpen = action.payload;
    },
    setEditUserModalOpen(state, action: PayloadAction<boolean>) {
      state.isEditUserModalOpen = action.payload;
    },
  },
});

export const { setAddUserModalOpen, setEditUserModalOpen } =
  UserModalSlice.actions;

export default UserModalSlice.reducer;
