"use client";

import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IGlobalKPIs } from "@/Redux/services/dashboardApi/Dashboard.interface";

export const ProjectStatsGrid = ({
  metrics,
  isLoading,
}: {
  metrics?: IGlobalKPIs;
  isLoading: boolean;
}) => {
  const cards = [
    {
      title: "Total Projects",
      value: metrics?.totalProjects,
      icon: FolderKanban,
      color: "text-blue-500",
    },
    {
      title: "Total Tasks",
      value: metrics?.totalTasks,
      icon: CheckSquare,
      color: "text-indigo-500",
    },
    {
      title: "Completed",
      value: metrics?.completedTasks,
      icon: FileCheck,
      color: "text-emerald-500",
    },
    {
      title: "Overdue",
      value: metrics?.overdueTasks,
      icon: AlertTriangle,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) =>
        isLoading ? (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ) : (
          <Card key={index} className="border-border rounded-2xl pt-2 ">
            <CardContent className="p-6 ">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-muted rounded-xl">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                {card.title}
              </p>
              <h2 className="text-2xl font-black font-mono tracking-tight">
                {card.value || 0}
              </h2>
            </CardContent>
          </Card>
        ),
      )}
    </div>
  );
};
