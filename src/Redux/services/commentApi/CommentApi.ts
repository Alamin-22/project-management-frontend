import baseApi, { IBaseResponse } from "@/Redux/api/baseApi";
import { IComment } from "./Comment.interface";

export const COMMENT_TAGS = {
  LIST: "TaskComments",
} as const;

const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskComments: builder.query<IBaseResponse<IComment[]>, string>({
      query: (taskSlug) => ({
        url: `/comments/task/${taskSlug}`,
        method: "GET",
        isPrivate: true,
      }),

      providesTags: (_result, _error, arg) => [
        { type: COMMENT_TAGS.LIST, id: arg },
      ],
    }),

    addComment: builder.mutation<
      IBaseResponse<IComment>,
      { taskSlug: string; content: string; parentComment?: string }
    >({
      query: ({ taskSlug, content, parentComment }) => ({
        url: `/comments/task/${taskSlug}`,
        method: "POST",
        body: { content, parentComment },
        isPrivate: true,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: COMMENT_TAGS.LIST, id: arg.taskSlug },
      ],
    }),
  }),
});

export const { useGetTaskCommentsQuery, useAddCommentMutation } = commentApi;
