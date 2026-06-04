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
        Swal.fire({
          title: "Check Your Email",
          text: res?.message || "We've sent a secure reset link to your inbox.",
          icon: "success",
          confirmButtonColor: "hsl(var(--primary))",
        });
        closeModal();
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.data?.errorSource?.[0]?.message ||
        error?.data?.message ||
        "Failed to request password reset.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Account Recovery
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your staff email address to receive a secure password reset
            link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="name@company.com"
              className={errors.email ? "border-destructive" : ""}
              type="email"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Send Reset Link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgetPassword;
