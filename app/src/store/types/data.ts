export interface Users {
  id: string;
}

export enum UserType {
  Admin,
  Manager,
  User,
}

export interface BaseResponse {
  code: number;
  message: string;
  data: {};
}

export enum TokenType {
  Bearer,
}

export interface TokenData {
  accessToken: string;
  tokenType: TokenType;
}
