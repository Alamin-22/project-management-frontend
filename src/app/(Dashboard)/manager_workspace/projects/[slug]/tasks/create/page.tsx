"use client";

import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import FormCard from "@/Utils/FormCard";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import CreateEditTaskForm from "@/components/DashboardRelated/Admin/TaskRelated/CreateEditTaskForm";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import LogoLoader from "@/components/Shared/Loader/LogoLoader";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";

const CreateTaskPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading } = useGetSingleProjectQuery(slug, {
    skip: !slug,
  });

  const project = data?.data;

  if (isLoading) {
    return <LogoLoader />;
  }

  if (!project) {
    return (
      <QueryNotFoundMessage message="Project workspace could not be found." />
    );
  }

  return (
    <div className="max-w-5xl mx-auto ">
      <div className="mb-6 space-y-2">
        <ReusableBreadcrumb
          paths={[
            { label: "Projects", href: "/manager_workspace/projects" },
            {
              label: project.name,
              href: `/manager_workspace/projects/${slug}`,
            },
            {
              label: "Task Board",
              href: `/manager_workspace/projects/${slug}/tasks`,
            },
            { label: "Create Task" },
          ]}
        />
        <div className="flex items-center gap-4">
          <Link href={`/manager_workspace/projects/${slug}/tasks`}>
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
              Create New Task
            </h1>
            <p className="text-sm text-muted-foreground">
              Assign a new objective to a team member in the {project.name}{" "}
              workspace.
            </p>
          </div>
        </div>
      </div>

      <FormCard title="Task Details">
        <CreateEditTaskForm projectSlug={slug} />
      </FormCard>
    </div>
  );
};

export default CreateTaskPage;
