"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "./StateProvider";
import { TUserRole } from "@/Redux/services/userApi/User.interface";
import toast from "react-hot-toast";
import IMSLoader from "@/components/Shared/Loader/LogoLoader";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: TUserRole[];
}

const PrivateRoute = ({ children, allowedRoles = [] }: PrivateRouteProps) => {
  const { user, loading, handleLogOut } = useAppState();
  const router = useRouter();

  // Determine authorization status
  const isAuthorized =
    user &&
    (allowedRoles.length === 0 ||
      allowedRoles.includes(user.role as TUserRole));

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // 1. Not logged in -> Redirect seamlessly
        router.push("/login");
      } else if (!isAuthorized) {
        toast.error(
          "Unauthorized access. Please log in with an Admin account.",
        );
        handleLogOut();
      }
    }
  }, [loading, user, isAuthorized, router, handleLogOut]);

  // Keep showing the loader until we are 100% sure they are authorized
  if (loading || !user || !isAuthorized) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-transparent">
        <IMSLoader />
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
