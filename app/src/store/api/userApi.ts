import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BaseResponse } from "../types/base";
import {
  UserByIdRequest,
  UserResponse,
  UsersListRequest,
  UsersListResponse,
  AddUserRequest,
  UpdatePwdRequest,
  User,
  UsersListResponseData,
  EditUserRequest,
  EditCurrentUserRequest,
} from "../types/user";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL + "user/",
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersListResponseData, UsersListRequest>({
      query: (request: UsersListRequest) => ({
        url: "",
        params: request.params,
        headers: request.headers,
      }),
      transformResponse: (response: UsersListResponse) => response.data,
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, UserByIdRequest>({
      query: (request: UserByIdRequest) => ({
        url: `${request.id}`,
        headers: request.headers,
      }),
      transformResponse: (response: UserResponse) => response.data,
    }),
    addUser: builder.mutation<BaseResponse, AddUserRequest>({
      query: (request: AddUserRequest) => ({
        url: "",
        method: "POST",
        body: request.body,
        headers: request.headers,
      }),
      invalidatesTags: ["User"],
    }),
    editUser: builder.mutation<BaseResponse, EditUserRequest>({
      query: (request: EditUserRequest) => ({
        url: `updateinfo/${request.id}`,
        method: "PUT",
        body: request.body,
        headers: request.headers,
      }),
      invalidatesTags: ["User"],
    }),
    editCurrentUser: builder.mutation<BaseResponse, EditCurrentUserRequest>({
      query: (request: EditCurrentUserRequest) => ({
        url: `${request.id}`,
        method: "PUT",
        body: request.body,
        headers: request.headers,
      }),
    }),
    updatePwd: builder.mutation<BaseResponse, UpdatePwdRequest>({
      query: (request: UpdatePwdRequest) => ({
        url: `updatepwd/${request.id}`,
        method: "PUT",
        body: request.body,
        headers: request.headers,
      }),
    }),
    deleteUser: builder.mutation<BaseResponse, UserByIdRequest>({
      query: (request: UserByIdRequest) => ({
        url: `${request.id}`,
        method: "DELETE",
        headers: request.headers,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useAddUserMutation,
  useEditUserMutation,
  useUpdatePwdMutation,
  useDeleteUserMutation,
} = userApi;
