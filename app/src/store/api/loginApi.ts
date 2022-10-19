import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import {TokenResponse, LoginBody} from '../types/login';

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://8.133.173.48:8889/api/'}),
  endpoints: builder => ({
    login: builder.mutation<TokenResponse, LoginBody>({
      query: (loginBody: LoginBody) => ({
        url: 'login',
        method: 'POST',
        body: JSON.stringify(loginBody),
      }),
    }),
    refresh: builder.mutation<TokenResponse, string>({
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

export const {useLoginMutation, useRefreshMutation} = loginApi;
