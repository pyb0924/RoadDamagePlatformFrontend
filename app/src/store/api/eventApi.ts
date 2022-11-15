import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import Config from 'react-native-config';
import {BaseResponse} from '../types/base';
import {AddEventRequest} from '../types/event';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({baseUrl: Config.API_BASEURL + 'event/'}),
  endpoints: builder => ({
    addEvent: builder.mutation<BaseResponse, AddEventRequest>({
      query: (request: AddEventRequest) => ({
        url: '',
        method: 'POST',
        body: request.body,
        headers: {...request.headers, 'Content-Type': 'multipart/form-data'},
      }),
    }),
  }),
});

export const {useAddEventMutation} = eventApi;
