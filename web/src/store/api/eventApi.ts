import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

import {BaseResponse} from '../types/base';
import {
  Event,
  EditEventRequest,
  GetEventByIdRequest,
  GetEventByIdResponse,
  GetEventsRequest,
  GetEventsResponse,
  GetImageByLogIdRequest,
  GetImageByLogIdResponse,
  GetLogByIdRequest,
  GetLogByIdResponse,
} from '../types/event';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({baseUrl: process.env.REACT_APP_BASEURL + 'event/'}),
  endpoints: builder => ({
    getEvents: builder.query<GetEventsResponse, GetEventsRequest>({
      query: (request: GetEventsRequest) => ({
        url: '',
        params: request.params,
        headers: request.headers,
      }),
    }),
    getAllEvents: builder.query<Event[], GetEventsRequest>({
      query: (request: GetEventsRequest) => ({
        url: '',
        headers: request.headers,
      }),
      transformResponse: (response: GetEventsResponse) =>
        response.data.event_list,
    }),
    getEventById: builder.query<GetEventByIdResponse, GetEventByIdRequest>({
      query: (request: GetEventByIdRequest) => ({
        url: request.path,
        headers: request.headers,
      }),
    }),
    editEvent: builder.mutation<BaseResponse, EditEventRequest>({
      query: (request: EditEventRequest) => ({
        url: request.path,
        method: 'PUT',
        params: request.params,
        body: request.body,
        headers: {...request.headers, 'Content-Type': 'multipart/form-data'},
      }),
    }),
    getLogById: builder.query<GetLogByIdResponse, GetLogByIdRequest>({
      query: (request: GetLogByIdRequest) => ({
        url: `log/${request.path}`,
        headers: request.headers,
      }),
    }),
    getImageByLogId: builder.query<
      GetImageByLogIdResponse,
      GetImageByLogIdRequest
    >({
      query: (request: GetImageByLogIdRequest) => ({
        url: `image/${request.path}`,
        headers: request.headers,
      }),
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useEditEventMutation,
  useGetLogByIdQuery,
  useGetImageByLogIdQuery,
} = eventApi;
