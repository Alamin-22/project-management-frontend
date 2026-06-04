"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  IManageStaffPayload,
  IUser,
  USER_ROLE,
} from "@/Redux/services/userApi/User.interface";
import {
  useCreateStaffMutation,
  useUpdateProfileMutation,
} from "@/Redux/services/userApi/UserApi";
import {
  createStaffFormSchema,
  TStaffFormValues,
  updateStaffFormSchema,
} from "@/Redux/services/userApi/User.validation";
import CustomFormField from "@/Utils/CustomFormField";

interface ManageStaffModalProps {
  user?: IUser;
  closeModal: () => void;
}

const ManageStaffModal = ({ user, closeModal }: ManageStaffModalProps) => {
  const isUpdateMode = !!user;

  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<TStaffFormValues>({
    resolver: zodResolver(
      isUpdateMode ? updateStaffFormSchema : createStaffFormSchema,
    ) as any,
    defaultValues: {
      name: "",
      email: "",
      contactNo: "",
      role: USER_ROLE.team_member,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.profile?.name || "",
        email: user.email || "",
        contactNo: user.profile?.contactNo || "",
        role: user.role as TStaffFormValues["role"],
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: TStaffFormValues) => {
    const payload: IManageStaffPayload | any = {
      role: values.role,
      profile: {
        name: values.name,
        contactNo: values.contactNo,
        email: values.email,
      },
    };

    if (values.password && values.password.trim().length > 0) {
      payload.password = values.password;
    }

    try {
      if (isUpdateMode && user) {
        const updatePayload: any = {
          profile: {
            name: values.name,
            contactNo: values.contactNo,
          },
        };

        if (values.password && values.password.trim().length > 0) {
          updatePayload.password = values.password;
        }

        await updateStaff({
          id: user.profile?.id || user.id,
          data: updatePayload,
        }).unwrap();

        Swal.fire({
          title: "Success",
          text: "Profile updated successfully.",
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });
      } else {
        await createStaff(payload).unwrap();

        const roleDisplayName = values.role
          ? values.role.replace("_", " ")
          : "Account";

        Swal.fire({
          title: "Provisioned",
          text: `New ${roleDisplayName} registered successfully.`,
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });
      }
      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.data?.message || "Action failed.",
        icon: "error",
        background: "var(--card)",
        color: "var(--foreground)",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomFormField
            control={form.control}
            name="name"
            label="Full Name"
            placeholder={isUpdateMode ? "Edit name" : "e.g. Md. Al Amin"}
          />
          <CustomFormField
            control={form.control}
            name="email"
            label="Staff Email"
            type="email"
            disabled={isUpdateMode}
            placeholder="staff@smartproject.com"
          />
          <CustomFormField
            control={form.control}
            name="contactNo"
            label="Contact Number"
            placeholder="+8801..."
          />
          <CustomFormField
            control={form.control}
            name="role"
            label="System Role"
            type="select"
            disabled={isUpdateMode}
            placeholder="Select a role"
            options={[
              ...(isUpdateMode && user?.role === USER_ROLE.super_admin
                ? [
                    {
                      label: "System Kernel (Super Admin)",
                      value: USER_ROLE.super_admin,
                    },
                  ]
                : []),
              { label: "Administrator", value: USER_ROLE.admin },
              { label: "Project Manager", value: USER_ROLE.project_manager },
              {
                label: "Team Member / Developer",
                value: USER_ROLE.team_member,
              },
            ]}
          />
        </div>

        {/* --- Security Section --- */}
        <div className="bg-muted/30 p-5 rounded-lg border border-dashed border-border/60">
          <div className="flex flex-col mb-4">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
              {isUpdateMode ? "Credentials Reset" : "Security Credentials"}
            </h3>
            {isUpdateMode && (
              <span className="text-[10px] text-muted-foreground/70 font-medium mt-1">
                Leave fields blank to maintain the current secure password.
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-foreground">
                    {isUpdateMode ? "New Password" : "Temporary Password"}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          isUpdateMode ? "Leave blank to keep" : "••••••••"
                        }
                        {...field}
                        className="bg-background pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-foreground">
                    Confirm Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="bg-background pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* --- Footer Actions --- */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={closeModal}
            className="font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-bold text-xs uppercase tracking-widest px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Processing...
              </>
            ) : isUpdateMode ? (
              "Update Member"
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManageStaffModal;
