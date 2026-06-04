/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi, { IBaseResponse } from "@/Redux/api/baseApi";
import {
  IProfile,
  TUserStatus,
  IGetStaffResponse,
  IUpdateProfileArgs,
  IUser,
} from "./User.interface";

const STAFF_TAGS = {
  ME: { type: "Users" as const, id: "get_me" },
  LIST: { type: "Users" as const, id: "LIST" },
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // users
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

    getSingleUser: builder.query<IBaseResponse<IUser>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
        isPrivate: true,
      }),
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    createStaff: builder.mutation<IBaseResponse<any>, any>({
      query: (data) => ({
        url: "/users/create-staff",
        method: "POST",
        body: data,
        isPrivate: true,
      }),
      invalidatesTags: [STAFF_TAGS.LIST],
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

    getSingleProfile: builder.query<IBaseResponse<IProfile>, string>({
      query: (id) => ({
        url: `/profiles/${id}`,
        method: "GET",
        isPrivate: true,
      }),
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    updateProfile: builder.mutation<
      IBaseResponse<IProfile>,
      IUpdateProfileArgs
    >({
      query: ({ id, data }) => ({
        url: `/profiles/${id}`,
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
  }),
});

export const {
  useGetAllStaffQuery,
  useGetSingleUserQuery,
  useCreateStaffMutation,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
  useGetSingleProfileQuery,
  useUpdateProfileMutation,
} = userApi;
