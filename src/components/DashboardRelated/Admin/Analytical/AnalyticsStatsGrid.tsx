"use client";

import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/Utils/formatCurrency";
import { TComparisonMetric } from "@/Redux/services/analyticalApi/Analytics.interface";

interface AnalyticsStatsGridProps {
  metrics?: {
    netRevenue: TComparisonMetric;
    grossSales: TComparisonMetric;
    orderCount: TComparisonMetric;
  };
  isLoading: boolean;
}

export const AnalyticsStatsGrid = ({
  metrics,
  isLoading,
}: AnalyticsStatsGridProps) => {
  const cards = [
    {
      title: "Net Revenue",
      value: metrics?.netRevenue.current,
      change: metrics?.netRevenue.change,
      icon: DollarSign,
      isCurrency: true,
    },
    {
      title: "Gross Sales",
      value: metrics?.grossSales.current,
      change: metrics?.grossSales.change,
      icon: TrendingUp,
      isCurrency: true,
    },
    {
      title: "Order Volume",
      value: metrics?.orderCount.current,
      change: metrics?.orderCount.change,
      icon: ShoppingBag,
      isCurrency: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const isPositive = (card.change || 0) >= 0;
        if (isLoading)
          return <Skeleton key={index} className="h-32 w-full rounded-2xl" />;

        return (
          <Card
            key={index}
            className="border-slate-300/70  rounded-2xl   transition-all"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  <card.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${
                    isPositive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(card.change || 0)}%
                </div>
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                {card.title}
              </p>
              <h2 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {card.isCurrency
                  ? formatCurrency(card.value || 0)
                  : card.value || 0}
              </h2>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
