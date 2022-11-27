// base data

export enum TokenType {
  'Bearer',
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

export interface BaseRequest {
  path?: string;
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
