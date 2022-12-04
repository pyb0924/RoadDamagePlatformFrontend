import {BaseRequestWithToken, BaseResponse} from './base';

export interface EventBase {
  longitude: number;
  latitude: number;
  address: string;
  user_id: string;
  notes?: string;
}

export interface Event extends EventBase {
  type: EventType;
  event_id: string;
  status: EventStatus;
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
  HOLE,
  CRACK,
  UNCATELOGUED,
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

// TODO fill GetEventLogResponse
export interface GetLogByIdResponse extends BaseResponse {}

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
