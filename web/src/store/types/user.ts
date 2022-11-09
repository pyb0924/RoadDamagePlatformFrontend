import {BaseRequestByPage, BaseRequestWithToken, BaseResponse} from './base';

export interface User {
  user_id: string;
  username: string;
  is_active: number;
  permissions: Array<string>;
  permission_ids: Array<string>;
  create_time: string;
  update_time: string;
}

export enum UserModalType {
  DEFAULT,
  USER_ADD,
  USER_EDIT,
}

export interface UserFormData {
  username: string;
  password?: string;
  is_active: number;
  permissions: string[];
}

export interface UsersListResponseData {
  total: number;
  user_list: User[];
}

export interface UsersListResponse extends BaseResponse {
  data: UsersListResponseData;
}

export interface UserResponse extends BaseResponse {
  data: User;
}

export type UsersListRequest = BaseRequestByPage;

export interface UserByIdRequest extends BaseRequestWithToken {
  id: string;
}

export interface AddUserRequest extends BaseRequestWithToken {
  body: {
    username: string;
    password: string;
    permissions: string[];
  };
}

export interface EditUserRequest extends BaseRequestWithToken {
  id: string;
  body: {is_active: number; permission_ids: string[]};
}

export interface EditCurrentUserRequest extends BaseRequestWithToken {
  id: string;
  body: {
    avatar: string;
    email: string;
    phone: string;
  };
}

export interface UpdatePwdRequest extends BaseRequestWithToken {
  id: string;
  body: {
    old_password: string;
    password: string;
  };
}
