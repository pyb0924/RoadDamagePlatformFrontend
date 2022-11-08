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
  user_id: string;
}

// login
export interface LoginRequest extends BaseRequest {
  body: LoginBody;
}

export interface LoginResponse extends BaseResponse {
  data: TokenDataWithId;
}

// refresh
export type RefreshRequest = BaseRequestWithToken;

export interface RefreshResponse extends BaseResponse {
  data: TokenData;
}
