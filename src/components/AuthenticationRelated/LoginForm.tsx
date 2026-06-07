"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/Redux/services/authApi/AuthAPi";
import {
  loginValidationSchema,
  ILoginFormData,
} from "@/Redux/services/authApi/Auth.validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import IcfyIcon from "../Shared/IcfyIcon";
import ForgetPassword from "@/components/AuthenticationRelated/ForgetPassword";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);

  const form = useForm<ILoginFormData>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: ILoginFormData) => {
    try {
      const res = await login(values).unwrap();

      if (res?.data?.accessToken) {
        sessionStorage.setItem("accessToken", res.data.accessToken);
      }

      const userRole = res?.data?.user?.role || "";
      const isManager = ["super_admin", "admin", "project_manager"].includes(
        userRole,
      );
      const defaultRedirectUrl = isManager
        ? "/manager_workspace"
        : "/member_workspace";

      const redirectUrl = searchParams.get("redirectUrl") || defaultRedirectUrl;

      toast.success(`Access Granted: Welcome to the Workspace`);
      router.push(redirectUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Authentication failed. Please verify credentials.",
      );
    }
  };

  const handleDemoLogin = (role: "manager" | "member") => {
    const options = {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    };

    if (role === "manager") {
      form.setValue("email", "manager@smartproject.com", options);
      form.setValue("password", "admin123456", options);
      toast.success("Manager credentials loaded! Click 'Sign In' to proceed.");
    } else {
      form.setValue("email", "member@smartproject.com", options);
      form.setValue("password", "member123456", options);
      toast.success("Member credentials loaded! Click 'Sign In' to proceed.");
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Staff Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@company.com"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <button
                    type="button"
                    onClick={() => setIsForgetModalOpen(true)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="pr-10 bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <IcfyIcon
                        icon={
                          showPassword
                            ? "solar:eye-closed-bold-duotone"
                            : "solar:eye-bold-duotone"
                        }
                        className="text-lg"
                      />
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full font-bold h-11"
            disabled={isLoading}
          >
            {isLoading ? "Validating Session..." : "Sign In to Workspace"}
          </Button>
        </form>
      </Form>

      {/* Visual Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
          <span className="bg-card px-2 text-muted-foreground font-semibold">
            Quick Fill
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          className="w-full border-primary/20 text-primary hover:bg-primary/5 font-bold h-11"
          onClick={() => handleDemoLogin("manager")}
          disabled={isLoading}
        >
          <IcfyIcon
            icon="solar:user-id-bold-duotone"
            className="mr-2 text-xl"
          />
          Manager
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full border-primary/20 text-primary hover:bg-primary/5 font-bold h-11"
          onClick={() => handleDemoLogin("member")}
          disabled={isLoading}
        >
          <IcfyIcon
            icon="solar:users-group-two-rounded-bold-duotone"
            className="mr-2 text-xl"
          />
          Member
        </Button>
      </div>

      {isForgetModalOpen && (
        <ForgetPassword closeModal={() => setIsForgetModalOpen(false)} />
      )}
    </div>
  );
};

export default LoginForm;
