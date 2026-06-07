"use client";

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
import { Badge } from "@/components/ui/badge";
import {
  IUser,
  TUserStatus,
  USER_ROLE,
} from "@/Redux/services/userApi/User.interface";

interface UserManagementToolbarProps {
  selectedStatus: TUserStatus | null;
  // eslint-disable-next-line no-unused-vars
  setSelectedStatus: (status: TUserStatus | null) => void;
  selectedSort: "newest" | "oldest" | null;
  // eslint-disable-next-line no-unused-vars
  setSelectedSort: (sort: "newest" | "oldest" | null) => void;
  currentUser: IUser | undefined;
  onOpenCreateModal: () => void;
}

const UserManagementToolbar = ({
  selectedStatus,
  setSelectedStatus,
  selectedSort,
  setSelectedSort,
  currentUser,
  onOpenCreateModal,
}: UserManagementToolbarProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {selectedStatus && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none py-1 pl-2.5 pr-1.5"
          >
            <span className="capitalize">{selectedStatus}</span>
            <button
              type="button"
              className="rounded-full p-0.5 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStatus(null);
              }}
              aria-label="Clear status filter"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {selectedSort && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors border-none py-1 pl-2.5 pr-1.5"
          >
            <span className="capitalize">{selectedSort} First</span>
            <button
              type="button"
              className="rounded-full p-0.5 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSort(null);
              }}
              aria-label="Clear sort order"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-border bg-card"
          >
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" /> Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-border">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Order
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={selectedSort === "newest"}
            onCheckedChange={() =>
              setSelectedSort(selectedSort === "newest" ? null : "newest")
            }
          >
            <ArrowDownWideNarrow className="mr-2 h-4 w-4" /> Newest First
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedSort === "oldest"}
            onCheckedChange={() =>
              setSelectedSort(selectedSort === "oldest" ? null : "oldest")
            }
          >
            <ArrowUpNarrowWide className="mr-2 h-4 w-4" /> Oldest First
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Status
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={selectedStatus === "active"}
            onCheckedChange={() =>
              setSelectedStatus(selectedStatus === "active" ? null : "active")
            }
          >
            Active Access
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedStatus === "blocked"}
            onCheckedChange={() =>
              setSelectedStatus(selectedStatus === "blocked" ? null : "blocked")
            }
          >
            Blocked Access
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {currentUser?.role !== USER_ROLE.team_member && (
        <Button
          size="sm"
          className="h-9 font-semibold"
          onClick={onOpenCreateModal}
        >
          Create Member
        </Button>
      )}
    </div>
  );
};

export default UserManagementToolbar;
