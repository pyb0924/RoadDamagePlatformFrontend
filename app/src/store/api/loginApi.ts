import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import Config from 'react-native-config';

import {
  RefreshResponse,
  LoginRequest,
  RefreshRequest,
  LoginResponse,
  TokenDataWithId,
} from '../types/login';

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({baseUrl: Config.API_BASEURL}),
  endpoints: builder => ({
    login: builder.mutation<TokenDataWithId, LoginRequest>({
      query: (request: LoginRequest) => ({
        url: 'login',
        method: 'POST',
        body: `username=${request.body.username}&password=${request.body.password}`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      }),
      transformResponse: (response: LoginResponse) => response.data,
    }),
    refresh: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (request: RefreshRequest) => ({
        url: 'refresh',
        method: 'POST',
        headers: request.headers,
      }),
    }),
  }),
});

export const {useLoginMutation, useRefreshMutation} = loginApi;
