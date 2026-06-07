import AppSidebar from "@/components/DashboardRelated/LayoutRelated/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MemberNavLinks } from "@/lib/getDashboardNavLinks";
import PrivateRoute from "@/Provider/PrivateRoute";
import { USER_ROLE } from "@/Redux/services/userApi/User.interface";
import MobileHeader from "@/components/DashboardRelated/LayoutRelated/MobileHeader";

export const metadata = {
  title: "Team Workspace | Smart Project",
  robots: { index: false, follow: false },
};

const MemberLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar links={MemberNavLinks} />

        <main className="flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden">
          <MobileHeader />

          <div
            id="member-scroll-container"
            className="flex-1 overflow-y-auto overflow-x-hidden relative bg-muted/20"
          >
            <PrivateRoute allowedRoles={[USER_ROLE.team_member]}>
              {children}
            </PrivateRoute>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MemberLayout;
