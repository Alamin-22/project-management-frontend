/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useForgetPasswordMutation } from "@/Redux/services/authApi/AuthAPi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Swal from "sweetalert2";

interface ForgetPasswordProps {
  closeModal: () => void;
}

const forgetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgetFormData = z.infer<typeof forgetSchema>;

const ForgetPassword = ({ closeModal }: ForgetPasswordProps) => {
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetFormData>({
    resolver: zodResolver(forgetSchema),
  });

  const onSubmit = async (data: ForgetFormData) => {
    try {
      const res = await forgetPassword(data).unwrap();

      if (res?.success) {
        Swal.fire(
          "Please Check your Email",
          `${res?.message || "Please check your email!"}`,
          "success",
        );
        // toast.success(res?.message || "Please check your email!");
        closeModal();
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.data?.errorSource?.[0]?.message ||
        error?.data?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Verify Your Account
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your email address to receive a verification link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="you@example.com"
              className={errors.email ? "border-destructive" : ""}
              type="email"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Verify Email"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgetPassword;
