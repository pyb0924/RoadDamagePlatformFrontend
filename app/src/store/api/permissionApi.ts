import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Config from 'react-native-config';

import {BaseRequestWithToken} from '../types/base';
import {PermissionNode, PermissionTreeResponse} from '../types/permission';

export const permissionApi = createApi({
  reducerPath: 'permissionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: Config.API_BASEURL + 'permission',
  }),
  endpoints: builder => ({
    getPermissionTree: builder.query<PermissionNode[], BaseRequestWithToken>({
      query: (request: BaseRequestWithToken) => ({
        url: '',
        headers: request.headers,
      }),
      transformResponse: (response: PermissionTreeResponse) => response.data,
      keepUnusedDataFor: 3600 * 7,
    }),
  }),
});

export const {useGetPermissionTreeQuery} = permissionApi;
