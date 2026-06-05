import { z } from "zod";
import { TASK_PRIORITY, TASK_STATUS } from "./Task.interface";

const priorityEnum = [
  TASK_PRIORITY.low,
  TASK_PRIORITY.medium,
  TASK_PRIORITY.high,
] as const;
const statusEnum = [
  TASK_STATUS.todo,
  TASK_STATUS.in_progress,
  TASK_STATUS.completed,
] as const;

export const createTaskValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Title is too long"),
  description: z.string().min(1, "Task description is required"),
  project: z.string().min(1, "Project reference is required"),
  assignedMembers: z
    .array(z.string())
    .min(1, "Please select at least one member"),
  priority: z.enum(priorityEnum).optional(),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      {
        message: "Due date cannot be set in the past",
      },
    ),
});

export const updateTaskValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  assignedMembers: z
    .array(z.string())
    .min(1, "Please select at least one member")
    .optional(),
  priority: z.enum(priorityEnum).optional(),
  status: z.enum(statusEnum).optional(),
  dueDate: z
    .string()
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      {
        message: "Due date cannot be set in the past",
      },
    )
    .optional(),
});

export type TTaskFormValues = z.infer<typeof createTaskValidationSchema>;
