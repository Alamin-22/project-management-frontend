"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";
import { IUser, USER_ROLE } from "@/Redux/services/userApi/User.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/Shared/Loader/TableSkeleton";

interface UsersManagementTableProps {
  users: IUser[] | undefined;
  totalCount: number | undefined;
  isLoading: boolean;
  startIndex: number;
  currentUser: IUser | undefined;
  // eslint-disable-next-line no-unused-vars
  onStatusChange: (user: IUser) => void;
  // eslint-disable-next-line no-unused-vars
  onDeleteUser: (userId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onEditUser: (user: IUser) => void;
}

const UsersManagementTable = ({
  users,
  totalCount,
  isLoading,
  startIndex,
  currentUser,
  onStatusChange,
  onDeleteUser,
  onEditUser,
}: UsersManagementTableProps) => {
  return (
    <div className="bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50 border-b border-border">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-80 font-semibold text-muted-foreground">
              <div className="flex items-center gap-3 pl-4">
                <Badge
                  variant="secondary"
                  className="rounded-md px-2 bg-background border border-border"
                >
                  {totalCount || 0}
                </Badge>
                <span>Team Member</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              Contact
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              Role
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-center">
              Status
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-center">
              Last Active
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={6} rows={5} />
          ) : users?.length ? (
            users.map((staff, idx) => {
              const isSuperAdmin = staff.role === USER_ROLE.super_admin;
              const isSelf = staff._id === currentUser?._id;

              return (
                <TableRow
                  key={staff._id}
                  className="group border-b border-border/50 even:bg-muted/50 hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-4 pl-4">
                      <span className="text-muted-foreground text-xs w-4 shrink-0 font-medium">
                        {startIndex + idx + 1}
                      </span>
                      <div className="relative shrink-0">
                        <Image
                          width={40}
                          height={40}
                          className="object-cover h-10 w-10 rounded-full border border-border bg-muted"
                          src={
                            staff.profile?.profileImg?.url ||
                            `https://placehold.co/200x200/png?text=U`
                          }
                          alt="Avatar"
                        />
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                            staff.status === "active"
                              ? "bg-emerald-500"
                              : "bg-destructive"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold text-foreground text-sm">
                            {staff.profile?.name || "Pending Profile"}
                          </span>
                          {isSelf && (
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 h-4 text-primary border-primary/30 bg-primary/10"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground mt-0.5">
                          {staff.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {staff.profile?.contactNo || "—"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold uppercase tracking-wider border-border bg-muted text-foreground"
                    >
                      {staff.role.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant={
                        staff.status === "active" ? "outline" : "default"
                      }
                      size="sm"
                      disabled={isSuperAdmin}
                      onClick={() => onStatusChange(staff)}
                      className={`h-7 text-[10px] uppercase font-bold px-3 rounded-full transition-all ${
                        staff.status === "active"
                          ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {staff.status === "active" ? "Revoke" : "Restore"}
                    </Button>
                  </TableCell>

                  <TableCell className="text-xs text-center whitespace-nowrap">
                    {staff.lastActive ? (
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-foreground">
                          {formatDistanceToNow(new Date(staff.lastActive), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(staff.lastActive).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Never Active
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-48 shadow-lg border-border"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer font-medium text-xs"
                          disabled={isSuperAdmin && !isSelf}
                          onClick={() => onEditUser(staff)}
                        >
                          <UserCog className="mr-2 h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={isSuperAdmin || isSelf}
                          onClick={() => onDeleteUser(staff.id)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium text-xs"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Permanently Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center border-b-0">
                <QueryNotFoundMessage message="No staff members match your current filters." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersManagementTable;
