"use client";

import { Bell, BellOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from "@/Redux/services/notificationApi/NotificationApi";
import { INotification } from "@/Redux/services/notificationApi/Notification.interface";
import { useAppState } from "@/Provider/StateProvider";

const NotificationBell = () => {
  const router = useRouter();
  const { user } = useAppState();

  const { data: response, isLoading } = useGetMyNotificationsQuery();
  const [markAsRead] = useMarkNotificationsAsReadMutation();

  const notifications = response?.data?.notifications || [];
  const unreadCount = response?.data?.unreadCount || 0;

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && unreadCount > 0) {
      // call mark as read api silently
      markAsRead();
    }
  };

  const handleNotificationClick = (notifi: INotification) => {
    // based on role generating link
    const workspacePrefix =
      user?.role === "team_member" ? "/member_workspace" : "/manager_workspace";

    if (notifi.payload?.taskSlug && notifi.payload?.projectSlug) {
      // route directly to the specific task details page
      router.push(
        `${workspacePrefix}/projects/${notifi.payload.projectSlug}/tasks/${notifi.payload.taskSlug}`,
      );
    } else if (notifi.payload?.projectSlug) {
      // route directly to the specific project board
      router.push(`${workspacePrefix}/projects/${notifi.payload.projectSlug}`);
    } else if (notifi.link) {
      router.push(notifi.link);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none text-gray-600 dark:text-gray-300">
          <Bell className="h-6 w-6" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[10px] font-bold items-center justify-center border border-white dark:border-slate-900">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] sm:w-96 p-0 rounded-xl shadow-lg border-gray-100 dark:border-slate-800 z-50 bg-white dark:bg-slate-950 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/80 dark:bg-slate-900/50">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md">
              {unreadCount} New
            </span>
          )}
        </div>

        <ScrollArea className="h-[60vh] sm:h-100">
          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center text-gray-400 h-full">
              <Loader2 className="animate-spin h-6 w-6 mb-3 text-gray-300 dark:text-slate-600" />
              <p className="text-sm font-medium">Loading...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notif) => {
                const isClickable = !!(
                  notif.payload?.projectSlug || notif.link
                );

                return (
                  <DropdownMenuItem
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex flex-col items-start p-4 border-b border-gray-100 dark:border-slate-800/50 last:border-0 rounded-none outline-none transition-colors ${
                      isClickable
                        ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-900"
                        : "cursor-default"
                    } ${!notif.isRead ? "bg-blue-50/40 dark:bg-blue-500/5" : "bg-white dark:bg-slate-950"}`}
                  >
                    <div className="flex w-full justify-between items-start mb-1.5">
                      <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm leading-tight">
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0 shadow-sm" />
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-2 w-full leading-snug">
                      {notif.message}
                    </p>

                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-2.5 font-medium">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </DropdownMenuItem>
                );
              })}
            </div>
          ) : (
            <div className="p-10 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-950 h-full">
              <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center mb-4">
                <BellOff className="h-6 w-6 text-gray-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                No new notifications
              </p>
              <p className="text-xs mt-1 text-gray-500 dark:text-slate-400">
                You&apos;re all caught up!
              </p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
