import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { BaseRequestWithToken } from "../types/base";
import { Permission } from "../types/permission";

export const permissionApi = createApi({
  reducerPath: "permissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASEURL + "perm",
  }),
  endpoints: (builder) => ({
    getPermissionTree: builder.query<Permission[], BaseRequestWithToken>({
      query: (request: BaseRequestWithToken) => ({
        url: "",
        headers: request.headers,
      }),
    }),
  }),
});
