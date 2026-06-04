"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import IcfyIcon from "@/components/Shared/IcfyIcon";
import { TNavLink } from "@/lib/getDashboardNavLinks";
import { useAppState } from "@/Provider/StateProvider";
import { Fragment, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const AppSidebar = ({ links }: { links: TNavLink[] }) => {
  const pathName = usePathname();
  const {
    user,
    loading,
    isAuthError,
    handleLogOut,
    searchQuery,
    setSearchQuery,
    isManager,
  } = useAppState();
  const { setOpenMobile } = useSidebar();
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  const baseRoute = isManager ? "/manager_workspace" : "/member_workspace";

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [pathName]);

  const showSkeletons = loading || !user || isAuthError;

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border  bg-white!"
    >
      <SidebarTrigger className="absolute right-1 top-4 z-50 hidden md:flex h-6 w-6 rounded-full border bg-white shadow-sm hover:bg-slate-100" />

      <SidebarHeader className="p-4 border-b border-sidebar-border ">
        <div className="hidden md:flex flex-row items-center justify-center">
          <Link
            href={baseRoute}
            className="flex items-center gap-2 active:scale-95 transition-all"
          >
            <div className="overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
              <Image
                src="/Assets/logo/logo.png"
                alt="Logo"
                width={140}
                height={40}
                priority
              />
            </div>

            <div className="hidden group-data-[collapsible=icon]:block">
              <IcfyIcon
                icon="solar:database-bold-duotone"
                className="text-2xl text-primary"
              />
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium text-sidebar-foreground">
              Menu
            </h1>
            <button
              onClick={() => setOpenMobile(false)}
              className="p-1 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-9 bg-background border-sidebar-border"
              disabled={showSkeletons}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {showSkeletons
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="px-4 py-2">
                      <Skeleton className="h-10 w-full rounded-md opacity-50" />
                    </div>
                  ))
                : links.map((item, index) => {
                    const isActive = !!item.href && pathName === item.href;
                    return (
                      <Fragment key={index}>
                        {item.heading ? (
                          <SidebarGroupLabel className="mb-1 mt-4 px-4 font-bold uppercase text-[10px] tracking-widest text-muted-foreground group-data-[collapsible=icon]:hidden">
                            {item.heading}
                          </SidebarGroupLabel>
                        ) : (
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={item.label}
                              onClick={() => setOpenMobile(false)}
                              className="h-11 px-4 my-0.5 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                            >
                              <Link
                                href={item.href || "#"}
                                className="flex items-center gap-3"
                                ref={isActive ? activeItemRef : null}
                              >
                                <IcfyIcon
                                  icon={
                                    item.icon || "solar:document-bold-duotone"
                                  }
                                  className="text-xl shrink-0"
                                />
                                <span className="font-medium truncate text-sm">
                                  {item.label}
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )}
                      </Fragment>
                    );
                  })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center gap-3 px-1 py-2">
          {showSkeletons ? (
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          ) : (
            <div className="relative shrink-0">
              <Image
                src={user?.profile?.profileImg || "/Assets/user-icon.png"}
                alt="User"
                width={32}
                height={32}
                className="rounded-full border border-sidebar-border object-cover"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-sidebar rounded-full" />
            </div>
          )}

          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            {showSkeletons ? (
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-24" />
              </div>
            ) : (
              <>
                <span className="text-xs font-bold text-sidebar-foreground truncate">
                  {user?.profile?.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate  tracking-tighter uppercase">
                  {user?.role.replace("_", " ")}
                </span>
              </>
            )}
          </div>
        </div>

        {!showSkeletons && (
          <Button
            variant="ghost"
            onClick={handleLogOut}
            className="mt-2 w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <IcfyIcon
              icon="solar:logout-3-bold-duotone"
              className="text-xl shrink-0"
            />
            <span className="group-data-[collapsible=icon]:hidden font-semibold text-xs">
              Log Out
            </span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
