import { z } from "zod";
import { PROJECT_STATUS } from "./Project.interface";

const statusEnum = Object.values(PROJECT_STATUS) as [string, ...string[]];

export const createProjectValidationSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),

  deadline: z.coerce
    .date({ error: "Deadline is required" })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Deadline cannot be set in the past",
    }),
});

export type TCreateProjectFormValues = z.infer<
  typeof createProjectValidationSchema
>;

export const updateProjectValidationSchema = z.object({
  name: z.string().min(1, "Project name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  deadline: z.coerce
    .date()
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Deadline cannot be set in the past",
    })
    .optional(),
  status: z.enum(statusEnum).optional(),
});

export type TUpdateProjectFormValues = z.infer<
  typeof updateProjectValidationSchema
>;
