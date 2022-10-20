import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {setupListeners} from '@reduxjs/toolkit/dist/query';

import { loginApi } from "../app/api/loginApi";
import loginReducer from "../app/slices/loginReducer";
import tokenReducer from "../app/slices/tokenReducer";

export const store = configureStore({
  reducer: {
    [loginApi.reducerPath]: loginApi.reducer,
    login: loginReducer,
    token: tokenReducer,
    
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(loginApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;


setupListeners(store.dispatch);
