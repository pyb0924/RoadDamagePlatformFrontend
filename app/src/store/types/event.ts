import {BaseRequestWithToken} from './base';

export interface EventBase {
  longitude: number;
  latitude: number;
  address: string;
  user: string;
  notes?: string;
}

export interface Event extends EventBase {
  type: EventType;
  event_id: string;
  status: EventStatus;
}

export enum EventStatus {
  ONCONFIRM = 0,
  ONCONSERVE,
  ONCHECK,
  CHECKED,
}

export enum EventType {
  HOLE,
}

export interface AddEventRequest extends BaseRequestWithToken {
  params: EventBase;
  body: FormData;
}
