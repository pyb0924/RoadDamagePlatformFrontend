import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../types/base";
import { TokenDataWithId } from "../types/login";

interface UserWithToken extends User {
  token: string;
}

const initialState: UserWithToken = {
  user_id: "",
  username: "",
  is_active: false,
  permissions: [],
  create_time: "",
  update_time: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<TokenDataWithId>) => {
      state.token =
        action.payload.token_type + " " + action.payload.access_token;
    },
  },
});

export const { setToken } = userSlice.actions;

export default userSlice.reducer;
