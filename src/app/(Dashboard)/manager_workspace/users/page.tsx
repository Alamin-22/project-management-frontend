"use client";

import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  IUser,
  TUserStatus,
  USER_ROLE,
} from "@/Redux/services/userApi/User.interface";
import { useAppState } from "@/Provider/StateProvider";
import {
  useGetAllStaffQuery,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
} from "@/Redux/services/userApi/UserApi";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { Badge } from "@/components/ui/badge";
import UsersManagementTable from "@/components/DashboardRelated/Admin/usersManagement/UsersManagementTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ManageStaffModal from "@/components/AuthenticationRelated/ManageStaffModal";

type TSortOrder = "newest" | "oldest" | null;

const UserManagementPage = () => {
  const { user: currentUser, searchQuery: globalSearchQuery } = useAppState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<TUserStatus | null>(
    null,
  );
  const [selectedSort, setSelectedSort] = useState<TSortOrder>("newest");
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const limit = 15;

  const userQueryParams = useMemo(() => {
    let sort = "-createdAt";
    if (selectedSort === "oldest") sort = "createdAt";

    return {
      search: localSearchQuery || globalSearchQuery || undefined,
      status: selectedStatus || undefined,
      limit,
      page: currentPage,
      sort,
    };
  }, [
    localSearchQuery,
    globalSearchQuery,
    selectedStatus,
    currentPage,
    selectedSort,
  ]);

  const {
    data: usersData,
    isLoading,
    isFetching,
  } = useGetAllStaffQuery(userQueryParams);
  const [changeUserStatus] = useChangeUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const totalPages = usersData?.data?.meta?.totalPages || 1;
  const showLoading = isLoading || isFetching;

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: IUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserActiveStatus = async (targetUser: IUser) => {
    if (targetUser._id === currentUser?._id) {
      Swal.fire(
        "Action Restricted",
        "You cannot block your own account.",
        "warning",
      );
      return;
    }
    const newStatus = targetUser.status === "active" ? "blocked" : "active";
    try {
      await changeUserStatus({
        userId: targetUser.id,
        status: newStatus,
      }).unwrap();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire(
        "Failed",
        error?.data?.message || "Status update failed.",
        "error",
      );
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: "Remove Staff Member?",
      text: "This will archive the user record permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, Remove",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId).unwrap();
        Swal.fire("Removed", "Staff access has been revoked.", "success");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Swal.fire("Error", error?.data?.message || "Delete failed.", "error");
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="Staff Management"
        description="Manage system access levels and staff account statuses."
        searchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
        placeholder="Search by name, email, or ID..."
      >
        <div className="flex items-center gap-2">
          {selectedStatus && (
            <Badge
              variant="secondary"
              className="gap-1 bg-primary/10 text-primary border-none"
            >
              {selectedStatus}{" "}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedStatus(null)}
              />
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-slate-200 bg-white"
              >
                <Filter className="mr-2 h-4 w-4" /> Filter & Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-500">
                Order
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={selectedSort === "newest"}
                onCheckedChange={() => setSelectedSort("newest")}
              >
                <ArrowDownWideNarrow className="mr-2 h-4 w-4" /> Newest First
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedSort === "oldest"}
                onCheckedChange={() => setSelectedSort("oldest")}
              >
                <ArrowUpNarrowWide className="mr-2 h-4 w-4" /> Oldest First
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-500">
                Status
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={selectedStatus === "active"}
                onCheckedChange={() => setSelectedStatus("active")}
              >
                Active Staff
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatus === "blocked"}
                onCheckedChange={() => setSelectedStatus("blocked")}
              >
                Blocked Access
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentUser?.role === USER_ROLE.super_admin && (
            <Button
              size="sm"
              className="h-9 bg-primary hover:bg-primary/90"
              onClick={handleOpenCreateModal}
            >
              Add Staff
            </Button>
          )}
        </div>
      </PageHeader>

      <UsersManagementTable
        users={usersData?.data?.result}
        totalCount={usersData?.data?.meta?.total}
        isLoading={showLoading}
        startIndex={(currentPage - 1) * limit}
        currentUser={currentUser}
        onStatusChange={handleUserActiveStatus}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleOpenEditModal}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* --- REUSABLE MODAL CONTAINER --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl! w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedUser
                ? "Update Staff Permissions"
                : "Register New Staff Member"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Modifying details for ${selectedUser.adminProfile.name}`
                : "Fill in the details below to create a new system admin or manager account."}
            </DialogDescription>
          </DialogHeader>

          <ManageStaffModal
            user={selectedUser ?? undefined}
            closeModal={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
