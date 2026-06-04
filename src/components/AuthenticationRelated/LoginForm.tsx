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
    const redirectUrl =
      searchParams.get("redirectUrl") || "/admin_dashboard_private";

    try {
      const res = await login(values).unwrap();

      if (res?.data?.accessToken) {
        sessionStorage.setItem("accessToken", res.data.accessToken);
      }

      toast.success(`Access Granted: Welcome, ${res.data.user.role}`);
      router.push(redirectUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Authentication failed. Please verify credentials.",
      );
    }
  };

  /**
   *  Demo Login button (pre-filled)
   */
  const handleDemoLogin = () => {
    form.setValue("email", "admin@ims.com");
    form.setValue("password", "admin123456");
    toast.success("Demo credentials loaded into form.");
  };

  return (
    <div className="mt-6 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Staff Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin@ims.com"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          {/* Password Field */}
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
            {isLoading ? "Validating Session..." : "Sign In to System"}
          </Button>
        </form>
      </Form>

      {/* --- Evaluation Section --- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
          <span className="bg-card px-2 text-muted-foreground font-semibold">
            System Evaluation
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-primary/20 text-primary hover:bg-primary/5 font-bold h-11"
        onClick={handleDemoLogin}
        disabled={isLoading}
      >
        <IcfyIcon icon="solar:user-id-bold-duotone" className="mr-2 text-xl" />
        One-Click Demo Login
      </Button>

      {isForgetModalOpen && (
        <ForgetPassword closeModal={() => setIsForgetModalOpen(false)} />
      )}
    </div>
  );
};

export default LoginForm;
