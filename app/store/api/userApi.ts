import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Users} from '../types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  // TODO api base url
  baseQuery: fetchBaseQuery({baseUrl: 'https://xxxx/api/'}),
  endpoints: builder => ({
    getUserById: builder.query<Users, string>({
      query: id => `users/${id}`,
    }),
  }),
});

export const {useGetUserByIdQuery} = usersApi;
