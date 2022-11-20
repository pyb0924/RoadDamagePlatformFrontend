export interface EventBase {
  type: EventType;
  longitude: number;
  latitude: number;
  position: string;
}

export interface Event extends EventBase {
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
}
