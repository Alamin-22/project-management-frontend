export const PROJECT_STATUS = {
  active: "Active",
  completed: "Completed",
  on_hold: "On Hold",
} as const;

export type TProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export interface IProjectCreatorProfile {
  name: string;
  email: string;
}

export interface ITeamMemberProfile {
  name: string;
  contactNo: string;
  profileImg?: { url?: string; publicId?: string };
}

export interface ITeamMember {
  _id: string;
  id: string;
  email: string;
  role: string;
  status: string;
  profile?: ITeamMemberProfile;
}

export interface IProject {
  _id: string;
  projectId: string;
  name: string;
  slug: string;
  description: string;
  deadline: string;
  status: TProjectStatus;
  createdBy: string;
  creatorProfile?: IProjectCreatorProfile;
  teamMembers: string[] | ITeamMember[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProjectPayload {
  name: string;
  description: string;
  deadline: string | Date;
}

export interface IUpdateProjectPayload extends Partial<ICreateProjectPayload> {
  status?: TProjectStatus;
}

export interface IUpdateTeamPayload {
  memberIds: string[];
  action: "add" | "remove";
}
