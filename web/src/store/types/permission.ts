import {BaseResponse} from './base';

export interface PermissionNode {
  key: string;
  title: string;
  children?: PermissionNode[];
}

export enum PermissionType {
  SYSTEM = 'system',
  USER = 'user',
  USER_ADD = 'user:add',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',
  MAP = 'map',
  DASHBOARD = 'dashboard',
  EVENT = 'event',
  EVENT_ADD = 'event:add',
  EVENT_EDIT = 'event:edit',
}

export interface PermissionTreeResponse extends BaseResponse {
  data: PermissionNode[];
}
