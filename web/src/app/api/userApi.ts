import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BaseResponse } from "../types/base";
import { permissionTypeList } from "../types/permission";
import {
  UserByIdRequest,
  UserResponse,
  UsersListRequest,
  UsersListResponse,
  AddUserRequest,
  UpdatePwdRequest,
  User,
} from "../types/user";

function lookupPermissionType(user: User) {
  if (user.permissions !== undefined) {
    return {
      ...user,
      permissions: user.permissions.map((permission) =>
        typeof permission === "number"
          ? permissionTypeList[permission]
          : permission
      ),
    };
  } else {
    return user;
  }
}

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL + "user",
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], UsersListRequest>({
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
        url: `/${request.id}`,
        headers: request.headers,
      }),
      transformResponse: (response: UserResponse) =>
        lookupPermissionType(response.data),
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
    updatePwd: builder.mutation<BaseResponse, UpdatePwdRequest>({
      query: (request: UpdatePwdRequest) => ({
        url: "/updatepwd",
        method: "PUT",
        body: request.body,
        headers: request.headers,
      }),
    }),
    deleteUser: builder.mutation<BaseResponse, UserByIdRequest>({
      query: (request: UserByIdRequest) => ({
        url: `/${request.id}`,
        method: "DELETE",
        headers: request.headers,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLazyGetAllUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useAddUserMutation,
  useUpdatePwdMutation,
  useDeleteUserMutation,
} = userApi;
