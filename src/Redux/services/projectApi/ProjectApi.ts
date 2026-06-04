import baseApi, { IBaseResponse } from "../../api/baseApi";
import { IPaginatedResponse, IQueryParams } from "@/app/types/common";
import { buildQueryString } from "@/Utils/buildQueryString";
import {
  ICreateProjectPayload,
  IProject,
  IUpdateProjectPayload,
  IUpdateTeamPayload,
} from "./Project.interface";

export const PROJECT_TAGS = {
  LIST: { type: "Projects" as const, id: "LIST" },
  ARCHIVED_LIST: { type: "Projects" as const, id: "ARCHIVED_LIST" },
};

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<
      IBaseResponse<IPaginatedResponse<IProject>>,
      IQueryParams | void
    >({
      query: (params) => {
        const queryStr = buildQueryString(
          (params as Record<string, string | string[]>) || {},
        );
        return {
          url: `/projects?${queryStr}`,
          method: "GET",
          isPrivate: true,
        };
      },
      providesTags: [PROJECT_TAGS.LIST],
    }),

    getArchivedProjects: builder.query<
      IBaseResponse<IPaginatedResponse<IProject>>,
      IQueryParams | void
    >({
      query: (params) => {
        const queryStr = buildQueryString(
          (params as Record<string, string | string[]>) || {},
        );
        return {
          url: `/projects/archive/all?${queryStr}`,
          method: "GET",
          isPrivate: true,
        };
      },
      providesTags: [PROJECT_TAGS.ARCHIVED_LIST],
    }),

    // 3. Get Single Project
    getSingleProject: builder.query<IBaseResponse<IProject>, string>({
      query: (slug) => ({
        url: `/projects/${slug}`,
        method: "GET",
        isPrivate: true,
      }),
      providesTags: (_result, _error, slug) => [{ type: "Projects", id: slug }],
    }),

    createProject: builder.mutation<
      IBaseResponse<IProject>,
      ICreateProjectPayload
    >({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
        isPrivate: true,
      }),
      invalidatesTags: [PROJECT_TAGS.LIST],
    }),

    updateProject: builder.mutation<
      IBaseResponse<IProject>,
      { slug: string; data: IUpdateProjectPayload }
    >({
      query: ({ slug, data }) => ({
        url: `/projects/${slug}`,
        method: "PATCH",
        body: data,
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        PROJECT_TAGS.LIST,
        { type: "Projects", id: slug },
      ],
    }),

    updateTeamMembers: builder.mutation<
      IBaseResponse<IProject>,
      { slug: string; data: IUpdateTeamPayload }
    >({
      query: ({ slug, data }) => ({
        url: `/projects/${slug}/team`,
        method: "PATCH",
        body: data,
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        PROJECT_TAGS.LIST,
        { type: "Projects", id: slug },
      ],
    }),

    deleteProject: builder.mutation<IBaseResponse<null>, string>({
      query: (slug) => ({
        url: `/projects/${slug}`,
        method: "DELETE",
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, slug) => [
        PROJECT_TAGS.LIST,
        PROJECT_TAGS.ARCHIVED_LIST,
        { type: "Projects", id: slug },
      ],
    }),

    restoreProject: builder.mutation<IBaseResponse<IProject>, string>({
      query: (slug) => ({
        url: `/projects/${slug}/restore`,
        method: "PATCH",
        isPrivate: true,
      }),
      // Invalidates both lists because a project moved from Archived -> Active
      invalidatesTags: (_result, _error, slug) => [
        PROJECT_TAGS.LIST,
        PROJECT_TAGS.ARCHIVED_LIST,
        { type: "Projects", id: slug },
      ],
    }),

    permanentDeleteProject: builder.mutation<IBaseResponse<null>, string>({
      query: (slug) => ({
        url: `/projects/${slug}/permanent`,
        method: "DELETE",
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, slug) => [
        PROJECT_TAGS.ARCHIVED_LIST,
        { type: "Projects", id: slug },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProjectsQuery,
  useGetArchivedProjectsQuery,
  useGetSingleProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateTeamMembersMutation,
  useDeleteProjectMutation,
  useRestoreProjectMutation,
  usePermanentDeleteProjectMutation,
} = projectApi;
