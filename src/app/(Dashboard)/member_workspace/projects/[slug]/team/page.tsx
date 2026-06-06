"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Users, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";

const MemberProjectTeamPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(slug, {
      skip: !slug,
    });
  const project = projectData?.data;

  if (isProjectLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="px-6 pt-2">
        <ReusableBreadcrumb
          paths={[
            { label: "My Projects", href: "/member_workspace/projects" },
            {
              label: project.name,
              href: `/member_workspace/projects/${slug}`,
            },
            { label: "Team Directory" },
          ]}
        />
      </div>

      {/* Single centered column for read-only view */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col ">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Project Team
              </h2>
            </div>
            <Badge variant="secondary">
              {project.teamMembers.length} Members
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {project.teamMembers.length === 0 ? (
              <div className="h-full py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Users className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">
                  No members are currently assigned to this workspace.
                </p>
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              project.teamMembers.map((member: any) => {
                if (typeof member !== "object") return null;

                return (
                  <div
                    key={member._id}
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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProjectTeamPage;
