"use client";

import { format } from "date-fns";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge";
import { IProject } from "@/Redux/services/projectApi/Project.interface";

interface ProjectCardProps {
  project: IProject;
  baseUrl: string;
}

const ProjectCard = ({ project, baseUrl }: ProjectCardProps) => {
  const isActive = project.status === "Active";
  const isCompleted = project.status === "Completed";

  const deadlineDate = new Date(project.deadline);
  const isOverdue = deadlineDate < new Date() && !isCompleted;

  const sanitizedDescription = DOMPurify.sanitize(project.description);

  return (
    <Link href={`${baseUrl}/${project.slug}`} className="block group">
      <div className="bg-card border border-border/60 hover:border-primary/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1 pr-4">
            <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Created by {project.creatorProfile?.name || "System"}
            </p>
          </div>

          <Badge
            variant="secondary"
            className={`shrink-0 text-[10px] font-bold uppercase tracking-wider ${
              isActive
                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                : isCompleted
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            }`}
          >
            {project.status.replace("_", " ")}
          </Badge>
        </div>

        <div
          className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1 prose prose-sm dark:prose-invert max-w-none *:m-0"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />

        <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4 mt-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Deadline
            </span>
            <span
              className={`text-xs font-medium ${isOverdue ? "text-destructive" : "text-foreground"}`}
            >
              {format(deadlineDate, "MMM dd, yyyy - hh:mm a")}
              {isOverdue && <span className="ml-1 font-bold">(Overdue)</span>}
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
    </Link>
  );
};

export default ProjectCard;
