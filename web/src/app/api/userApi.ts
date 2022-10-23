import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { roleTypeList, User } from "../types/base";
import {
  UserByIdRequest,
  UserResponse,
  UsersListRequest,
  UsersListResponse,
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
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASEURL+"user" }),
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
        url: `${request.id}`,
        headers: request.headers,
      }),
      transformResponse: (response: UserResponse) =>
        lookupRoleType(response.data),
    }),
    //addUser: builder.mutation<
  }),
});

export const { useLazyGetAllUsersQuery, useGetUserByIdQuery } = userApi;
