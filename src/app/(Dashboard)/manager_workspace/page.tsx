"use client";

import dynamic from "next/dynamic";
import { RefreshCcw, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { ProjectStatsGrid } from "@/components/DashboardRelated/Admin/Analytical/ProjectStatsGrid";
import { useGetGlobalDashboardQuery } from "@/Redux/services/dashboardApi/DashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApexOptions } from "apexcharts";

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

  const statusOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: summary?.charts.taskStatusDistribution.map((i) => i._id) || [],
    colors: ["#fbbf24", "#3b82f6", "#10b981"],
    dataLabels: { enabled: true },
    legend: { position: "bottom" },
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
        {/* Status Distribution Chart */}
        <Card className="col-span-1 border-border rounded-2xl ">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary && (
              <Chart
                options={statusOptions}
                series={summary.charts.taskStatusDistribution.map(
                  (i) => i.count,
                )}
                type="donut"
                height={250}
              />
            )}
          </CardContent>
        </Card>

        {/* Priority & Workload Widgets */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* High Priority Tasks Widget */}
          <Card className="border-border rounded-2xl  ">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                High Priority Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              {summary?.widgets.highPriorityTasks.map((t) => (
                <div
                  key={t._id}
                  className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                    {t.project.name}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Member Workload Widget */}
          <Card className="border-border rounded-2xl ">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Member Workload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {summary?.widgets.memberWorkloadSummary.map((m) => (
                <div
                  key={m.memberId}
                  className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-xs font-bold text-foreground">{m.name}</p>
                  <div className="flex gap-3 text-[10px] font-bold">
                    <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                      {m.pendingTasks} Pending
                    </span>
                    <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">
                      {m.completedTasks} Done
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboardPage;
