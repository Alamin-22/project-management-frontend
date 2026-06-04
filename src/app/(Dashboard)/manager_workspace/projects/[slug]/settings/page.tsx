"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormCard from "@/Utils/FormCard";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import CreateEditProjectForm from "@/components/DashboardRelated/Admin/ProjectRelated/CreateEditProjectForm";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";

const ProjectSettingsPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading } = useGetSingleProjectQuery(slug, {
    skip: !slug,
  });

  const project = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground font-medium">
        Project workspace could not be found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6 space-y-2">
        <ReusableBreadcrumb
          paths={[
            { label: "Projects", href: "/manager_workspace/projects" },
            {
              label: project.name,
              href: `/manager_workspace/projects/${slug}`,
            },
            { label: "Settings" },
          ]}
        />
        <div className="flex items-center gap-4">
          <Link href={`/manager_workspace/projects/${slug}`}>
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
              Project Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Modify workspace details, update the deadline, or change the
              status.
            </p>
          </div>
        </div>
      </div>

      <FormCard title="Edit Project Details">
        <CreateEditProjectForm project={project} />
      </FormCard>
    </div>
  );
};

export default ProjectSettingsPage;
