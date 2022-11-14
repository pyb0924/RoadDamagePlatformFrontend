import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {User} from '../types/user';

interface UserWithToken extends User {
  token: string;
}

const initialState: UserWithToken = {
  user_id: '',
  username: '',
  is_active: 0,
  permissions: [],
  permission_ids: [],
  create_time: '',
  update_time: '',
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user_id = action.payload.user_id;
      state.username = action.payload.username;
      state.is_active = action.payload.is_active;
      state.permissions = action.payload.permissions;
      state.permission_ids = action.payload.permission_ids;
      state.create_time = action.payload.create_time;
      state.update_time = action.payload.update_time;
    },
    clearUser: state => {
      state.user_id = '';
      state.username = '';
      state.is_active = 0;
      state.permissions = [];
      state.permission_ids = [];
      state.create_time = '';
      state.update_time = '';
      state.token = '';
    },
  },
});

export const {setToken, setUser, clearUser} = userSlice.actions;

export default userSlice.reducer;
