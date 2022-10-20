import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  UserByIdRequest,
  UserResponse,
  UsersListRequest,
  UsersListResponse,
} from "../types/user";

export const userApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.API_BASE_URL + "user/" }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersListResponse, UsersListRequest>({
      query: (request: UsersListRequest) => ({
        url: "",
        params: request.params,
        headers: request.headers,
      }),
    }),
    getUserById: builder.query<UserResponse, UserByIdRequest>({
      query: (request: UserByIdRequest) => ({
        url: `${request.id}`,
        headers: request.headers,
      }),
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserByIdQuery } = userApi;
