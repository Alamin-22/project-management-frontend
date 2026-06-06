"use client";

import { useState } from "react";
import { ArchiveX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { useGetAllProjectsQuery } from "@/Redux/services/projectApi/ProjectApi";
import ProjectCard from "@/components/DashboardRelated/Admin/ProjectRelated/ProjectCard";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";

const MemberProjectsPage = () => {
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
    <div className="min-h-full flex flex-col">
      <PageHeader
        title="My Projects"
        description="View and access the active projects you are currently assigned to."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search my projects..."
      >
        <div className="flex items-center gap-3">
          <NotificationBell />

          <Link href="/member_workspace/projects/archived">
            <Button
              variant="outline"
              size="sm"
              className="h-9 font-semibold text-muted-foreground"
            >
              <ArchiveX className="mr-2 h-4 w-4" /> View Archived
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
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  baseUrl="/member_workspace/projects"
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
            <QueryNotFoundMessage message="You are not assigned to any active projects at this time." />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProjectsPage;
