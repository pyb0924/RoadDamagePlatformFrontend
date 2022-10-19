import { BaseResponse, TokenData } from "./data";

export interface LoginBody {
  username: string;
  grantType?: string;
  scope?: string;
  clientId?: string;
  clientSecret?: string;
  password: string;
}

interface TokenDataWithId extends TokenData {
  userId: number;
}

interface TokenSuccessResponse extends BaseResponse {
  data: TokenDataWithId;
}

type TokenFailResponse = BaseResponse;

export type TokenResponse = TokenSuccessResponse | TokenFailResponse;
