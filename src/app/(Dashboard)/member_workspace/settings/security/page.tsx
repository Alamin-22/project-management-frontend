"use client";

import ChangePasswordForm from "@/components/DashboardRelated/ChangePasswordForm";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PasswordChangingPage = () => {
  usePageTitle("Security & Access");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="p-6">
        <PageHeader
          title="Security & Access"
          description="Update your authentication credentials and manage account protection."
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </PageHeader>
      </div>

      <div className="px-6 mt-4">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-xl mx-auto">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default PasswordChangingPage;
