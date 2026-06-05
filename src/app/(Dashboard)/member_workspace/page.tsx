// "use client";

// import { useState } from "react";
// import { CalendarDays, RefreshCcw } from "lucide-react";
// import PageHeader from "@/components/DashboardRelated/PageHeader";
// import { Button } from "@/components/ui/button";
// import {
//   useGetDashboardSummaryQuery,
//   useGetRestockQueueQuery,
// } from "@/Redux/services/analyticalApi/AnalyticsApi";
// import { RestockQueueCard } from "@/components/DashboardRelated/Admin/Analytical/RestockQueueCard";
// import { WarehouseStatsCard } from "@/components/DashboardRelated/Admin/Analytical/WarehouseStatsCard";
// import { AnalyticsStatsGrid } from "@/components/DashboardRelated/Admin/Analytical/AnalyticsStatsGrid";

// const DashboardAnalyticsPage = () => {
//   const currentYear = new Date().getFullYear();

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

//   const {
//     data: summaryRes,
//     isLoading: isSumLoading,
//     isFetching: isSumFetching,
//     refetch,
//   } = useGetDashboardSummaryQuery({ year: selectedYear, month: selectedMonth });

//   const { data: restockRes, isLoading: isRestockLoading } =
//     useGetRestockQueueQuery();

//   const summary = summaryRes?.data;
//   const restockQueue = restockRes?.data || [];

//   return (
//     <>
//       <PageHeader
//         title="Business Intelligence"
//         placeholder="Search insights..."
//       >
//         <div className="flex items-center gap-3">
//           <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2 py-1 gap-1 shadow-sm">
//             <CalendarDays className="w-3.5 h-3.5 text-slate-400 ml-1" />

//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(Number(e.target.value))}
//               className="text-[10px] font-black uppercase outline-none bg-transparent cursor-pointer px-1 py-1 hover:text-indigo-600 transition-colors"
//             >
//               {Array.from({ length: 12 }, (_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {new Date(0, i).toLocaleString("en", { month: "short" })}
//                 </option>
//               ))}
//             </select>

//             <div className="w-px h-3 bg-slate-200 mx-1" />

//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(Number(e.target.value))}
//               className="text-[10px] font-black uppercase outline-none bg-transparent cursor-pointer px-1 py-1 hover:text-indigo-600 transition-colors"
//             >
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => refetch()}
//             className="h-9 w-9 p-0 border-slate-200 rounded-xl"
//             title="Reload Analytics"
//           >
//             <RefreshCcw
//               className={`w-4 h-4 ${isSumFetching ? "animate-spin text-indigo-600" : "text-slate-500"}`}
//             />
//           </Button>
//         </div>
//       </PageHeader>

//       <section className="space-y-6 p-5">
//         <AnalyticsStatsGrid
//           metrics={
//             summary
//               ? {
//                   netRevenue: summary.netRevenue,
//                   grossSales: summary.grossSales,
//                   orderCount: summary.orderCount,
//                 }
//               : undefined
//           }
//           isLoading={isSumLoading}
//         />

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           <div className="lg:col-span-8">
//             <RestockQueueCard
//               items={restockQueue}
//               isLoading={isRestockLoading}
//             />
//           </div>

//           <div className="lg:col-span-4">
//             <WarehouseStatsCard
//               alerts={summary?.inventoryAlerts}
//               debtors={summary?.topDebtors}
//               isLoading={isSumLoading}
//             />
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default DashboardAnalyticsPage;

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-5xl text-red-500">this is the dashabord page</p>
    </div>
  );
};

export default DashboardPage;
