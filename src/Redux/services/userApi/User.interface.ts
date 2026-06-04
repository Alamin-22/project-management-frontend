import { IQueryMeta } from "@/app/types/common";
import { IBaseResponse } from "@/Redux/api/baseApi";

export const USER_ROLE = {
  super_admin: "super_admin",
  admin: "admin",
  manager: "manager",
} as const;

export const USER_STATUS = {
  active: "active",
  blocked: "blocked",
} as const;

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;

export interface IAdminProfile {
  name: string;
  email: string;
  contactNo: string;
  permissions: string[];
  profileImg?: {
    url: string;
    publicId: string;
  };

  _id?: string;
  id?: string;
  user?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IManageStaffPayload {
  password?: string;
  role?: TUserRole;
  admin: {
    name: string;
    email: string;
    contactNo: string;
    permissions: string[];
  };
}

export interface IUpdateStaffArgs {
  id: string;
  data: Partial<IManageStaffPayload>;
}

export interface IUser {
  _id: string;
  id: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;
  adminProfile: IAdminProfile;

  lastActive?: string;
  isVerified?: boolean;
  isDeleted?: boolean;
  needsPasswordChange?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetStaffResponse {
  meta: IQueryMeta;
  result: IUser[];
}

export interface IPermissionMeta {
  label: string;
  description: string;
}

export type TPermissionManifestResponse = IBaseResponse<
  Record<string, IPermissionMeta>
>;
