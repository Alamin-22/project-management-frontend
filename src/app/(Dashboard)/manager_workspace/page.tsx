"use client";

import dynamic from "next/dynamic";
import { RefreshCcw, AlertTriangle, Users, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { ProjectStatsGrid } from "@/components/DashboardRelated/Admin/Analytical/ProjectStatsGrid";
import { useGetGlobalDashboardQuery } from "@/Redux/services/dashboardApi/DashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApexOptions } from "apexcharts";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-62.5 w-full animate-pulse bg-muted rounded-xl" />
    ),
  },
);

const GlobalDashboardPage = () => {
  const {
    data: res,
    isLoading,
    isFetching,
    refetch,
  } = useGetGlobalDashboardQuery();
  const summary = res?.data;

  // Safe mapping for charts
  const statusLabels =
    summary?.charts.taskStatusDistribution.map((i) => i._id) || [];
  const statusSeries =
    summary?.charts.taskStatusDistribution.map((i) => i.count) || [];

  const statusOptions: ApexOptions = {
    chart: { type: "donut", fontFamily: "inherit" },
    labels: statusLabels,
    colors: ["#fbbf24", "#3b82f6", "#10b981"],
    dataLabels: { enabled: true, style: { fontWeight: 700 } },
    legend: { position: "bottom", fontSize: "12px" },
    stroke: { show: false },
    plotOptions: { pie: { donut: { size: "75%" } } },
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Global Workspace Insights">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="h-9 w-9 p-0"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>
      </PageHeader>

      <ProjectStatsGrid metrics={summary?.kpis} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 border-border rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusSeries.length > 0 ? (
              <Chart
                options={statusOptions}
                series={statusSeries}
                type="donut"
                height={250}
              />
            ) : (
              <QueryNotFoundMessage message="No task data available" />
            )}
          </CardContent>
        </Card>

        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {summary?.widgets.highPriorityTasks.length ? (
                summary.widgets.highPriorityTasks.map((t) => (
                  <div
                    key={t._id}
                    className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all"
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="text-sm font-bold text-foreground truncate">
                        {t.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Due: {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[9px] uppercase tracking-wider shrink-0 bg-rose-100 text-rose-700 hover:bg-rose-100"
                    >
                      {t.project.name}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/50">
                  <Inbox className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No high priority tasks</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Member Workload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {summary?.widgets.memberWorkloadSummary.length ? (
                summary.widgets.memberWorkloadSummary.map((m) => (
                  <div
                    key={m.memberId}
                    className="flex justify-between items-center p-3 rounded-xl hover:bg-muted/30 transition-all border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {m.name.charAt(0)}
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {m.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {m.pendingTasks} Pending
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {m.completedTasks} Done
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/50">
                  <Users className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No workload data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboardPage;
