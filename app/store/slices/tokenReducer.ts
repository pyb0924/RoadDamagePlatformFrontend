import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TokenData, TokenType} from '../types/data';

const initialState: TokenData = {tokenType: TokenType.Bearer, accessToken: ''};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<TokenData>) => {
      state.tokenType = action.payload.tokenType;
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const {setToken} = tokenSlice.actions;

export default tokenSlice.reducer;
