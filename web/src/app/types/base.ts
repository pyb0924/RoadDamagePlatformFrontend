// base data
export const HTTP_OK = 200;

export interface User {
  user_id: string;
  username: string;
  is_active: boolean;
  permissions?: Array<PermissionType | number>;
  create_time: string;
  update_time: string;
}

export enum PermissionType {
  User_Add = "添加用户",
  User_Delete = "删除用户",
}

export const permissionTypeList = [
  PermissionType.User_Add,
  PermissionType.User_Delete,
];

export enum TokenType {
  "Bearer",
}

export interface TokenData {
  access_token: string;
  token_type: TokenType;
}

// base response & request
export interface BaseResponse {
  code: number;
  message: string;
  data: {};
}

export type FailResponse = BaseResponse;

export interface BaseRequest {
  headers?: {};
  params?: {};
  body?: {};
}

export interface BaseRequestWithToken extends BaseRequest {
  headers: {
    Authorization: string;
  };
}

export interface BaseRequestByPage extends BaseRequestWithToken {
  params: {
    offset: number;
    limit: number;
  };
}
