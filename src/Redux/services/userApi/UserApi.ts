/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi, { IBaseResponse } from "@/Redux/api/baseApi";
import {
  IAdminProfile,
  TUserStatus,
  IGetStaffResponse,
  TPermissionManifestResponse,
  IUpdateStaffArgs,
} from "./User.interface";

const STAFF_TAGS = {
  ME: { type: "Users" as const, id: "get_me" },
  LIST: { type: "Users" as const, id: "LIST" },
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 2. STAFF MANAGEMENT (Admin Routes)
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

    // 3. CREATE STAFF
    createStaff: builder.mutation<IBaseResponse<IAdminProfile>, any>({
      query: (data) => ({
        url: "/users/create-staff",
        method: "POST",
        body: data,
        isPrivate: true,
      }),
      invalidatesTags: [STAFF_TAGS.LIST],
    }),

    // 4. UPDATE STAFF PROFILE
    updateStaffProfile: builder.mutation<
      IBaseResponse<IAdminProfile>,
      IUpdateStaffArgs // Using our new strict type instead of any
    >({
      query: ({ id, data }) => ({
        url: `/admins/${id}`,
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

    // 5. CHANGE AUTH STATUS
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

    // 6. DELETE USER
    deleteUser: builder.mutation<IBaseResponse<any>, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
        isPrivate: true,
      }),
      invalidatesTags: [STAFF_TAGS.LIST],
    }),

    // 7. PERMISSION METADATA (Admin Routes)
    getPermissionMeta: builder.query<TPermissionManifestResponse, void>({
      query: () => ({
        url: "/admins/meta/permissions",
        method: "GET",
        isPrivate: true,
      }),
    }),
  }),
});

export const {
  useGetAllStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffProfileMutation,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
  useGetPermissionMetaQuery,
} = userApi;
