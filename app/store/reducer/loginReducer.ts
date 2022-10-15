import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LoginBody} from '../types/login';

const initialState: LoginBody = {username: '', password: ''};

const loginSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setUsername: (state: LoginBody, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state: LoginBody, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const {setUsername, setPassword} = loginSlice.actions;
export default loginSlice.reducer;
