"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { useGetArchivedProjectsQuery } from "@/Redux/services/projectApi/ProjectApi";
import ProjectCard from "@/components/DashboardRelated/Admin/ProjectRelated/ProjectCard";
import { IProject } from "@/Redux/services/projectApi/Project.interface";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";

const ArchivedProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isFetching } = useGetArchivedProjectsQuery({
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
        title="Archived Projects"
        description="View past projects and reactivate them if necessary."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search archives by name..."
      >
        <div className="flex items-center gap-3">
          <NotificationBell />

          <Link href="/manager_workspace/projects">
            <Button variant="outline" size="sm" className="h-9 font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Active
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
                className="h-48 rounded-xl border border-border/50 opacity-50"
              />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
              {projects.map((project: IProject, idx) => (
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
            <QueryNotFoundMessage message="No archived projects found in the system." />
          </div>
        )}
      </div>
    </>
  );
};

export default ArchivedProjectsPage;
