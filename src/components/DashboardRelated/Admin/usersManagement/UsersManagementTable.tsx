"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Trash2, ShieldCheck, UserCog } from "lucide-react";
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
    <div className="border-b bg-white">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow className="border-none">
            <TableHead className="w-72 font-bold text-slate-700">
              <div className="flex items-center gap-3 pl-3">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1.5 min-w-8 justify-center text-black bg-white border border-slate-300"
                >
                  {totalCount || 0}
                </Badge>
                <span>Staff Member</span>
              </div>
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-center">Contact</TableHead>
            <TableHead className="font-bold text-slate-700 text-center">
              System Permissions
            </TableHead>
            <TableHead className="text-center font-bold text-slate-700">
              Status
            </TableHead>
            <TableHead className="text-center font-bold text-slate-700">
              Role
            </TableHead>
            <TableHead className="whitespace-nowrap text-center font-bold text-slate-700">
              Last Active
            </TableHead>
            <TableHead className="text-center font-bold text-slate-700">
              Action
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
                  className="even:bg-gray-50 group text-slate-600 border-slate-200"
                >
                  <TableCell>
                    <div className="flex items-center gap-3 pl-3">
                      <span className="text-slate-400 text-xs w-4 shrink-0">
                        {startIndex + idx + 1}
                      </span>
                      <div className="relative shrink-0">
                        <Image
                          width={40}
                          height={40}
                          className="object-cover h-10 w-10 rounded-full border border-slate-200 bg-white shadow-sm"
                          src={
                            staff.adminProfile?.profileImg?.url ||
                            `https://placehold.co/200x200/4F46E5/ffffff.png?text=${staff.adminProfile?.name?.charAt(0) || "U"}`
                          }
                          alt="Avatar"
                        />
                        {/* Status Presence Dot */}
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white shadow-sm ${
                            staff.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-bold text-slate-900 text-sm">
                            {staff.adminProfile?.name || "Pending Profile"}
                          </span>
                          {isSelf && (
                            <Badge className="text-[9px] px-1 h-4 border-primary/20 text-primary bg-primary/5 hover:bg-primary/5">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-[11px] text-slate-500">
                          {staff.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    {staff.adminProfile.contactNo}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-64 justify-center">
                      {staff.adminProfile?.permissions?.map((perm) => {
                        const isFull = perm === "full_access";
                        return (
                          <Badge
                            key={perm}
                            variant="outline"
                            className={`text-[9px] px-1.5 py-0 uppercase font-bold tracking-tighter ${
                              isFull
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {isFull && (
                              <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                            )}
                            {perm.replace("_", " ")}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant={
                        staff.status === "active" ? "outline" : "default"
                      }
                      size="sm"
                      // Cannot block Super Admin
                      disabled={isSuperAdmin}
                      onClick={() => onStatusChange(staff)}
                      className={`h-7 text-[10px] uppercase font-bold px-3 rounded-full transition-all ${
                        staff.status === "active"
                          ? "border-red-100 text-red-600 hover:bg-red-50"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {staff.status === "active" ? "Block" : "Activate"}
                    </Button>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      className={`text-[10px] font-bold uppercase border-none pointer-events-none ${
                        isSuperAdmin
                          ? "bg-indigo-600 shadow-sm shadow-indigo-200"
                          : "bg-slate-500"
                      }`}
                    >
                      {staff.role.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-[11px] text-center whitespace-nowrap">
                    {staff.lastActive ? (
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-700">
                          {formatDistanceToNow(new Date(staff.lastActive), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(staff.lastActive).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">
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
                          className="h-8 w-8 text-slate-400 hover:text-slate-900"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 shadow-lg border-slate-200"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer font-bold text-xs"
                          //  Can only edit self if Super Admin, others can't edit Super Admin
                          disabled={isSuperAdmin && !isSelf}
                          onClick={() => onEditUser(staff)}
                        >
                          <UserCog className="mr-2 h-4 w-4" /> Edit Staff
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          //  Super Admin is indestructible
                          disabled={isSuperAdmin || isSelf}
                          onClick={() => onDeleteUser(staff.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-bold text-xs"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <QueryNotFoundMessage message="No staff members match your criteria." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersManagementTable;
