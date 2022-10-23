import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseResponse, roleTypeList, User } from "../types/base";
import {
  UserByIdRequest,
  UserResponse,
  UsersListRequest,
  UsersListResponse,
  AddUserRequest,
  UpdatePwdRequest,
} from "../types/user";

function lookupRoleType(user: User) {
  return {
    ...user,
    role: user.roles.map((role) =>
      typeof role === "number" ? roleTypeList[role] : role
    ),
  };
}

export const userApi = createApi({
  reducerPath: "usersApi",
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
      transformResponse: (response: UsersListResponse) =>
        response.data.map(lookupRoleType),
    }),
    getUserById: builder.query<User, UserByIdRequest>({
      query: (request: UserByIdRequest) => ({
        url: `/${request.id}`,
        headers: request.headers,
      }),
      transformResponse: (response: UserResponse) =>
        lookupRoleType(response.data),
    }),
    addUser: builder.mutation<BaseResponse, AddUserRequest>({
      query: (request: AddUserRequest) => ({
        url: "",
        method: "POST",
        body: request.body,
        headers: request.headers,
      }),
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
    }),
  }),
});

export const { useLazyGetAllUsersQuery, useGetUserByIdQuery } = userApi;
