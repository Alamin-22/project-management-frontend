"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, RotateCcw, Trash2, ArchiveX } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { format } from "date-fns";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import {
  useGetArchivedTasksQuery,
  useRestoreTaskMutation,
  usePermanentDeleteTaskMutation,
} from "@/Redux/services/taskApi/TaskApi";
import { stripHtml } from "@/Utils/stripHtml";
import { ITask } from "@/Redux/services/taskApi/Task.interface";

const ArchivedTasksPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(slug, { skip: !slug });
  const project = projectData?.data;

  const { data: archivedData, isLoading: isTasksLoading } =
    useGetArchivedTasksQuery(
      { project: project?._id, limit: 100 },
      { skip: !project?._id },
    );
  const archivedTasks = archivedData?.data?.result || [];

  const [restoreTask] = useRestoreTaskMutation();
  const [permanentDelete] = usePermanentDeleteTaskMutation();

  const handleRestore = async (taskSlug: string, taskTitle: string) => {
    const result = await Swal.fire({
      title: "Restore Task?",
      text: `"${taskTitle}" will be moved back to the Kanban board.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, restore it",
      cancelButtonText: "Cancel",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (result.isConfirmed) {
      try {
        await restoreTask(taskSlug).unwrap();
        Swal.fire({
          title: "Restored!",
          text: "Task has been returned to the board.",
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Swal.fire(
          "Restore Failed",
          error?.data?.message || "Something went wrong.",
          "error",
        );
      }
    }
  };

  const handlePermanentDelete = async (taskSlug: string, taskTitle: string) => {
    const result = await Swal.fire({
      title: "Are you absolutely sure?",
      text: `"${taskTitle}" will be permanently deleted. This action cannot be undone and will erase all task assets!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, permanently delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (result.isConfirmed) {
      try {
        await permanentDelete(taskSlug).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Task has been permanently erased.",
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Swal.fire(
          "Deletion Failed",
          error?.data?.message || "Something went wrong.",
          "error",
        );
      }
    }
  };

  if (isProjectLoading || isTasksLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
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
            { label: "Archived Tasks" },
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
              Archived Tasks
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and restore deleted tasks for this workspace.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {archivedTasks.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center ">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <ArchiveX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              No Archived Tasks
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              There are currently no deleted tasks in this project. Tasks you
              archive from the Kanban board will appear here.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() =>
                router.push(`/manager_workspace/projects/${slug}/tasks`)
              }
            >
              Return to Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {archivedTasks.map((task: ITask) => (
              <div
                key={task.slug}
                className="bg-card p-5 rounded-xl border border-border  opacity-80 hover:opacity-100 transition-opacity flex flex-col"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono text-muted-foreground"
                  >
                    {task.taskId}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground"
                  >
                    Archived
                  </Badge>
                </div>

                {/* Title & Description */}
                <Link
                  href={`/manager_workspace/projects/${slug}/tasks/${task.slug}`}
                >
                  <h4 className="font-bold text-sm text-foreground leading-snug mb-2 hover:text-primary transition-colors cursor-pointer">
                    {task.title}
                  </h4>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
                  {stripHtml(task.description)}
                </p>

                {/* Multi-Avatar Display */}
                {task.assigneeProfiles && task.assigneeProfiles.length > 0 && (
                  <div className="flex items-center -space-x-2 overflow-hidden mb-4">
                    {task.assigneeProfiles.map((profile, i) => (
                      <Image
                        key={i}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-card object-cover bg-muted"
                        src={
                          profile.profileImg?.url ||
                          `https://placehold.co/200x200/png?text=U`
                        }
                        width={50}
                        height={50}
                        alt={profile.name}
                        title={profile.name}
                      />
                    ))}
                  </div>
                )}

                {/* Footer Row: Actions */}
                <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-muted-foreground mb-1">
                      Deleted On
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {task.deletedAt
                        ? format(new Date(task.deletedAt), "MMM dd, yyyy")
                        : "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-semibold"
                      onClick={() => handleRestore(task.slug, task.title)}
                      disabled={project.isDeleted}
                      title={
                        project.isDeleted
                          ? "Cannot restore: Project is archived"
                          : "Restore Task"
                      }
                    >
                      <RotateCcw className="h-3 w-3 mr-1.5" /> Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 px-2.5"
                      onClick={() =>
                        handlePermanentDelete(task.slug, task.title)
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedTasksPage;
