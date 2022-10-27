// base data
export const HTTP_OK = 200;

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
