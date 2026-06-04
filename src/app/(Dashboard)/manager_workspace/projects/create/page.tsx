"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormCard from "@/Utils/FormCard";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import CreateEditProjectForm from "@/components/DashboardRelated/Admin/ProjectRelated/CreateEditProjectForm";

const CreateProjectPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6 space-y-2">
        <ReusableBreadcrumb
          paths={[
            { label: "Projects", href: "/manager_workspace/projects" },
            { label: "Initialize Workspace" },
          ]}
        />
        <div className="flex items-center gap-4">
          <Link href="/manager_workspace/projects">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              New Project Workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              Define overarching goals, format resources, and set the initial
              deadline.
            </p>
          </div>
        </div>
      </div>

      <FormCard title="Project Details">
        <CreateEditProjectForm />
      </FormCard>
    </div>
  );
};

export default CreateProjectPage;
