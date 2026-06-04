import { IBaseResponse } from "@/Redux/api/baseApi";
import { TUserRole } from "../userApi/User.interface";

export interface IAuthUser {
  id: string;
  email: string;
  role: TUserRole;
}

export interface IAuthResponseData {
  accessToken: string;
  user: IAuthUser;
}

export type IAuthResponse = IBaseResponse<IAuthResponseData>;

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  body: {
    newPassword: string;
  };
}

export interface IMasterEmailChangeRequest {
  newEmail: string;
  currentPassword: string;
}

export interface IMasterEmailChangeResponse {
  success: boolean;
  message: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
