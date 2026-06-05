import baseApi, { IBaseResponse } from "../../api/baseApi";
import { IPaginatedResponse, IQueryParams } from "@/app/types/common";
import { buildQueryString } from "@/Utils/buildQueryString";
import {
  ICreateTaskPayload,
  ITask,
  IUpdateTaskPayload,
} from "./Task.interface";

export const TASK_TAGS = {
  LIST: { type: "Tasks" as const, id: "LIST" },
  ARCHIVED_LIST: { type: "Tasks" as const, id: "ARCHIVED_LIST" },
  MEMBER_LIST: { type: "Tasks" as const, id: "MEMBER_LIST" },
};

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query<
      IBaseResponse<IPaginatedResponse<ITask>>,
      IQueryParams | void
    >({
      query: (params) => {
        const queryStr = buildQueryString(
          (params as Record<string, string | string[]>) || {},
        );
        return {
          url: `/tasks?${queryStr}`,
          method: "GET",
          isPrivate: true,
        };
      },
      providesTags: [TASK_TAGS.LIST],
    }),

    getArchivedTasks: builder.query<
      IBaseResponse<IPaginatedResponse<ITask>>,
      IQueryParams | void
    >({
      query: (params) => {
        const queryStr = buildQueryString(
          (params as Record<string, string | string[]>) || {},
        );
        return {
          url: `/tasks/archived?${queryStr}`,
          method: "GET",
          isPrivate: true,
        };
      },
      providesTags: [TASK_TAGS.ARCHIVED_LIST],
    }),

    getMemberTasks: builder.query<
      IBaseResponse<IPaginatedResponse<ITask>>,
      { memberId: string; params?: IQueryParams }
    >({
      query: ({ memberId, params }) => {
        const queryStr = buildQueryString(
          (params as Record<string, string | string[]>) || {},
        );
        return {
          url: `/tasks/member/${memberId}?${queryStr}`,
          method: "GET",
          isPrivate: true,
        };
      },
      providesTags: [TASK_TAGS.MEMBER_LIST],
    }),

    getSingleTask: builder.query<IBaseResponse<ITask>, string>({
      query: (slug) => ({
        url: `/tasks/${slug}`,
        method: "GET",
        isPrivate: true,
      }),
      providesTags: (_result, _error, slug) => [{ type: "Tasks", id: slug }],
    }),

    createTask: builder.mutation<IBaseResponse<ITask>, ICreateTaskPayload>({
      query: (body) => ({
        url: "/tasks/create",
        method: "POST",
        body,
        isPrivate: true,
      }),
      invalidatesTags: [TASK_TAGS.LIST, TASK_TAGS.MEMBER_LIST],
    }),

    updateTask: builder.mutation<
      IBaseResponse<ITask>,
      { slug: string; data: IUpdateTaskPayload }
    >({
      query: ({ slug, data }) => ({
        url: `/tasks/${slug}`,
        method: "PATCH",
        body: data,
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        TASK_TAGS.LIST,
        TASK_TAGS.MEMBER_LIST,
        { type: "Tasks", id: slug },
      ],
    }),

    deleteTask: builder.mutation<IBaseResponse<null>, string>({
      query: (slug) => ({
        url: `/tasks/delete/${slug}`,
        method: "DELETE",
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, slug) => [
        TASK_TAGS.LIST,
        TASK_TAGS.ARCHIVED_LIST,
        TASK_TAGS.MEMBER_LIST,
        { type: "Tasks", id: slug },
      ],
    }),

    restoreTask: builder.mutation<IBaseResponse<ITask>, string>({
      query: (slug) => ({
        url: `/tasks/${slug}/restore`,
        method: "PATCH",
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, slug) => [
        TASK_TAGS.LIST,
        TASK_TAGS.ARCHIVED_LIST,
        TASK_TAGS.MEMBER_LIST,
        { type: "Tasks", id: slug },
      ],
    }),

    permanentDeleteTask: builder.mutation<IBaseResponse<null>, string>({
      query: (slug) => ({
        url: `/tasks/permanent-delete/${slug}`,
        method: "DELETE",
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, slug) => [
        TASK_TAGS.ARCHIVED_LIST,
        { type: "Tasks", id: slug },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllTasksQuery,
  useGetArchivedTasksQuery,
  useGetMemberTasksQuery,
  useGetSingleTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useRestoreTaskMutation,
  usePermanentDeleteTaskMutation,
} = taskApi;
