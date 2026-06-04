"use client";

import { Users, PackageSearch, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/Utils/formatCurrency";
import {
  IDueOrder,
  IInventoryAlerts,
} from "@/Redux/services/analyticalApi/Analytics.interface";

export const WarehouseStatsCard = ({
  alerts,
  debtors,
  isLoading,
}: {
  alerts?: IInventoryAlerts;
  debtors?: IDueOrder[];
  isLoading: boolean;
}) => {
  return (
    <div className="space-y-6">
      {/* WAREHOUSE HEALTH SUMMARY  */}
      <Card className="border-slate-300/70 rounded-2xl overflow-hidden">
        <CardHeader className=" border-b ">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <PackageSearch className="w-3.5 h-3.5 text-indigo-500" />
            Warehouse Health
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="grid grid-cols-2 gap-4">
            {/* Out of Stock Metric */}
            <div className="space-y-1">
              <p className="text-3xl font-black font-mono text-rose-500 leading-none">
                {isLoading ? ".." : alerts?.outOfStockCount || 0}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-tight">
                  Out of Stock
                </p>
              </div>
            </div>

            {/* Low Stock Metric */}
            <div className="space-y-1 border-l border-slate-100 pl-4">
              <p className="text-3xl font-black font-mono text-amber-500 leading-none">
                {isLoading ? ".." : alerts?.lowStockCount || 0}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-tight">
                  Low Threshold
                </p>
              </div>
            </div>
          </div>

          {/* Total Variants Indicator */}
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Total SKUs Monitored
            </p>
            <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {alerts?.totalVariants || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* TOP DEBTORS SECTION */}
      <Card className="border-slate-200  rounded-2xl overflow-hidden">
        <CardHeader className=" border-b ">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            Top Debtors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-10 text-center text-[10px] font-bold text-slate-300 uppercase animate-pulse">
                Syncing Debtor Ledger...
              </div>
            ) : debtors && debtors.length > 0 ? (
              debtors.map((debtor) => (
                <div
                  key={debtor.orderId}
                  className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                      {debtor.customerName}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 font-bold">
                      #{debtor.orderId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-100">
                      {formatCurrency(debtor.amountDue)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-slate-200 mx-auto" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  No Outstanding Debts
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
