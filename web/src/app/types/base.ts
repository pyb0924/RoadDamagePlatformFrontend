// base data
export interface User {
  user_id: number;
  username: string;
  is_active: boolean;
  roles: Array<RoleType | number>;
  create_time: string;
  update_time: string;
}

// export enum UserType {
//   Admin,
//   Manager,
//   User,
// }

export enum RoleType {
  User_Add = "添加用户",
  User_Delete = "删除用户",
}

export const roleTypeList = [RoleType.User_Add, RoleType.User_Delete];

export enum TokenType {
  "Bearer",
}

export interface TokenData {
  accessToken: string;
  tokenType: TokenType;
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
