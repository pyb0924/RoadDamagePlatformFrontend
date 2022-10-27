import { BaseRequestByPage, BaseRequestWithToken, BaseResponse } from "./base";

import { PermissionType } from "./permission";

export interface User {
  user_id: string;
  username: string;
  is_active: number;
  permissions?: Array<PermissionType | string>;
  permission_ids:Array<string>
  create_time: string;
  update_time: string;
}

export enum UserFormType {
  USER_ADD,
  USER_EDIT,
}

export interface UsersListResponse extends BaseResponse {
  data: Array<User>;
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
    permissions: PermissionType[];
  };
}

export interface UpdatePwdRequest extends BaseRequestWithToken {
  body: {
    user_id: string;
    old_password: string;
    password: string;
  };
}
