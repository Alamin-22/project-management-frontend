"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { UserMinus, UserPlus, Users } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import {
  useGetSingleProjectQuery,
  useUpdateTeamMembersMutation,
} from "@/Redux/services/projectApi/ProjectApi";
import { useGetAllStaffQuery } from "@/Redux/services/userApi/UserApi";
import LogoLoader from "@/components/Shared/Loader/LogoLoader";
import QueryNotFoundMessage from "@/components/Shared/QueryNotFoundMessage";

const ProjectTeamPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(slug, {
      skip: !slug,
    });
  const project = projectData?.data;

  const { data: staffData, isLoading: isStaffLoading } = useGetAllStaffQuery({
    limit: 100,
    assignable: true,
  });

  const allStaff = staffData?.data?.result || [];
  const [updateTeam, { isLoading: isUpdating }] =
    useUpdateTeamMembersMutation();

  const handleUpdateTeam = async (
    memberId: string,
    action: "add" | "remove",
  ) => {
    if (!memberId || project?.isDeleted) return;

    try {
      await updateTeam({
        slug,
        data: { memberIds: [memberId], action },
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: `Team member successfully ${action === "add" ? "assigned to" : "removed from"} workspace.`,
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

  if (isProjectLoading || isStaffLoading) {
    return <LogoLoader />;
  }

  if (!project) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assignedIds = project?.teamMembers?.map((m: any) =>
    typeof m === "object" ? m._id || m.id : m,
  );
  const availableStaff = allStaff.filter(
    (staff) => !assignedIds.includes(staff._id || staff.id),
  );

  return (
    <div className="space-y-6">
      <div className="px-6">
        <ReusableBreadcrumb
          paths={[
            { label: "Projects", href: "/manager_workspace/projects" },
            {
              label: project.name,
              href: `/manager_workspace/projects/${slug}`,
            },
            { label: "Team Directory" },
          ]}
        />
      </div>

      {/*  1 column if archived, 2 columns if active */}
      <div
        className={`grid grid-cols-1 ${!project.isDeleted ? "lg:grid-cols-2" : "max-w-3xl mx-auto"} gap-6 px-6`}
      >
        {/* left container, assigned members */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-xs flex flex-col ">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Assigned Team
              </h2>
            </div>
            <Badge variant="secondary">
              {project.teamMembers.length} Members
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {project.teamMembers.length === 0 ? (
              <QueryNotFoundMessage message="No members assigned to this workspace yet." />
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              project?.teamMembers?.map((member: any, idx) => {
                if (typeof member !== "object") return null;

                return (
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
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground leading-none">
                            {member.profile?.name || "Unknown"}
                          </p>
                          {member.profile?.designation && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              {member.profile.designation}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {!project.isDeleted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleUpdateTeam(member._id, "remove")}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                        title="Remove from project"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* right container,, available staff */}
        {!project.isDeleted && (
          <div className="bg-card rounded-xl border border-border p-6 shadow-xs flex flex-col ">
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

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {availableStaff.length === 0 ? (
                <QueryNotFoundMessage message="All available team members are already assigned." />
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                availableStaff.map((staff: any, idx) => (
                  <div
                    key={idx}
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
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground leading-none">
                            {staff.profile?.name || "Unknown"}
                          </p>
                          {staff.profile?.designation && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              {staff.profile.designation}
                            </span>
                          )}
                        </div>
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
        )}
      </div>
    </div>
  );
};

export default ProjectTeamPage;
