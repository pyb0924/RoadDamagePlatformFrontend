import {BaseRequestWithToken, BaseResponse} from './base';

export interface EventBase {
  type: EventType;
  longitude: number;
  latitude: number;
  address: string;
  user_id: string;
  notes?: string;
}

export interface Event extends EventBase {
  event_id: string;
  status: EventStatus;
}

export interface Log {
  log_id: string;
  event_id: string;
  datetime: string;
  user_id: string;
  new_status: EventStatus;
  old_status: EventStatus;
  notes: string;
}

export enum EventStatus {
  WITHDRAW = 0,
  ONCONFIRM,
  ONCONSERVE,
  CONSERVING,
  ONCHECK,
  CHECKED,
}

export enum EventType {
  UNCATELOGUED = 0,
  HOLE,
  CRACK,
}

export interface AddEventRequest extends BaseRequestWithToken {
  params: EventBase;
  body: FormData;
}

export interface GetEventsRequest extends BaseRequestWithToken {
  params?: {
    type?: EventType[];
    min_longitude?: number;
    max_longitude?: number;
    min_latitude?: number;
    max_latitude?: number;
    address?: string;
    status?: EventStatus[];
    user_id?: string;
    offset?: number;
    limit?: number;
  };
}

export interface GetEventsResponse extends BaseResponse {
  data: {
    event_list: Event[];
    total: number;
  };
}

export interface GetEventByIdRequest extends BaseRequestWithToken {
  path: string;
}

export interface GetEventByIdResponse extends BaseResponse {
  data: Event;
}

export interface GetLogByIdRequest extends BaseRequestWithToken {
  path: string;
}

export interface GetLogByIdResponse extends BaseResponse {
  data: Log[];
}

export interface GetImageByLogIdRequest extends BaseRequestWithToken {
  path: string;
}

export interface GetImageByLogIdResponse extends BaseResponse {
  data: string[];
}

export interface EditEventRequest extends BaseRequestWithToken {
  path: string;
  params: {
    status: EventStatus;
    user_id: string;
    notes?: string;
  };
  body: {
    file: FormData[];
  };
}
