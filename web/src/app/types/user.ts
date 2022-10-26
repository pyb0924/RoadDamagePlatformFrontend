import {
  BaseRequestByPage,
  BaseRequestWithToken,
  BaseResponse,
  PermissionType,
  User,
} from "./base";

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
