import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import {TokenResponse, LoginBody} from '../types/login';

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({baseUrl: 'ht'}),
  endpoints: builder => ({
    postLogin: builder.query<TokenResponse, LoginBody>({
      query: (loginBody: LoginBody) => ({
        url: 'login',
        method: 'POST',
        body: JSON.stringify(loginBody),
      }),
    }),
    postRefresh: builder.query<TokenResponse, string>({
      query: (authorization: string) => ({
        url: 'refresh',
        method: 'POST',
        headers: {
          Authorization: authorization,
        },
      }),
    }),
  }),
});

export const {usePostLoginQuery, usePostRefreshQuery} = loginApi;
