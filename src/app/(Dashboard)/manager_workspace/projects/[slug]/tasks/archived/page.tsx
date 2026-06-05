"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, RotateCcw, Trash2, ArchiveX } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import {
  useGetArchivedTasksQuery,
  useRestoreTaskMutation,
  usePermanentDeleteTaskMutation,
} from "@/Redux/services/taskApi/TaskApi";

const ArchivedTasksPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  // 1. Fetch Project Details
  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(slug, { skip: !slug });
  const project = projectData?.data;

  // 2. Fetch Archived Tasks for this specific project
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {archivedTasks.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold">Task ID & Title</th>
                  <th className="px-6 py-4 font-bold">Deleted On</th>
                  <th className="px-6 py-4 font-bold">Priority</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {archivedTasks.map((task) => (
                  <tr
                    key={task.slug}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className="w-fit text-[10px] font-mono"
                        >
                          {task.taskId}
                        </Badge>
                        <span className="font-bold text-foreground">
                          {task.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {task.deletedAt
                        ? format(new Date(task.deletedAt), "MMM dd, yyyy")
                        : "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${
                          task.priority === "High"
                            ? "bg-destructive/10 text-destructive"
                            : task.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                              : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(task.slug, task.title)}
                          disabled={project.isDeleted} // Cannot restore if project is deleted
                          title={
                            project.isDeleted
                              ? "Cannot restore: Project is archived"
                              : "Restore Task"
                          }
                        >
                          <RotateCcw className="h-4 w-4 mr-2" /> Restore
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handlePermanentDelete(task.slug, task.title)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedTasksPage;
