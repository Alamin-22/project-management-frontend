/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShieldAlert,
  KeyRound,
  Mail,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAppState } from "@/Provider/StateProvider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/DashboardRelated/Admin/Products/AddProductForm/CustomFormField";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { useUpdateMasterEmailMutation } from "@/Redux/services/authApi/AuthAPi";

const MasterEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
  currentPassword: z
    .string()
    .min(1, "Current password is required to verify ownership"),
});

type TMasterEmailForm = z.infer<typeof MasterEmailSchema>;

const MasterAccessPage = () => {
  const router = useRouter();
  const { user, handleLogOut } = useAppState();
  const [updateMasterEmail, { isLoading }] = useUpdateMasterEmailMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TMasterEmailForm>({
    resolver: zodResolver(MasterEmailSchema),
    defaultValues: { newEmail: "", currentPassword: "" },
  });

  // SECURITY CHECK: Redirect if not Super Admin
  if (user?.role !== "super_admin") {
    if (typeof window !== "undefined") {
      router.push("/admin_dashboard_private/settings");
    }
    return null;
  }

  const onSubmit = async (values: TMasterEmailForm) => {
    const confirm = await Swal.fire({
      title: "Confirm Identity Change?",
      text: "Changing the Master Email will invalidate your current session. You will be logged out immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      confirmButtonText: "Yes, Update Identity",
    });

    if (!confirm.isConfirmed) return;

    const toastId = toast.loading("Executing administrative override...");

    try {
      const response = await updateMasterEmail(values).unwrap();

      if (response.success) {
        toast.success("Master identity updated. Re-authenticating...", {
          id: toastId,
        });

        // FORCE LOGOUT: Clear local state and redirect
        setTimeout(async () => {
          await handleLogOut();
        }, 1500);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Override failed. Check credentials.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <PageHeader
        title="Master Key Override"
        description="Administrative gateway to update the primary store owner credentials."
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </Button>
      </PageHeader>

      <div className="max-w-2xl mx-auto p-6 lg:p-12">
        <div className="bg-white border-2 border-red-200 rounded-3xl overflow-hidden shadow-2xl shadow-red-100/50">
          {/* Visual Warning Header */}
          <div className="bg-orange-50 p-8 flex items-center gap-6 border-b border-orange-100">
            <div className="h-16 w-16 bg-red-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-200">
              <ShieldAlert className="h-9 w-9" />
            </div>
            <div>
              <h2 className="text-xl font-black text-red-900 uppercase tracking-tighter italic">
                Critical Security Zone
              </h2>
              <p className="text-xs text-red-700 leading-relaxed font-medium">
                You are modifying the core ownership identity. This action is
                irreversible and requires direct database synchronization.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-8 space-y-8"
            >
              <div className="space-y-6">
                {/* Current Identity Snapshot (Read Only) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                      Current Master Email
                    </span>
                    <span className="text-sm font-bold text-slate-600">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <SeparatorText text="Security Challenge" />

                <CustomFormField
                  control={form.control}
                  name="newEmail"
                  label="New Owner Email Address"
                  placeholder="Enter the new primary email"
                />

                <div className="relative group">
                  <CustomFormField
                    control={form.control}
                    name="currentPassword"
                    label="Confirm Current Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 cursor-pointer bottom-2 p-1 text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.15em] shadow-xl shadow-orange-200/50 rounded-2xl transition-all active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authorizing...
                    </>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-5 w-5" />
                      Execute Master Change
                    </>
                  )}
                </Button>

                <p className="text-center text-[10px] text-slate-400 mt-6 flex items-center justify-center gap-2 font-medium">
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                  This action will be logged in the system security audit trail.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

const SeparatorText = ({ text }: { text: string }) => (
  <div className="relative flex items-center py-2">
    <div className="grow border-t border-slate-100"></div>
    <span className="shrink mx-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
      {text}
    </span>
    <div className="grow border-t border-slate-100"></div>
  </div>
);

export default MasterAccessPage;
