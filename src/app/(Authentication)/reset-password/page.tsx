/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import * as z from "zod";
import Swal from "sweetalert2";
import { useResetPasswordMutation } from "@/Redux/services/authApi/AuthAPi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IcfyIcon from "@/components/Shared/IcfyIcon";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type TResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailValue, setEmailValue] = useState("");

  useEffect(() => {
    document.title = "Reset Password | Smart Project Workspace";

    // Function to load email from session storage
    const loadEmail = () => {
      const storedEmail = sessionStorage.getItem("urlEmail");
      if (storedEmail) {
        setEmailValue(storedEmail);
      }
    };

    loadEmail();

    window.addEventListener("tokensReady", loadEmail);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("tokensReady", loadEmail);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: TResetPasswordForm) => {
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("urlToken") : null;
    const email =
      typeof window !== "undefined" ? sessionStorage.getItem("urlEmail") : null;

    if (!token || !email) {
      toast.error("Reset session expired or invalid link.");
      return;
    }

    try {
      await resetPassword({
        token,
        body: {
          newPassword: values.password,
        },
      }).unwrap();

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("urlToken");
        sessionStorage.removeItem("urlEmail");
      }

      await Swal.fire({
        title: "Success!",
        text: "Your password has been reset successfully. Please login with your new credentials.",
        icon: "success",
        confirmButtonColor: "hsl(var(--primary))",
      });

      router.push("/login");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-sm border border-border">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Set New Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Identity verified. Choose a strong new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={emailValue}
              readOnly
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                className={
                  errors.password ? "border-destructive pr-10" : "pr-10"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              >
                <IcfyIcon
                  icon={showPassword ? "mdi:eye" : "entypo:eye-with-line"}
                  className="text-lg"
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                className={
                  errors.confirmPassword ? "border-destructive pr-10" : "pr-10"
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              >
                <IcfyIcon
                  icon={
                    showConfirmPassword ? "mdi:eye" : "entypo:eye-with-line"
                  }
                  className="text-lg"
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-5 text-base font-semibold mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-primary font-medium hover:underline flex items-center justify-center gap-2"
          >
            <IcfyIcon icon="solar:arrow-left-linear" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
