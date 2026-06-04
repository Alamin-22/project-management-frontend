import baseApi from "@/Redux/api/baseApi";
import {
  TDashboardSummaryResponse,
  TRestockQueueResponse,
} from "./Analytics.interface";

const analyticsAPI = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 1. GET DASHBOARD SUMMARY (Stats, Metrics, Debtors)
    getDashboardSummary: builder.query<
      TDashboardSummaryResponse,
      { year?: number; month?: number } | void
    >({
      query: (params) => ({
        url: "/analytics/dashboard-summary",
        method: "GET",
        params: params ? params : undefined,
        isPrivate: true,
      }),

      providesTags: ["Transaction", "Order", "Product"],
    }),

    // 2. GET RESTOCK QUEUE (Inventory Priority)
    getRestockQueue: builder.query<TRestockQueueResponse, void>({
      query: () => ({
        url: "/analytics/restock-queue",
        method: "GET",
        isPrivate: true,
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetDashboardSummaryQuery, useGetRestockQueueQuery } =
  analyticsAPI;
