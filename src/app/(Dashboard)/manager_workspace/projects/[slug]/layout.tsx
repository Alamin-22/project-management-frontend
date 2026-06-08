"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Settings,
  ArrowLeft,
  AlertCircle,
  Activity,
} from "lucide-react";
import { differenceInDays, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";
import LogoLoader from "@/components/Shared/Loader/LogoLoader";

const ProjectWorkspaceLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug;

  const { data, isLoading } = useGetSingleProjectQuery(slug as string, {
    skip: !slug,
  });

  const project = data?.data;

  const tabs = [
    {
      name: "Overview",
      href: `/manager_workspace/projects/${slug}`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Task Board",
      href: `/manager_workspace/projects/${slug}/tasks`,
      icon: KanbanSquare,
      exact: false,
    },
    {
      name: "Team",
      href: `/manager_workspace/projects/${slug}/team`,
      icon: Users,
      exact: true,
    },
    {
      name: "Team Analytics",
      href: `/manager_workspace/projects/${slug}/team/analytics`,
      icon: Activity,
      exact: false,
    },
    {
      name: "Settings",
      href: `/manager_workspace/projects/${slug}/settings`,
      icon: Settings,
      exact: false,
    },
  ];

  if (isLoading) {
    return <LogoLoader />;
  }

  if (!project) return null;

  const isActive = project.status === "Active";
  const isCompleted = project.status === "Completed";

  const deadlineDate = startOfDay(new Date(project.deadline));
  const today = startOfDay(new Date());
  const daysUntilDeadline = differenceInDays(deadlineDate, today);

  const isCritical = daysUntilDeadline <= 0 && !isCompleted;
  const isStrictlyOverdue = daysUntilDeadline < 0 && !isCompleted;
  const isWarning =
    daysUntilDeadline > 0 && daysUntilDeadline <= 3 && !isCompleted;

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Link
              href={
                project.isDeleted
                  ? "/manager_workspace/projects/archived"
                  : "/manager_workspace/projects"
              }
              className="mt-1"
            >
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full shrink-0"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge
                  variant="secondary"
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    isActive
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : isCompleted
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }`}
                >
                  {project.status.replace("_", " ")}
                </Badge>

                {isStrictlyOverdue && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold uppercase tracking-wider border-destructive text-destructive bg-destructive/10"
                  >
                    Overdue
                  </Badge>
                )}

                {isCritical && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5 border-destructive text-destructive bg-destructive/10 leading-none"
                  >
                    {daysUntilDeadline === 0
                      ? "Due Today"
                      : `Past by ${Math.abs(daysUntilDeadline)} ${
                          Math.abs(daysUntilDeadline) === 1 ? "Day" : "Days"
                        }`}
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

                {!isCritical && !isWarning && !isCompleted && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5 border-border text-muted-foreground bg-muted/30 leading-none"
                  >
                    On Track
                  </Badge>
                )}

                <span className="text-xs text-muted-foreground font-medium">
                  ID: {project.projectId}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-foreground leading-tight">
                {project.name}
              </h1>
            </div>
          </div>

          <NotificationBell />
        </div>
      </div>

      {project.isDeleted && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-500 text-sm font-semibold">
          <AlertCircle className="h-4 w-4" />
          This workspace is archived and in read-only mode. Go to Settings to
          restore it.
        </div>
      )}

      {/* tabs */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
            {tabs.map((tab, idx) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

              return (
                <Link
                  key={idx}
                  href={tab.href}
                  className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto py-6">{children}</div>
      </div>
    </div>
  );
};

export default ProjectWorkspaceLayout;
