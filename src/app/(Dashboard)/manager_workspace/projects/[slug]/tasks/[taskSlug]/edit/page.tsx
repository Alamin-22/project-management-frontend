"use client";

import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import FormCard from "@/Utils/FormCard";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import CreateEditTaskForm from "@/components/DashboardRelated/Admin/TaskRelated/CreateEditTaskForm";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import { useGetSingleTaskQuery } from "@/Redux/services/taskApi/TaskApi";
import LogoLoader from "@/components/Shared/Loader/LogoLoader";

const EditTaskPage = () => {
  const params = useParams();
  const projectSlug = params.slug as string;
  const taskSlug = params.taskSlug as string;

  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(projectSlug, { skip: !projectSlug });
  const project = projectData?.data;

  const { data: taskData, isLoading: isTaskLoading } = useGetSingleTaskQuery(
    taskSlug,
    { skip: !taskSlug },
  );
  const task = taskData?.data;

  if (isProjectLoading || isTaskLoading) {
    return <LogoLoader />;
  }

  if (!project || !task) return null;

  return (
    <div className="px-6">
      <div className="mb-6 space-y-2">
        <ReusableBreadcrumb
          paths={[
            { label: "Projects", href: "/manager_workspace/projects" },
            {
              label: project.name,
              href: `/manager_workspace/projects/${projectSlug}`,
            },
            {
              label: "Task Board",
              href: `/manager_workspace/projects/${projectSlug}/tasks`,
            },
            {
              label: task.taskId,
              href: `/manager_workspace/projects/${projectSlug}/tasks/${taskSlug}`,
            },
            { label: "Edit Task" },
          ]}
        />
        <div className="flex items-center gap-4">
          <Link
            href={`/manager_workspace/projects/${projectSlug}/tasks/${taskSlug}`}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Task</h1>
            <p className="text-sm text-muted-foreground">
              Modify the objective details or reassign team members.
            </p>
          </div>
        </div>
      </div>

      <FormCard title="Task Configuration">
        <CreateEditTaskForm task={task} projectSlug={projectSlug} />
      </FormCard>
    </div>
  );
};

export default EditTaskPage;
