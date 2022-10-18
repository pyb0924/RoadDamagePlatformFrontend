import {BaseResponse, TokenData} from './data';

export interface LoginBody {
  username: string;
  grantType?: string;
  scope?: string;
  clientId?: string;
  clientSecret?: string;
  password: string;
}

interface TokenSuccessResponse extends BaseResponse {
  data: TokenData;
}

type TokenFailResponse = BaseResponse;

export type TokenResponse = TokenSuccessResponse | TokenFailResponse;
