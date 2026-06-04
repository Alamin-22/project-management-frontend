"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { useAppState } from "@/Provider/StateProvider";
import IcfyIcon from "@/components/Shared/IcfyIcon";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USER_ROLE } from "@/Redux/services/userApi/User.interface";

const MobileHeader = () => {
  const { user, loading, isAuthError, handleLogOut } = useAppState();
  const { toggleSidebar } = useSidebar();

  const baseRoute =
    user?.role === USER_ROLE.project_manager
      ? "/manager_workspace"
      : "/member_workspace";

  const showSkeletons = loading || !user || isAuthError;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm md:hidden">
      <Link
        href={baseRoute}
        className="flex items-center gap-2 active:scale-95 transition-all"
      >
        <Image
          src="/Assets/logo/logo.png"
          alt="Logo"
          width={100}
          height={32}
          className="h-7 w-auto object-contain"
          priority
        />
      </Link>

      <div className="flex items-center gap-3">
        {showSkeletons ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-8 w-8 overflow-hidden rounded-full border border-border outline-none active:scale-95 transition-transform">
                <Image
                  src={user?.profile.profileImg?.url || "/Assets/user-icon.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 font-medium">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">
                    {user?.profile?.name || "Staff Member"}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    {user?.role.replace("_", " ")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`${baseRoute}/settings/profile`}
                  className="flex items-center gap-2 w-full"
                >
                  <IcfyIcon
                    icon="solar:user-circle-bold-duotone"
                    className="text-lg"
                  />{" "}
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-destructive focus:bg-destructive/10"
                onClick={handleLogOut}
              >
                <IcfyIcon
                  icon="solar:logout-3-bold-duotone"
                  className="text-lg"
                />{" "}
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent disabled:opacity-50"
          disabled={showSkeletons}
        >
          <IcfyIcon icon="heroicons:bars-3-bottom-right" className="text-3xl" />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
