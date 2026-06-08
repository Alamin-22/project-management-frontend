"use client";

import { useState } from "react";
import { format, differenceInDays, startOfDay } from "date-fns";
import {
  Calendar,
  Users,
  MoreVertical,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProject } from "@/Redux/services/projectApi/Project.interface";
import UpdateStatusModal from "./UpdateStatusModal";

interface ProjectCardProps {
  project: IProject;
  baseUrl: string;
}

const ProjectCard = ({ project, baseUrl }: ProjectCardProps) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const isActive = project.status === "Active";
  const isCompleted = project.status === "Completed";

  const deadlineDate = startOfDay(new Date(project.deadline));
  const today = startOfDay(new Date());
  const daysUntilDeadline = differenceInDays(deadlineDate, today);

  // Critical = Due Today or Overdue
  const isCritical = daysUntilDeadline <= 0 && !isCompleted;

  // Strictly Overdue = Deadline has passed
  const isStrictlyOverdue = daysUntilDeadline < 0 && !isCompleted;

  // Warning = 1 to 3 days left
  const isWarning =
    daysUntilDeadline > 0 && daysUntilDeadline <= 3 && !isCompleted;

  const sanitizedDescription = DOMPurify.sanitize(project.description);

  return (
    <>
      <div className="group relative bg-card border border-border/60 hover:border-primary/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden">
        <Link
          href={`${baseUrl}/${project.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View details for ${project.name}`}
        />

        <div className="relative flex justify-between items-start mb-4">
          <div className="space-y-1 pr-2 relative z-0 pointer-events-none">
            <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1 ">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Created by {project.creatorProfile?.name || "System"}
            </p>
          </div>

          <div className="flex items-center gap-1 relative z-20">
            {isStrictlyOverdue && (
              <Badge
                variant="outline"
                className="shrink-0 text-[10px] font-bold uppercase tracking-wider border-destructive text-destructive bg-destructive/10 mr-1 shadow-sm"
              >
                Overdue
              </Badge>
            )}

            <Badge
              variant="secondary"
              className={`shrink-0 text-[10px] font-bold uppercase tracking-wider mr-1 ${
                isActive
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : isCompleted
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}
            >
              {project.status.replace("_", " ")}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 border-border shadow-lg z-50"
              >
                {!project.isDeleted && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsStatusModalOpen(true);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2 text-muted-foreground" />
                    Update Status
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`${baseUrl}/${project.slug}/team`}>
                    <UserPlus className="w-4 h-4 mr-2 text-muted-foreground" />
                    Manage Team
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative z-0 pointer-events-none flex-1">
          <div
            className="text-sm text-muted-foreground line-clamp-2 mb-6 prose prose-sm dark:prose-invert max-w-none *:m-0"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>

        <div className="relative z-0 pointer-events-none pt-4 border-t border-border/50 grid grid-cols-2 gap-4 mt-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Deadline
            </span>
            <span
              className={`text-xs font-medium flex flex-wrap items-center gap-1.5 ${
                isCritical
                  ? "text-destructive"
                  : isWarning
                    ? "text-orange-600 dark:text-orange-500"
                    : "text-foreground"
              }`}
            >
              {format(new Date(project.deadline), "MMM dd, yyyy")}

              {isCritical && (
                <Badge
                  variant="outline"
                  className="text-[9px] px-1 py-0 h-4 border-destructive text-destructive bg-destructive/10 leading-none"
                >
                  {daysUntilDeadline === 0
                    ? "Due Today"
                    : `Past by ${Math.abs(daysUntilDeadline)} days`}
                </Badge>
              )}

              {isWarning && (
                <Badge
                  variant="outline"
                  className="text-[9px] px-1 py-0 h-4 border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10 leading-none"
                >
                  Due in {daysUntilDeadline}{" "}
                  {daysUntilDeadline === 1 ? "Day" : "Days"}
                </Badge>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" /> Team Size
            </span>
            <div className="flex items-center -space-x-2 overflow-hidden mt-0.5">
              {project.teamMembers.length > 0 ? (
                <span className="text-xs font-medium text-foreground mr-3">
                  {project.teamMembers.length} Assigned
                </span>
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Unassigned
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-md w-full border-border bg-card z-100">
          <DialogHeader>
            <DialogTitle className="text-xl">Update Project Status</DialogTitle>
            <DialogDescription>
              Mark this project as Active, On Hold, or Completed.
            </DialogDescription>
          </DialogHeader>

          <UpdateStatusModal
            project={project}
            closeModal={() => setIsStatusModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
