import {
  BaseRequestByPage,
  BaseRequestWithToken,
  BaseResponse,
  User,
} from "./base";

export interface UsersListResponse extends BaseResponse {
  data: Array<User>;
}

export interface UserResponse extends BaseResponse {
  data: User;
}

export type UsersListRequest = BaseRequestByPage;

export interface UserByIdRequest extends BaseRequestWithToken {
  id: number;
}
