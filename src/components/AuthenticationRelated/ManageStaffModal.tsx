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
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  useCreateStaffMutation,
  useGetPermissionMetaQuery,
  useUpdateStaffProfileMutation,
} from "@/Redux/services/userApi/UserApi";
import {
  createStaffFormSchema,
  updateStaffFormSchema,
  TStaffFormValues,
} from "@/Redux/services/userApi/User.validation";
import {
  IManageStaffPayload,
  IUser,
} from "@/Redux/services/userApi/User.interface";
import CustomFormField from "../DashboardRelated/Admin/Products/AddProductForm/CustomFormField";

interface ManageStaffModalProps {
  user?: IUser;
  closeModal: () => void;
}

const ManageStaffModal = ({ user, closeModal }: ManageStaffModalProps) => {
  const isUpdateMode = !!user;

  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] =
    useUpdateStaffProfileMutation();
  const { data: permissionMeta, isLoading: isLoadingMeta } =
    useGetPermissionMetaQuery();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<TStaffFormValues>({
    resolver: zodResolver(
      isUpdateMode ? updateStaffFormSchema : createStaffFormSchema,
    ),
    defaultValues: {
      name: "",
      email: "",
      contactNo: "",
      role: "manager",
      permissions: [],
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.adminProfile?.name || "",
        email: user.email || "",
        contactNo: user.adminProfile?.contactNo || "",

        role: (user.role === "super_admin"
          ? "admin"
          : user.role) as TStaffFormValues["role"],
        permissions: (user.adminProfile?.permissions ||
          []) as TStaffFormValues["permissions"],
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: TStaffFormValues) => {
    const payload: IManageStaffPayload = {
      role: values.role,
      admin: {
        name: values.name,
        email: values.email,
        contactNo: values.contactNo,
        permissions: values.permissions,
      },
    };

    if (values.password && values.password.trim().length > 0) {
      payload.password = values.password;
    }

    try {
      if (isUpdateMode && user) {
        await updateStaff({ id: user.id, data: payload }).unwrap();
        Swal.fire("Success", "Staff profile updated successfully.", "success");
      } else {
        await createStaff(payload).unwrap();
        Swal.fire(
          "Success",
          `New ${values.role} registered successfully.`,
          "success",
        );
      }
      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire("Error", error?.data?.message || "Action failed.", "error");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        {/* --- Personal Information --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
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
            placeholder="staff@ims.com"
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
            placeholder="Select a role"
            options={[
              { label: "Admin (System Access)", value: "admin" },
              { label: "Manager (Operational Access)", value: "manager" },
            ]}
          />
        </div>

        {/* --- Permissions Grid --- */}
        <div className="space-y-3 rounded-lg border border-border p-4 bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-700">
            Module Permissions
          </h3>
          {isLoadingMeta ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading manifest...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(permissionMeta?.data || {}).map(([key, meta]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white shadow-sm hover:border-primary/20 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(key)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            return checked
                              ? field.onChange([...current, key])
                              : field.onChange(
                                  current.filter((v) => v !== key),
                                );
                          }}
                        />
                      </FormControl>
                      <div className="leading-none space-y-1">
                        <FormLabel className="text-xs font-bold cursor-pointer">
                          {meta.label}
                        </FormLabel>
                        <FormDescription className="text-[10px] leading-tight line-clamp-1">
                          {meta.description}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}
          <FormMessage className="text-xs" />
        </div>

        {/* --- Security Section --- */}
        <div className="bg-slate-50/50 p-4 rounded-lg border border-dashed border-slate-200">
          <div className="flex flex-col mb-4">
            <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
              {isUpdateMode ? "Credentials Reset" : "Security Credentials"}
            </h3>
            {isUpdateMode && (
              <span className="text-[9px] text-slate-400 font-medium">
                Keep blank to maintain the current secure password.
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-600 font-medium">
                    {isUpdateMode ? "New Password" : "Temporary Password"}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={isUpdateMode ? "New secret" : "••••••••"}
                        {...field}
                        className="bg-white pr-10"
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

            {/* Confirm Password Field  */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-600 font-medium">
                    Confirm Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="bg-white pr-10"
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
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={closeModal}
            className="font-bold text-xs uppercase tracking-widest"
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
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Saving...
              </>
            ) : isUpdateMode ? (
              "Update Member"
            ) : (
              "Create Access"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManageStaffModal;
