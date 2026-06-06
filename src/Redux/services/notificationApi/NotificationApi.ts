import baseApi from "@/Redux/api/baseApi";
import { INotification } from "./Notification.interface";

export const NOTIFICATIONS_TAGS = {
  LIST: "Notifications",
} as const;

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
      providesTags: [NOTIFICATIONS_TAGS.LIST],
    }),
    markNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/mark-as-read",
        method: "PATCH",
      }),
      invalidatesTags: [NOTIFICATIONS_TAGS.LIST],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} = NotificationApi;
