export const TASK_STATUS = {
  todo: "To-Do",
  in_progress: "In Progress",
  completed: "Completed",
} as const;

export const TASK_PRIORITY = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

export type TTaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
export type TTaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

export interface ITask {
  _id: string;
  taskId: string;
  slug: string;
  title: string;
  description: string;

  project: string;
  assignedMember: string;

  dueDate: string;
  priority: TTaskPriority;
  priorityWeight: number;
  status: TTaskStatus;
  order: number;

  createdBy: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  projectDetails?: {
    name: string;
    projectId: string;
    slug: string;
    status: string;
    deadline: string;
    isDeleted: boolean;
  };
  assigneeProfile?: {
    name: string;
    email: string;
    profileImg?: { url: string; publicId: string };
    designation?: string;
  };
}

export interface ICreateTaskPayload {
  title: string;
  description: string;
  project: string;
  assignedMember: string;
  priority?: TTaskPriority;
  dueDate: string;
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
  assignedMember?: string;
  priority?: TTaskPriority;
  status?: TTaskStatus;
  dueDate?: string;
}
