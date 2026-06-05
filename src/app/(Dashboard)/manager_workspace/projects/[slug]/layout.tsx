"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Settings,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";

const ProjectWorkspaceLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading } = useGetSingleProjectQuery(slug, {
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
      href: `/manager_workspace/projects/${slug}/board`,
      icon: KanbanSquare,
      exact: false,
    },
    {
      name: "Team",
      href: `/manager_workspace/projects/${slug}/team`,
      icon: Users,
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
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="flex flex-col min-h-full">
      {/* Project Header Banner */}
      <div className="bg-card border-b border-border px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-start gap-4">
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
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                {project.status.replace("_", " ")}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                ID: {project.projectId}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              {project.name}
            </h1>
          </div>
        </div>
      </div>

      {/* READ-ONLY WARNING BANNER */}
      {project.isDeleted && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-500 text-sm font-semibold">
          <AlertCircle className="h-4 w-4" />
          This workspace is archived and in read-only mode. Go to Settings to
          restore it.
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.name}
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

      {/* Tab Content Area */}
      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto py-6">{children}</div>
      </div>
    </div>
  );
};

export default ProjectWorkspaceLayout;
