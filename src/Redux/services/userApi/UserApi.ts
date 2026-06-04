/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi, { IBaseResponse } from "@/Redux/api/baseApi";
import {
  IProfile,
  TUserStatus,
  IGetStaffResponse,
  IUpdateStaffArgs,
} from "./User.interface";

const STAFF_TAGS = {
  ME: { type: "Users" as const, id: "get_me" },
  LIST: { type: "Users" as const, id: "LIST" },
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStaff: builder.query<
      IBaseResponse<IGetStaffResponse>,
      Record<string, any>
    >({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
        isPrivate: true,
      }),
      providesTags: (result) =>
        result?.data?.result
          ? [
              ...result.data.result.map(({ id }) => ({
                type: "Users" as const,
                id,
              })),
              STAFF_TAGS.LIST,
            ]
          : [STAFF_TAGS.LIST],
    }),

    createStaff: builder.mutation<IBaseResponse<any>, any>({
      query: (data) => ({
        url: "/users/create-user",
        method: "POST",
        body: data,
        isPrivate: true,
      }),
      invalidatesTags: [STAFF_TAGS.LIST],
    }),

    updateStaffProfile: builder.mutation<
      IBaseResponse<IProfile>,
      IUpdateStaffArgs
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`, // Adjust based on your backend update route
        method: "PATCH",
        body: data,
        isPrivate: true,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Users", id: arg.id },
        STAFF_TAGS.LIST,
        STAFF_TAGS.ME,
      ],
    }),

    changeUserStatus: builder.mutation<
      IBaseResponse<any>,
      { userId: string; status: TUserStatus }
    >({
      query: ({ userId, status }) => ({
        url: `/users/change-status/${userId}`,
        method: "PATCH",
        body: { status },
        isPrivate: true,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Users", id: arg.userId },
        STAFF_TAGS.LIST,
      ],
    }),

    deleteUser: builder.mutation<IBaseResponse<any>, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
        isPrivate: true,
      }),
      invalidatesTags: [STAFF_TAGS.LIST],
    }),
  }),
});

export const {
  useGetAllStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffProfileMutation,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
} = userApi;
