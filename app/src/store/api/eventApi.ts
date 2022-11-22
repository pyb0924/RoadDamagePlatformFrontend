import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import Config from 'react-native-config';
import {BaseResponse} from '../types/base';
import {
  AddEventRequest,
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
    getEvents: builder.query<GetEventsResponse, GetEventsRequest>({
      query: (request: GetEventsRequest) => ({
        url: '',
        params: request.params,
        headers: request.headers,
      }),
    }),
    getEventById: builder.query<GetEventByIdResponse, GetEventByIdRequest>({
      query: (request: GetEventByIdRequest) => ({
        url: request.id,
        headers: request.headers,
      }),
    }),
    editEvent: builder.mutation<BaseResponse, EditEventRequest>({
      query: (request: EditEventRequest) => ({
        url: request.id,
        method: 'PUT',
        params: request.params,
        body: request.body,
        headers: {...request.headers, 'Content-Type': 'multipart/form-data'},
      }),
    }),
    getLogById: builder.query<GetLogByIdResponse, GetLogByIdRequest>({
      query: (request: GetLogByIdRequest) => ({
        url: `log/${request.id}`,
        headers: request.headers,
      }),
    }),
    getImageByLogId: builder.query<
      GetImageByLogIdResponse,
      GetImageByLogIdRequest
    >({
      query: (request: GetImageByLogIdRequest) => ({
        url: `image/${request.id}`,
        headers: request.headers,
      }),
    }),
  }),
});

export const {
  useAddEventMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useEditEventMutation,
  useGetLogByIdQuery,
  useGetImageByLogIdQuery,
} = eventApi;
