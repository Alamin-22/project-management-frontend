import AdminMobileHeader from "@/components/DashboardRelated/LayoutRelated/MobileHeader";
import AppSidebar from "@/components/DashboardRelated/LayoutRelated/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminNavbarLinks } from "@/lib/getDashboardNavLinks";
import PrivateRoute from "@/Provider/PrivateRoute";
import { USER_ROLE } from "@/Redux/services/userApi/User.interface";

export const metadata = {
  title: "Inventory Management System",
  robots: { index: false, follow: false },
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar links={AdminNavbarLinks} />

        {/* Main Layout Structure */}
        <main className="flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden">
          <AdminMobileHeader />

          {/* Scrollable Content Area */}
          <div
            id="admin-scroll-container"
            className="flex-1 overflow-y-auto overflow-x-hidden relative"
          >
            <PrivateRoute
              allowedRoles={[
                USER_ROLE.admin,
                USER_ROLE.super_admin,
                USER_ROLE.manager,
              ]}
            >
              {children}
            </PrivateRoute>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
