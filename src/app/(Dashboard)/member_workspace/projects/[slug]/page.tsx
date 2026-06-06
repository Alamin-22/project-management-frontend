"use client";

import { useParams } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { format, differenceInDays, startOfDay } from "date-fns";
import { CalendarDays, Clock, FileText, Activity, Users } from "lucide-react";

import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import { Badge } from "@/components/ui/badge";

const MemberProjectOverviewPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data } = useGetSingleProjectQuery(slug, { skip: !slug });
  const project = data?.data;

  if (!project) return null;

  const sanitizedDescription = DOMPurify.sanitize(project.description);

  const isActive = project.status === "Active";
  const isCompleted = project.status === "Completed";

  const deadlineDate = startOfDay(new Date(project.deadline));
  const today = startOfDay(new Date());
  const daysUntilDeadline = differenceInDays(deadlineDate, today);

  const isCritical = daysUntilDeadline <= 0 && !isCompleted;
  const isWarning =
    daysUntilDeadline > 0 && daysUntilDeadline <= 3 && !isCompleted;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-6">
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Project Brief & Resources
            </h2>
          </div>

          <div
            className="prose prose-sm dark:prose-invert max-w-none 
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:border prose-img:border-border"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>
      </div>

      {/* Right Column: Key Details (Read Only) */}
      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Project Details
          </h3>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Created On
                </p>
                <p className="text-sm font-bold text-foreground">
                  {format(new Date(project.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  isCritical
                    ? "bg-destructive/10 text-destructive"
                    : isWarning
                      ? "bg-orange-500/10 text-orange-600 dark:text-orange-500"
                      : "bg-amber-500/10 text-amber-500"
                }`}
              >
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Target Deadline
                </p>
                <div className="flex flex-col items-start gap-1.5 xl:flex-row xl:items-center">
                  <p
                    className={`text-sm font-bold ${
                      isCritical
                        ? "text-destructive"
                        : isWarning
                          ? "text-orange-600 dark:text-orange-500"
                          : "text-foreground"
                    }`}
                  >
                    {format(
                      new Date(project.deadline),
                      "MMMM dd, yyyy - hh:mm a",
                    )}
                  </p>

                  {/* Urgency Badges */}
                  {isCritical && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 border-destructive text-destructive bg-destructive/10 leading-none"
                    >
                      {daysUntilDeadline === 0 ? "Due Today" : "Overdue"}
                    </Badge>
                  )}

                  {isWarning && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-500/10 leading-none"
                    >
                      Due in {daysUntilDeadline}{" "}
                      {daysUntilDeadline === 1 ? "Day" : "Days"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-0.5">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Assigned Team
                </p>
                <p className="text-sm font-bold text-foreground">
                  {project.teamMembers.length}{" "}
                  {project.teamMembers.length === 1 ? "Member" : "Members"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 mt-0.5">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-xs text-muted-foreground font-medium">
                    Current Status
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0 h-4 leading-none ${
                      isActive
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : isCompleted
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-amber-500/10 text-orange-500 border-orange-500/20"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProjectOverviewPage;
