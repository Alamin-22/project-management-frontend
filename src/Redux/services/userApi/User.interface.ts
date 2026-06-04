import { IQueryMeta } from "@/app/types/common";

export const USER_ROLE = {
  super_admin: "super_admin",
  admin: "admin",
  project_manager: "project_manager",
  team_member: "team_member",
} as const;

export const USER_STATUS = {
  in_progress: "in-progress",
  blocked: "blocked",
} as const;

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface IProfile {
  name: string;
  email: string;
  contactNo?: string;
  profileImg?: string; // Or { url: string; publicId: string } depending on your exact backend model

  _id?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IManageStaffPayload {
  password?: string;
  role?: TUserRole;
  profile: {
    name: string;
    contactNo: string;
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
  profile: IProfile;

  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetStaffResponse {
  meta: IQueryMeta;
  result: IUser[];
}
