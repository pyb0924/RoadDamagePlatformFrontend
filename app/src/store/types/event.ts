import {BaseRequestWithToken} from './base';

export interface EventBase {
  type: EventType;
  longitude: number;
  latitude: number;
  position: string;
  user: string;
  notes?: string;
}

export interface Event extends EventBase {
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
