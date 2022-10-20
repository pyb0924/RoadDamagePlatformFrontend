import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import {
  RefreshResponse,
  LoginRequest,
  RefreshRequest,
  LoginResponse,
} from "../types/login";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.API_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (request: LoginRequest) => ({
        url: "login",
        method: "POST",
        body: request.body,
      }),
    }),
    refresh: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (request: RefreshRequest) => ({
        url: "refresh",
        method: "POST",
        headers: request.headers,
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation } = loginApi;
