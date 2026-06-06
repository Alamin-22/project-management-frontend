import { useSocketNotifications } from "@/components/Shared/Notification/useSocketNotifications";
import { PropsWithChildren } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  useSocketNotifications();
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {children}
    </div>
  );
};

export default DashboardLayout;
