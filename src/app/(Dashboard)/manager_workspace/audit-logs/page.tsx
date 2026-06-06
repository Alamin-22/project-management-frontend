"use client";

import { useState } from "react";
import { ShieldCheck, Activity } from "lucide-react";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import Pagination from "@/components/Shared/Pagination/Pagination";
import AuditLogTable from "@/components/DashboardRelated/Admin/AuditLogs/AuditLogTable";
import { useAppState } from "@/Provider/StateProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePageTitle } from "@/hooks/usePageTitle";
import useDebounce from "@/Utils/useDebounce";
import { useGetAllLogsQuery } from "@/Redux/services/auditApi/AuditLogApi";
import { IQueryParams } from "@/app/types/common";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";

const AuditLogsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const { searchQuery: globalSearchQuery } = useAppState();
  const isMobile = useIsMobile();
  const limit = 20;

  const debouncedSearch = useDebounce(localSearchQuery, 500);

  const activeSearchQuery = isMobile ? globalSearchQuery : debouncedSearch;

  const [prevSearch, setPrevSearch] = useState(activeSearchQuery);

  if (activeSearchQuery !== prevSearch) {
    setPrevSearch(activeSearchQuery);
    setCurrentPage(1);
  }

  const handleLocalSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    setCurrentPage(1);
  };

  const queryParams: IQueryParams = {
    page: currentPage,
    limit: limit,
    sort: "-createdAt",
    ...(activeSearchQuery && { search: activeSearchQuery }),
  };

  const {
    data: auditData,
    isLoading,
    isFetching,
  } = useGetAllLogsQuery(queryParams);

  usePageTitle("System Audit Logs | Manager Workspace");

  const logs = auditData?.data?.result;
  const meta = auditData?.data?.meta;
  const startIndex = (currentPage - 1) * limit;

  return (
    <>
      <PageHeader
        title="Security Audit Logs"
        searchQuery={localSearchQuery}
        onSearchChange={handleLocalSearchChange}
        placeholder="Search operator email, resource, or action..."
      >
        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl ">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </div>
            <div className="flex flex-col  sm:flex">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 leading-none">
                Security Protocol
              </span>
              <span className="text-xs font-bold text-indigo-700">
                Live Monitoring Active
              </span>
            </div>
            <ShieldCheck className="h-4 w-4 text-indigo-500 ml-1" />
          </div>
        </div>
      </PageHeader>
      <section>
        <div className="bg-card overflow-hidden">
          <AuditLogTable
            logs={logs}
            isLoading={isLoading}
            startIndex={startIndex}
          />
        </div>

        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={meta?.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        )}

        {isFetching && !isLoading && (
          <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-background/90 backdrop-blur px-4 py-2 rounded-full border border-border  z-50">
            <Activity className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Refreshing Data...
            </span>
          </div>
        )}
      </section>
    </>
  );
};

export default AuditLogsPage;
