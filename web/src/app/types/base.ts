// base data
export interface User {
  userId: number;
  roles: Array<OperationType>;
  isActive:boolean
}

export enum UserType {
  Admin,
  Manager,
  User,
}

export enum OperationType {
  User_Add,
  User_Delete,
}

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
