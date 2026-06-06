import { z } from "zod";

export const commentValidationSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment is too long (max 2000 characters)"),
  parentComment: z.string().optional(),
});

export type TCommentFormValues = z.infer<typeof commentValidationSchema>;