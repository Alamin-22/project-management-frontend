import baseApi, { IBaseResponse } from "../../api/baseApi";
import { IPaginatedResponse, IQueryParams } from "@/app/types/common";
import { buildQueryString } from "@/Utils/buildQueryString";
import {
  ICreateProjectPayload,
  IProject,
  IUpdateProjectPayload,
  IUpdateTeamPayload,
} from "./Project.interface";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<
      IBaseResponse<IPaginatedResponse<IProject>>,
      IQueryParams | void
    >({
      query: (params) => {
        // Build the query string and safely cast params
        const queryStr = buildQueryString(
          (params as Record<string, string | string[]>) || {},
        );
        return {
          url: `/projects?${queryStr}`,
          method: "GET",
          isPrivate: true,
        };
      },
      providesTags: ["Projects"],
    }),

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
      invalidatesTags: ["Projects"],
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
        "Projects",
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
        "Projects",
        { type: "Projects", id: slug },
      ],
    }),

    deleteProject: builder.mutation<IBaseResponse<null>, string>({
      query: (slug) => ({
        url: `/projects/${slug}`,
        method: "DELETE",
        isPrivate: true,
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProjectsQuery,
  useGetSingleProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateTeamMembersMutation,
  useDeleteProjectMutation,
} = projectApi;
