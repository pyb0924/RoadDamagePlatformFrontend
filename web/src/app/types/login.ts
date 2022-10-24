import { TokenData } from "./base";
import {
  BaseRequest,
  BaseRequestWithToken,
  BaseResponse,
  FailResponse,
} from "./base";

// data
export interface LoginBody {
  username: string;
  grantType?: string;
  scope?: string;
  clientId?: string;
  clientSecret?: string;
  password: string;
}

export interface TokenDataWithId extends TokenData {
  userId: number;
}

// login
export interface LoginRequest extends BaseRequest {
  body: LoginBody;
}

export interface LoginSuccessResponse extends BaseResponse {
  data: TokenDataWithId;
}

export type LoginResponse = LoginSuccessResponse | FailResponse;

// refresh
export type RefreshRequest = BaseRequestWithToken;

interface RefreshSuccessResponse extends BaseResponse {
  data: TokenData;
}

export type RefreshResponse = RefreshSuccessResponse | FailResponse;
