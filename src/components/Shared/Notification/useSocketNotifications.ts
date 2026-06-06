import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/Redux/store";
import { NotificationApi } from "@/Redux/services/notificationApi/NotificationApi";
import { INotification } from "@/Redux/services/notificationApi/Notification.interface";
import { useAppState } from "@/Provider/StateProvider";
import toast from "react-hot-toast";

export const useSocketNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: authenticatedUser } = useAppState();

  const userId =
    authenticatedUser?._id?.toString() || authenticatedUser?.id?.toString();
  const userRole = authenticatedUser?.role?.toString();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId || !userRole) return;

    // Strip /api/v1 to get the base server URL for Socket.io
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    if (!socketRef.current) {
      // Connect to the global namespace
      socketRef.current = io(baseUrl, {
        path: "/socket.io/",
        withCredentials: true,
        transports: ["websocket"],
        reconnection: true,
      });
    }

    const socketInstance = socketRef.current;

    const onConnect = () => {
      // Tell the backend who we are so it puts us in the right room
      socketInstance.emit("authenticate", { userId, role: userRole });
    };

    const onNewNotification = (newNotif: INotification) => {
      // 1. Show a toast popup on the screen
      toast(newNotif.title + "\n" + newNotif.message, {
        icon: "🔔",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      // 2. Silently update the Redux cache so the Bell icon increments instantly
      dispatch(
        NotificationApi.util.updateQueryData(
          "getMyNotifications",
          undefined,
          (draft) => {
            if (
              draft &&
              draft.data &&
              Array.isArray(draft.data.notifications)
            ) {
              draft.data.notifications.unshift(newNotif);
              draft.data.unreadCount = (draft.data.unreadCount || 0) + 1;
            }
          },
        ),
      );
    };

    // Attach listeners
    socketInstance.on("connect", onConnect);
    socketInstance.on("new_notification", onNewNotification);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("new_notification", onNewNotification);
    };
  }, [userId, userRole, dispatch]);

  // Handle hard logout cleanup
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);
};
