import { PropsWithChildren } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {children}
    </div>
  );
};

export default DashboardLayout;
