"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit,
  MessageSquare,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import {
  useGetSingleTaskQuery,
  useDeleteTaskMutation,
} from "@/Redux/services/taskApi/TaskApi";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UpdateTaskStatusModal from "@/components/DashboardRelated/Admin/TaskRelated/UpdateTaskStatusModal";

const TaskDetailsPage = () => {
  const params = useParams();
  const projectSlug = params.slug as string;
  const taskSlug = params.taskSlug as string;
  const router = useRouter();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { data: projectData } = useGetSingleProjectQuery(projectSlug, {
    skip: !projectSlug,
  });
  const project = projectData?.data;

  const { data: taskData, isLoading } = useGetSingleTaskQuery(taskSlug, {
    skip: !taskSlug,
  });
  const task = taskData?.data;

  const [deleteTask] = useDeleteTaskMutation();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Archive Task?",
      text: "This will remove the task from the board. You can restore it from settings later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, archive it",
      cancelButtonText: "Cancel",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(taskSlug).unwrap();
        Swal.fire({
          title: "Archived!",
          text: "The task has been archived.",
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });
        router.push(`/manager_workspace/projects/${projectSlug}/tasks`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Swal.fire(
          "Error",
          error?.data?.message || "Failed to archive task",
          "error",
        );
      }
    }
  };

  if (isLoading || !task || !project) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const sanitizedDescription = DOMPurify.sanitize(task.description);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header & Breadcrumbs */}
      <div className="space-y-2">
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
            { label: task.taskId },
          ]}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/manager_workspace/projects/${projectSlug}/tasks`}>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge variant="outline" className="text-[10px] font-mono">
                  {task.taskId}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-[10px] uppercase tracking-wider ${
                    task.status === "Todo"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                      : task.status === "In Progress"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {task.status}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {task.title}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          {!project.isDeleted && (
            <div className="flex items-center gap-2">
              {/* NEW Update Status Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStatusModalOpen(true)}
              >
                <Activity className="h-4 w-4 mr-2" /> Update Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(
                    `/manager_workspace/projects/${projectSlug}/tasks/${taskSlug}/edit`,
                  )
                }
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Task
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" /> Archive
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Comments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 ">
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
              Description
            </h2>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </div>

          {/* Comments Section Placeholder */}
          <div className="bg-card rounded-xl border border-border p-6 ">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Discussion</h2>
            </div>
            <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
              <p className="text-sm font-medium">
                Comments module coming next!
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Meta Info */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 ">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Task Details
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-0.5">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    Assigned To
                  </p>
                  <div className="space-y-2">
                    {task.assigneeProfiles &&
                    task.assigneeProfiles.length > 0 ? (
                      task.assigneeProfiles.map((profile, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-md border border-border/50"
                        >
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
                            title={`${profile.name} ${profile.designation ? `(${profile.designation})` : ""}`}
                          />
                          <div>
                            <p className="text-xs font-bold text-foreground leading-none">
                              {profile.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {profile.designation || "Team Member"}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground">
                        Unassigned
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 mt-0.5">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    Priority
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {format(new Date(task.dueDate), "MMM dd, yyyy - hh:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-md w-full border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl">Update Task Status</DialogTitle>
            <DialogDescription>
              Move this task to a new stage on the Kanban board.
            </DialogDescription>
          </DialogHeader>

          {task && (
            <UpdateTaskStatusModal
              task={task}
              closeModal={() => setIsStatusModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskDetailsPage;
