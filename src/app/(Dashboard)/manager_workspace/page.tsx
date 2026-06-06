"use client";

import dynamic from "next/dynamic";
import { RefreshCcw, AlertTriangle, Users, Clock, Inbox } from "lucide-react";
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
    if (hours <= 24) return "text-rose-600 bg-rose-50 border-rose-200"; // Red
    if (hours <= 72) return "text-amber-600 bg-amber-50 border-amber-200"; // Orange/Yellow
    return "text-slate-600 bg-slate-100 border-slate-200"; // Default
  };

  return (
    <div className="p-6 space-y-6">
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

      <ProjectStatsGrid metrics={summary?.kpis} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
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

        {/* Widgets Grid */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* High Priority Tasks */}
          <Card className="border-border rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> High
                Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {summary?.widgets.highPriorityTasks.map((t) => (
                <Link
                  key={t._id}
                  href={`/manager_workspace/projects/${t.project.slug}/tasks/${t.slug}`}
                  className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all"
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="text-sm font-bold text-foreground truncate group-hover:text-primary">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[9px] uppercase tracking-wider bg-rose-50 text-rose-700"
                  >
                    {t.project.name}
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines Widget */}
          <Card className="border-border rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {summary?.widgets.upcomingDeadlines.length ? (
                summary.widgets.upcomingDeadlines.map((p) => (
                  <Link
                    key={p._id}
                    href={`/manager_workspace/projects/${p.slug}`}
                    className="group flex justify-between items-center p-3 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all"
                  >
                    <span className="text-sm font-bold group-hover:text-primary transition-colors">
                      {p.name}
                    </span>
                    <Badge
                      className={`text-[10px] font-bold border ${getDeadlineStyle(p.deadline)}`}
                    >
                      {new Date(p.deadline).toLocaleDateString()}
                    </Badge>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/50">
                  <Inbox className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs font-medium">No upcoming deadlines</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Member Workload Widget */}
          <Card className="md:col-span-2 border-border rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" /> Member Workload
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
              {summary?.widgets.memberWorkloadSummary.map((m) => (
                <div
                  key={m.memberId}
                  className="flex justify-between items-center p-3 rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {m.name.charAt(0)}
                    </div>
                    <p className="text-sm font-bold">{m.name}</p>
                  </div>
                  <div className="text-[10px] font-bold">
                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {m.pendingTasks} Pending
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
