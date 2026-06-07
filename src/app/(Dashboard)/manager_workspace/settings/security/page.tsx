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
    <>
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
      <div className="bg-muted/20 p-10">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-xl mx-auto">
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
};

export default PasswordChangingPage;
