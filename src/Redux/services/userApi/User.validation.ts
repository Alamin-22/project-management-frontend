import { z } from "zod";

export type TStaffFormValues = {
  name: string;
  email: string;
  contactNo: string;
  role: "super_admin" | "admin" | "project_manager" | "team_member";
  password?: string;
  confirmPassword?: string;
};

const baseStaffSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  contactNo: z.string().min(1, "Contact number is required"),
  role: z.enum(["super_admin", "admin", "project_manager", "team_member"]),
});

export const createStaffFormSchema = baseStaffSchema
  .extend({
    password: z.string().min(6, "Min 6 characters").max(20),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateStaffFormSchema = baseStaffSchema
  .extend({
    password: z.string().min(6).max(20).optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );
