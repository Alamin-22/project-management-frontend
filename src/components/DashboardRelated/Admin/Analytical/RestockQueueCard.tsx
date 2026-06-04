"use client";

import Link from "next/link";
import { AlertTriangle, ExternalLink, Settings2 } from "lucide-react";
import { IRestockItem } from "@/Redux/services/analyticalApi/Analytics.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const RestockQueueCard = ({
  items,
  isLoading,
}: {
  items: IRestockItem[];
  isLoading: boolean;
}) => {
  return (
    <Card className="border-slate-300/70 rounded-2xl overflow-hidden">
      <CardHeader className=" border-b  flex flex-row items-center justify-between">
        <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Critical Restock Queue
        </CardTitle>
        <span className="text-[10px] font-bold text-slate-400 italic">
          Priority sorted by stock level
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-4 flex justify-between">
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.sku}
                className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Priority Indicator */}
                  <div
                    className={`w-1.5 h-8 rounded-full ${
                      item.priority === "High"
                        ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                        : item.priority === "Medium"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                    }`}
                  />

                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                      {item.productTitle}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {item.variantName} •{" "}
                        <span className="font-mono">{item.sku}</span>
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[8px] h-4 px-1 text-slate-400 border-slate-200"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Stock Status Display */}
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
                      Inventory Level
                    </p>
                    <p
                      className={`text-xs font-black flex items-center justify-end gap-1 ${
                        item.currentStock === 0
                          ? "text-rose-600"
                          : "text-amber-600"
                      }`}
                    >
                      <span className="text-sm">{item.currentStock}</span>
                      <span className="text-slate-300 font-normal">
                        / {item.threshold}
                      </span>
                    </p>
                  </div>

                  {/* Action Link to Edit Product */}
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${
                        item.priority === "High"
                          ? "bg-rose-50 text-rose-600"
                          : item.priority === "Medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600"
                      } border-none font-black text-[9px] uppercase h-6 px-2`}
                    >
                      {item.priority}
                    </Badge>

                    {/* DYNAMIC EDIT LINK */}
                    <Link
                      href={`/admin_dashboard_private/products/edit/${item.productId}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                        title="Update Inventory"
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-6 h-6" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Inventory Fully Optimized
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
