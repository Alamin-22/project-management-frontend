import baseApi, { IBaseResponse } from "@/Redux/api/baseApi";
import {
  IGlobalDashboardResponse,
  IProjectOverviewResponse,
  IMemberWorkloadResponse,
} from "./Dashboard.interface";

export const DASHBOARD_TAGS = {
  GLOBAL: { type: "Dashboard" as const, id: "GLOBAL" },
  PROJECT: { type: "Dashboard" as const, id: "PROJECT" },
  MEMBER: { type: "Dashboard" as const, id: "MEMBER" },
};

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalDashboard: builder.query<
      IBaseResponse<IGlobalDashboardResponse>,
      void
    >({
      query: () => ({
        url: `/dashboard/global`,
        method: "GET",
        isPrivate: true,
      }),
      providesTags: [DASHBOARD_TAGS.GLOBAL],
    }),

    getProjectDashboard: builder.query<
      IBaseResponse<IProjectOverviewResponse>,
      string
    >({
      query: (slug) => ({
        url: `/dashboard/project/${slug}`,
        method: "GET",
        isPrivate: true,
      }),
      providesTags: (_res, _err, slug) => [
        { type: DASHBOARD_TAGS.PROJECT.type, id: slug },
      ],
    }),

    getMemberProjectWorkload: builder.query<
      IBaseResponse<IMemberWorkloadResponse>,
      { slug: string; memberId: string }
    >({
      query: ({ slug, memberId }) => ({
        url: `/dashboard/project/${slug}/member/${memberId}`,
        method: "GET",
        isPrivate: true,
      }),
      providesTags: (_res, _err, arg) => [
        { type: DASHBOARD_TAGS.MEMBER.type, id: arg.memberId },
      ],
    }),
  }),
});

export const {
  useGetGlobalDashboardQuery,
  useGetProjectDashboardQuery,
  useGetMemberProjectWorkloadQuery,
} = dashboardApi;
