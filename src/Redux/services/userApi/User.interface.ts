import { IQueryMeta } from "@/app/types/common";

export const USER_ROLE = {
  super_admin: "super_admin",
  admin: "admin",
  project_manager: "project_manager",
  team_member: "team_member",
} as const;

export const USER_STATUS = {
  active: "active",
  blocked: "blocked",
} as const;

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;

export interface IProfile {
  _id?: string;
  id: string;
  user: string;

  name: string;
  email: string;
  contactNo: string;

  profileImg?: {
    url?: string;
    publicId?: string;
  };

  isDeleted?: boolean;
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

export interface IUpdateProfileArgs {
  id: string;
  data: Partial<{
    name: string;
    contactNo: string;
    profileImg: { url: string; publicId: string };
  }>;
}

export interface IUser {
  _id: string;
  id: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;

  profile: IProfile;

  needsPasswordChange?: boolean;
  lastActive?: string;
  isVerified?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetStaffResponse {
  meta: IQueryMeta;
  result: IUser[];
}
