"use client";

import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { IUser, TUserStatus } from "@/Redux/services/userApi/User.interface";
import { useAppState } from "@/Provider/StateProvider";
import PageHeader from "@/components/DashboardRelated/PageHeader";
import Pagination from "@/components/Shared/Pagination/Pagination";
import UsersManagementTable from "@/components/DashboardRelated/Admin/usersManagement/UsersManagementTable";
import UserManagementToolbar from "@/components/DashboardRelated/Admin/usersManagement/UserManagementToolbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ManageStaffModal from "@/components/AuthenticationRelated/ManageStaffModal";
import {
  useChangeUserStatusMutation,
  useDeleteUserMutation,
  useGetAllStaffQuery,
} from "@/Redux/services/userApi/UserApi";

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
      text: "This will securely delete the user record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--destructive)",
      confirmButtonText: "Yes, Delete",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId).unwrap();
        Swal.fire({
          title: "Removed",
          text: "Staff access revoked.",
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error?.data?.message || "Delete failed.",
          icon: "error",
          background: "var(--card)",
          color: "var(--foreground)",
        });
      }
    }
  };

  return (
    <>
      <PageHeader
        title="Team Directory"
        description="Manage system access, roles, and staff account security."
        searchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
        placeholder="Search by name, email, or role..."
      >
        <UserManagementToolbar
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          currentUser={currentUser}
          onOpenCreateModal={handleOpenCreateModal}
        />
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl! w-full max-h-[90vh] overflow-y-auto border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedUser
                ? "Update Profile & Access"
                : "Provision New Account"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Modifying details for ${selectedUser.profile?.name || selectedUser.email}`
                : "Create a secure account and assign role-based permissions."}
            </DialogDescription>
          </DialogHeader>

          <ManageStaffModal
            user={selectedUser ?? undefined}
            closeModal={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagementPage;
