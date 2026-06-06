import { baseApi } from "../../api/baseApi";
import { INotification } from "./Notification.interface";

export const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<
      { data: { notifications: INotification[]; unreadCount: number } },
      void
    >({
      query: () => ({
        url: "/notifications/me",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
    markNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/mark-as-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} = NotificationApi;
