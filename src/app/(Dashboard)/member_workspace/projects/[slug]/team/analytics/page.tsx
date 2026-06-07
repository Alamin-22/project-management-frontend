"use client";

import { useParams } from "next/navigation";
import { Users } from "lucide-react";
import { useGetProjectTeamPerformanceQuery } from "@/Redux/services/dashboardApi/DashboardApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import LogoLoader from "@/components/Shared/Loader/LogoLoader";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";

const TeamAnalyticsPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: res, isLoading } = useGetProjectTeamPerformanceQuery(slug);
  const teamStats = res?.data || [];

  if (isLoading) return <LogoLoader />;

  return (
    <div className="p-6 space-y-6">
      <Card className="border-border rounded-2xl ">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Team Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamStats.length > 0 ? (
            <div className="divide-y divide-border">
              {teamStats?.map((member, idx) => {
                const progress =
                  member.totalTasks > 0
                    ? Math.round(
                        (member.completedTasks / member.totalTasks) * 100,
                      )
                    : 0;

                return (
                  <div
                    key={idx}
                    className="py-6 grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-3">
                      <p className="text-sm font-bold text-foreground">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Total: {member.totalTasks} Tasks
                      </p>
                    </div>

                    {/* progressBar*/}
                    <div className="col-span-5">
                      <div className="flex justify-between text-[10px] mb-2 font-bold text-muted-foreground uppercase">
                        <div className="flex">
                          Progress{" "}
                          <p className="text-[10px] text-muted-foreground font-medium">
                            ( Total: {member.totalTasks} Tasks)
                          </p>
                        </div>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="col-span-4 flex justify-end gap-1.5 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-[9px] border-amber-200 bg-amber-50 text-amber-700"
                      >
                        {member.todoTasks} Todo
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[9px] border-blue-200 bg-blue-50 text-blue-700"
                      >
                        {member.inProgressTasks} In-Prog
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[9px] border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        {member.completedTasks} Done
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <QueryNotFoundMessage message="No member workload data available for this project." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAnalyticsPage;
