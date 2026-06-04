"use client";

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetMeQuery,
  useLogoutMutation,
} from "@/Redux/services/authApi/AuthAPi";
import { IUser } from "@/Redux/services/userApi/User.interface";

interface AppStateContextType {
  user: IUser | undefined;
  loading: boolean;
  isAuthError: boolean;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  handleLogOut: () => Promise<void>;
}

export const AppStateContext = createContext<AppStateContextType | null>(null);

export const AppStateProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: userResponse,
    isLoading: isAuthLoading,
    isError: isAuthError,
  } = useGetMeQuery();

  const user = userResponse?.data;
  const [logout] = useLogoutMutation();

  const handleLogOut = useCallback(async () => {
    try {
      await logout().unwrap();
      toast.success("Session ended securely.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Clearing session data...");
    } finally {
      // Clear local storage/session regardless of API success
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
      }

      // Force redirect to login
      router.push("/login");
    }
  }, [logout, router]);

  const value = useMemo(
    () => ({
      user,
      loading: isAuthLoading,
      isAuthError,
      searchQuery,
      setSearchQuery,
      handleLogOut,
    }),
    [user, isAuthLoading, isAuthError, searchQuery, handleLogOut],
  );

  return <AppStateContext value={value}>{children}</AppStateContext>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
