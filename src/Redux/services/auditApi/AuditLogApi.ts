import baseApi from "@/Redux/api/baseApi";
import { IAuditLogResponse } from "./AuditLog.interface";

export const auditLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllLogs: builder.query<IAuditLogResponse, Record<string, any>>({
      query: (params) => ({
        url: "/audit-logs",
        method: "GET",
        params: params,
        isPrivate: true,
      }),
      providesTags: ["AuditLog"],
    }),
  }),
});

export const { useGetAllLogsQuery } = auditLogApi;
