import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import {loginApi} from './api/loginApi';
import {userApi} from './api/userApi';
import {permissionApi} from './api/permissionApi';
import userReducer from './slices/userSlice';
import {eventApi} from './api/eventApi';

const reducers = {
  [loginApi.reducerPath]: loginApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [permissionApi.reducerPath]: permissionApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  user: userReducer,
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: [
    loginApi.reducerPath,
    userApi.reducerPath,
    permissionApi.reducerPath,
    eventApi.reducerPath,
  ],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(reducers),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      loginApi.middleware,
      userApi.middleware,
      permissionApi.middleware,
      eventApi.middleware,
    ),
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
