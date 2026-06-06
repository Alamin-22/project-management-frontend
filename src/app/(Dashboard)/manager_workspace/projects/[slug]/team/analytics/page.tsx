"use client";

import { useParams } from "next/navigation";
import { Loader2, Users, AlertCircle } from "lucide-react";
import { useGetProjectTeamPerformanceQuery } from "@/Redux/services/dashboardApi/DashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TeamAnalyticsPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: res, isLoading } = useGetProjectTeamPerformanceQuery(slug);
  const teamStats = res?.data || [];

  if (isLoading)
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <Card className="border-border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Team Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamStats.length > 0 ? (
            <div className="divide-y divide-border">
              {teamStats.map((member) => {
                const progress =
                  member.totalTasks > 0
                    ? Math.round(
                        (member.completedTasks / member.totalTasks) * 100,
                      )
                    : 0;

                return (
                  <div
                    key={member.memberId}
                    className="py-6 grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-3 font-bold text-sm text-foreground">
                      {member.name}
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between text-[10px] mb-2 font-bold text-muted-foreground">
                        <span>
                          {member.completedTasks} / {member.totalTasks} Tasks
                          Done
                        </span>
                        <span className="text-primary">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="col-span-3 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          member.pendingTasks > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {member.pendingTasks} Pending
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">
                No member workload data available for this project.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAnalyticsPage;
