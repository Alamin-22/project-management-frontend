"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { UserMinus, UserPlus, Users } from "lucide-react";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetSingleProjectQuery,
  useUpdateTeamMembersMutation,
} from "@/Redux/services/projectApi/ProjectApi";
import { useGetAllStaffQuery } from "@/Redux/services/userApi/UserApi";

const ProjectTeamPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: projectData } = useGetSingleProjectQuery(slug, { skip: !slug });
  const project = projectData?.data;

  const [updateTeam, { isLoading: isUpdating }] =
    useUpdateTeamMembersMutation();

  const { data: staffData } = useGetAllStaffQuery({
    role: "team_member",
    limit: 100,
  });
  const allStaff = staffData?.data?.result || [];

  const handleUpdateTeam = async (
    memberId: string,
    action: "add" | "remove",
  ) => {
    try {
      await updateTeam({
        slug,
        data: { memberIds: [memberId], action },
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: `Team member successfully ${action === "add" ? "assigned" : "removed"}.`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        background: "var(--card)",
        color: "var(--foreground)",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.data?.message || "Failed to update team.",
        "error",
      );
    }
  };

  if (!project) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assignedIds = project.teamMembers.map((m: any) => m._id || m);
  const availableStaff = allStaff.filter(
    (staff) => !assignedIds.includes(staff._id),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col h-150">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Assigned Team</h2>
          </div>
          <Badge variant="secondary">
            {project.teamMembers.length} Members
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {project.teamMembers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Users className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">No members assigned yet.</p>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            project.teamMembers.map((member: any, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Image
                    width={36}
                    height={36}
                    className="rounded-full bg-muted border border-border object-cover"
                    src={
                      member.profile?.profileImg?.url ||
                      `https://placehold.co/200x200/png?text=U`
                    }
                    alt="Avatar"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">
                      {member.profile?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {member.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleUpdateTeam(member._id, "remove")}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available Staff to Add */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col h-150">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">
              Available Staff
            </h2>
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            {availableStaff.length} Available
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {availableStaff.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p className="text-sm">
                All available staff are already assigned.
              </p>
            </div>
          ) : (
            availableStaff.map((staff) => (
              <div
                key={staff._id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Image
                    width={36}
                    height={36}
                    className="rounded-full bg-muted border border-border object-cover"
                    src={
                      staff.profile?.profileImg?.url ||
                      `https://placehold.co/200x200/png?text=U`
                    }
                    alt="Avatar"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">
                      {staff.profile?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {staff.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleUpdateTeam(staff._id, "add")}
                  className="h-8 px-3 text-xs font-bold"
                >
                  Assign
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTeamPage;
