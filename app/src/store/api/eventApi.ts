import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import qs from 'qs';
import Config from 'react-native-config';
import {allEventStatus, allEventTypes} from '../../utils/constants';

import {BaseResponse} from '../types/base';
import {
  Event,
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
  Log,
} from '../types/event';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({baseUrl: Config.API_BASEURL + '/event'}),
  endpoints: builder => ({
    addEvent: builder.mutation<BaseResponse, AddEventRequest>({
      query: (request: AddEventRequest) => ({
        url: '',
        method: 'POST',
        params: request.params,
        body: request.body,
        headers: {...request.headers, 'Content-Type': 'multipart/form-data'},
      }),
    }),
    getEvents: builder.query<GetEventsResponse, GetEventsRequest>({
      query: (request: GetEventsRequest) => ({
        url: '?' + qs.stringify(request.params, {indices: false}),
        headers: request.headers,
      }),
      keepUnusedDataFor: 5,
    }),
    getAllEvents: builder.query<Event[], GetEventsRequest>({
      query: (request: GetEventsRequest) => ({
        url:
          '?' +
          qs.stringify(
            {
              user_id: '',
              status: allEventStatus,
              type: allEventTypes,
            },
            {indices: false},
          ),
        headers: request.headers,
      }),
      transformResponse: (response: GetEventsResponse) =>
        response.data.event_list,
    }),
    getEventById: builder.query<Event, GetEventByIdRequest>({
      query: (request: GetEventByIdRequest) => ({
        url: `/${request.path}`,
        headers: request.headers,
      }),
      transformResponse: (response: GetEventByIdResponse) => response.data,
    }),
    editEvent: builder.mutation<BaseResponse, EditEventRequest>({
      query: (request: EditEventRequest) => ({
        url: `/${request.path}`,
        method: 'PUT',
        params: request.params,
        body: request.body,
        headers: {...request.headers, 'Content-Type': 'multipart/form-data'},
      }),
    }),
    getLogById: builder.query<Log[], GetLogByIdRequest>({
      query: (request: GetLogByIdRequest) => ({
        url: `/log/${request.path}`,
        headers: request.headers,
      }),
      transformResponse: (response: GetLogByIdResponse) => response.data,
    }),
    getImageByLogId: builder.query<
      GetImageByLogIdResponse,
      GetImageByLogIdRequest
    >({
      query: (request: GetImageByLogIdRequest) => ({
        url: `/image/${request.path}`,
        headers: request.headers,
      }),
    }),
  }),
});

export const {
  useAddEventMutation,
  useGetEventsQuery,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useEditEventMutation,
  useGetLogByIdQuery,
  useGetImageByLogIdQuery,
} = eventApi;
