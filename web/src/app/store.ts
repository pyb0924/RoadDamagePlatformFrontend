import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { loginApi } from "./api/loginApi";
import { userApi } from "./api/userApi";
import userReducer from "./slices/userSlice";
import userModalReducer from "./slices/userModalSlice";

const reducers = {
  [loginApi.reducerPath]: loginApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  user: userReducer,
  userModal: userModalReducer,
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [loginApi.reducerPath, userApi.reducerPath, "userModal"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(reducers)
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(loginApi.middleware, userApi.middleware),
});

export let persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

setupListeners(store.dispatch);
