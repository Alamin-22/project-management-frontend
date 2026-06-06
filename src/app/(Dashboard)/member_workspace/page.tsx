"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Loader2,
  RefreshCcw,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { differenceInHours } from "date-fns";

import { useAppState } from "@/Provider/StateProvider";
import { useGetMemberGlobalDashboardQuery } from "@/Redux/services/dashboardApi/DashboardApi";
import { TASK_STATUS } from "@/Redux/services/taskApi/Task.interface";

import PageHeader from "@/components/DashboardRelated/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApexOptions } from "apexcharts";
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

const MemberDashboardPage = () => {
  const { user } = useAppState();

  const {
    data: dashData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMemberGlobalDashboardQuery();
  const summary = dashData?.data;

  const getDeadlineStyle = (date: string) => {
    const hours = differenceInHours(new Date(date), new Date());
    if (hours < 0) return "text-rose-600 bg-rose-50 border-rose-200";
    if (hours <= 24) return "text-rose-600 bg-rose-50 border-rose-200";
    if (hours <= 72) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-100 border-slate-200";
  };

  const chartOptions: ApexOptions = {
    chart: { type: "donut", fontFamily: "inherit" },
    labels: ["To-Do", "In Progress", "Completed"],
    colors: ["#fbbf24", "#3b82f6", "#10b981"],
    dataLabels: { enabled: true, style: { fontWeight: 700 } },
    legend: { position: "bottom", fontSize: "12px" },
    stroke: { show: false },
    plotOptions: { pie: { donut: { size: "75%" } } },
  };

  if (isLoading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  const kpis = summary?.kpis;
  const kpiCards = [
    {
      title: "Total Assigned",
      value: kpis?.totalTasks || 0,
      icon: Target,
      color: "text-indigo-500",
    },
    {
      title: "In Progress",
      value: kpis?.inProgressTasks || 0,
      icon: RefreshCcw,
      color: "text-blue-500",
    },
    {
      title: "Completed",
      value: kpis?.completedTasks || 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      title: "Overdue",
      value: kpis?.overdueTasks || 0,
      icon: AlertTriangle,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.profile?.name?.split(" ")[0] || "Team Member"}!`}
      >
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
      </PageHeader>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <Card key={i} className="border-border rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-muted rounded-xl">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                {card.title}
              </p>
              <h2 className="text-2xl font-black font-mono tracking-tight">
                {card.value}
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DONUT CHART */}
        <Card className="col-span-1 border-border rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
              My Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(kpis?.totalTasks || 0) > 0 ? (
              <Chart
                options={chartOptions}
                series={[
                  kpis?.todoTasks || 0,
                  kpis?.inProgressTasks || 0,
                  kpis?.completedTasks || 0,
                ]}
                type="donut"
                height={250}
              />
            ) : (
              <div className="h-62.5 flex items-center justify-center text-xs text-muted-foreground italic">
                No tasks assigned yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* WIDGETS */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UPCOMING DEADLINES */}
          <Card className="border-border rounded-2xl shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> My Upcoming
                Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {summary?.widgets.upcomingTasks &&
              summary.widgets.upcomingTasks.length > 0 ? (
                summary.widgets.upcomingTasks.map((t) => (
                  <Link
                    key={t._id}
                    href={`/member_workspace/projects/${t.project?.slug}/tasks/${t.slug}`}
                    className="group flex flex-col p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all "
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {t.title}
                      </span>
                      <Badge
                        className={`text-[9px] font-bold border ml-2 shrink-0 ${getDeadlineStyle(t.dueDate)}`}
                      >
                        {new Date(t.dueDate).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground font-medium truncate">
                        {t.project?.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${t.status === TASK_STATUS.in_progress ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                  <Inbox className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs font-medium">
                    You have no pending tasks!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ACTIVE PROJECTS */}
          <Card className="border-border rounded-2xl shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" /> My Active
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {summary?.widgets.activeProjects &&
              summary.widgets.activeProjects.length > 0 ? (
                summary.widgets.activeProjects.map((p) => (
                  <Link
                    key={p._id}
                    href={`/member_workspace/projects/${p.slug}`}
                    className="group flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                        ID: {p.projectId}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                  <Inbox className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs font-medium">
                    Not assigned to any projects
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboardPage;
