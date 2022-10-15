import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './reducer/loginReducer';
import tokenReducer from './reducer/tokenReducer';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    token: tokenReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
