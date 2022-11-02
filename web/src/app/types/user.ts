import { BaseRequestByPage, BaseRequestWithToken, BaseResponse } from "./base";

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
    permissions: string[];
  };
}

export interface UpdatePwdRequest extends BaseRequestWithToken {
  body: {
    user_id: string;
    old_password: string;
    password: string;
  };
}
