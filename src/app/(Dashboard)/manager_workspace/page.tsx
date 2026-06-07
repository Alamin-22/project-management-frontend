"use client";

import dynamic from "next/dynamic";
import { RefreshCcw, AlertTriangle, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import { ProjectStatsGrid } from "@/components/DashboardRelated/Admin/Analytical/ProjectStatsGrid";
import { useGetGlobalDashboardQuery } from "@/Redux/services/dashboardApi/DashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";
import Link from "next/link";
import { differenceInHours } from "date-fns";
import NotificationBell from "@/components/Shared/Notification/NotificationBell";

//  used dynamic import to avoid clint side error on server building time and reduce js load
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

  const getDeadlineStyle = (date: string) => {
    const hours = differenceInHours(new Date(date), new Date());
    if (hours <= 24) return "text-rose-600 bg-rose-50 border-rose-200";
    if (hours <= 72) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-100 border-slate-200";
  };

  return (
    <>
      <PageHeader title="Global Workspace Insights">
        <div className="flex items-center gap-3">
          <NotificationBell />

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
        </div>
      </PageHeader>

      <div className="p-6 space-y-6">
        <ProjectStatsGrid metrics={summary?.kpis} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* chart */}
          <Card className="col-span-1 border-border rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                Task Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary?.charts.taskStatusDistribution.length ? (
                <Chart
                  options={{
                    chart: { type: "donut", fontFamily: "inherit" },
                    labels: summary.charts.taskStatusDistribution.map(
                      (i) => i._id,
                    ),
                    colors: ["#fbbf24", "#3b82f6", "#10b981"],
                    legend: { position: "bottom" },
                  }}
                  series={summary.charts.taskStatusDistribution.map(
                    (i) => i.count,
                  )}
                  type="donut"
                  height={250}
                />
              ) : (
                <QueryNotFoundMessage message="No task data" />
              )}
            </CardContent>
          </Card>

          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* high priority tasks */}
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> High
                  Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0">
                {summary?.widgets?.highPriorityTasks?.map((task, idx) => (
                  <Link
                    key={idx}
                    href={`/manager_workspace/projects/${task.project.slug}/tasks/${task.slug}`}
                    className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all"
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="text-sm font-bold text-foreground truncate group-hover:text-primary">
                        {task.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[9px] uppercase tracking-wider bg-rose-50 text-rose-700"
                    >
                      {task.project.name}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* upcoming deadlines */}
            <Card className="border-border rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> Upcoming
                  Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0">
                {summary?.widgets.upcomingDeadlines.length ? (
                  summary?.widgets?.upcomingDeadlines?.map((project, idx) => (
                    <Link
                      key={idx}
                      href={`/manager_workspace/projects/${project.slug}`}
                      className="group flex justify-between items-center p-3 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all"
                    >
                      <span className="text-sm font-bold group-hover:text-primary transition-colors">
                        {project.name}
                      </span>
                      <Badge
                        className={`text-[10px] font-bold border ${getDeadlineStyle(project.deadline)}`}
                      >
                        {new Date(project.deadline).toLocaleDateString()}
                      </Badge>
                    </Link>
                  ))
                ) : (
                  <QueryNotFoundMessage message="No upcoming deadlines" />
                )}
              </CardContent>
            </Card>

            {/* member workload */}
            <Card className="md:col-span-2 border-border rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" /> Member Workload
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
                {summary?.widgets?.memberWorkloadSummary?.map(
                  (workLoad, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 rounded-xl border border-border/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {workLoad.name.charAt(0)}
                        </div>
                        <p className="text-sm font-bold">{workLoad.name}</p>
                      </div>
                      <div className="text-[10px] font-bold">
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {workLoad.pendingTasks} Pending
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalDashboardPage;
