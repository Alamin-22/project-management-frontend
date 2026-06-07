"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LockKeyhole, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAppState } from "@/Provider/StateProvider";
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
import { useChangePasswordMutation } from "@/Redux/services/authApi/AuthAPi";
import {
  ChangePasswordSchema,
  TChangePasswordValues,
} from "@/Redux/services/authApi/Auth.validation";

const ChangePasswordForm = () => {
  const { handleLogOut } = useAppState();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<TChangePasswordValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: TChangePasswordValues) => {
    const confirm = await Swal.fire({
      title: "Confirm Password Reset?",
      text: "For security reasons, changing your password will terminate all active sessions. You must log in again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      confirmButtonText: "Update & Logout",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (!confirm.isConfirmed) return;

    const toastId = toast.loading("Updating security credentials...");

    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success("Password changed! Redirecting...", { id: toastId });

      setTimeout(async () => {
        await handleLogOut();
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password", {
        id: toastId,
      });
    }
  };

  return (
    <div className="w-full bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
      {/* warning */}
      <div className="bg-muted/30 p-8 border-b border-border flex items-center gap-5">
        <div className="h-12 w-12 bg-card rounded-2xl flex items-center justify-center text-primary shadow-sm border border-border">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
            Credentials Management
          </h3>
          <p className="text-[11px] text-muted-foreground font-medium italic">
            Secure your account with a complex passphrase.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Current Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showOld ? "text" : "password"}
                      className="h-12 rounded-xl bg-muted/30 border-border focus:bg-card transition-all pr-12"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOld ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage className="text-[10px] font-bold" />
              </FormItem>
            )}
          />

          <hr className="border-border" />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  New Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showNew ? "text" : "password"}
                      className="h-12 rounded-xl bg-muted/30 border-border focus:bg-card transition-all pr-12"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage className="text-[10px] font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Verify New Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      className="h-12 rounded-xl bg-muted/30 border-border focus:bg-card transition-all pr-12"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage className="text-[10px] font-bold" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] transition-all active:scale-95 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                Synchronizing...
              </>
            ) : (
              <span className="flex items-center gap-2">
                Change Password <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
