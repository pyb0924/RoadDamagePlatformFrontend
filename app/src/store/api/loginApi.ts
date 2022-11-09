import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

import {
  RefreshResponse,
  LoginRequest,
  RefreshRequest,
  LoginResponse,
  TokenDataWithId,
} from '../types/login';

import Config from 'react-native-config';

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({baseUrl: Config.REACT_APP_BASEURL}),
  endpoints: builder => ({
    login: builder.mutation<TokenDataWithId, LoginRequest>({
      query: (request: LoginRequest) => ({
        url: 'login',
        method: 'POST',
        body: request.body,
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
