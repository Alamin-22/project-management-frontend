"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { useGetAllProjectsQuery } from "@/Redux/services/projectApi/ProjectApi";
import ProjectCard from "@/components/DashboardRelated/Admin/ProjectRelated/ProjectCard";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";

const ProjectsDashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isFetching } = useGetAllProjectsQuery({
    search: searchQuery || undefined,
    page: currentPage,
    limit,
    sort: "-createdAt",
  });

  const projects = data?.data?.result || [];
  const totalPages = data?.data?.meta?.totalPages || 1;
  const showLoading = isLoading || isFetching;

  return (
    <>
      <PageHeader
        title="Project Workspaces"
        description="Initialize new projects, assign teams, and monitor overarching deadlines."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search projects by name or ID..."
      >
        <div className="flex items-center gap-3">
          <NotificationBell />

          <Link href="/manager_workspace/projects/create">
            <Button size="sm" className="h-9 font-semibold">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="p-6 flex-1">
        {showLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                className="h-48 rounded-xl border border-border/50"
              />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects?.map((project, idx) => (
                <ProjectCard
                  key={idx}
                  project={project}
                  baseUrl="/manager_workspace/projects"
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="mt-12">
            <QueryNotFoundMessage message="No projects found. Create a new project to initialize a workspace." />
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsDashboardPage;
