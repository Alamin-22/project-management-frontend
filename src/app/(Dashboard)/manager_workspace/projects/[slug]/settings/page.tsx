"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import FormCard from "@/Utils/FormCard";
import ReusableBreadcrumb from "@/components/Shared/ReusableBreadcrumb";
import CreateEditProjectForm from "@/components/DashboardRelated/Admin/ProjectRelated/CreateEditProjectForm";
import {
  useGetSingleProjectQuery,
  useDeleteProjectMutation,
} from "@/Redux/services/projectApi/ProjectApi";

const ProjectSettingsPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading } = useGetSingleProjectQuery(slug, {
    skip: !slug,
  });

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const project = data?.data;

  const handleDelete = async () => {
    if (!project) return;

    const { value: confirmedName, isConfirmed } = await Swal.fire({
      title: "Are you absolutely sure?",
      html: `
        <div class="text-left text-sm mt-2 space-y-3">
          <p>This action will <strong>archive</strong> the project workspace.</p>
          <ul class="list-disc pl-5 text-muted-foreground">
            <li>The project will be removed from the active dashboard.</li>
            <li>Team members will lose active task assignments.</li>
            <li>You can restore this later from the Archive tab.</li>
          </ul>
          <p class="pt-2">Please type <strong>${project.name}</strong> to confirm.</p>
        </div>
      `,
      input: "text",
      inputPlaceholder: project.name,
      icon: "warning",
      showCancelButton: true,

      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Archive Project",
      background: "var(--card)",
      color: "var(--foreground)",
      customClass: {
        input: "bg-background border-border text-foreground mt-4",
      },
      inputValidator: (value) => {
        if (value !== project.name) {
          return "Project name does not match!";
        }
        return null;
      },
    });

    if (isConfirmed && confirmedName === project.name) {
      try {
        await deleteProject(slug).unwrap();

        Swal.fire({
          title: "Archived!",
          text: "The project has been moved to the archive.",
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });

        router.push("/manager_workspace/projects");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        Swal.fire(
          "Error",
          error?.data?.message || "Failed to archive project.",
          "error",
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <ReusableBreadcrumb
          paths={[
            { label: "Projects", href: "/manager_workspace/projects" },
            {
              label: project.name,
              href: `/manager_workspace/projects/${slug}`,
            },
            { label: "Settings" },
          ]}
        />
        <div className="flex items-center gap-4">
          <Link href={`/manager_workspace/projects/${slug}`}>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Project Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Modify workspace details, update the deadline, or change the
              status.
            </p>
          </div>
        </div>
      </div>

      <FormCard title="Edit Project Details">
        <CreateEditProjectForm project={project} />
      </FormCard>

      {/* --- DANGER ZONE --- */}
      <div className="mt-12 mb-8">
        <h2 className="text-lg font-bold text-destructive mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> Danger Zone
        </h2>
        <div className="border border-destructive/30 rounded-xl p-6 bg-destructive/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Archive this project
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Mark this project as archived. It will be removed from the active
              grid but can be restored later.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="shrink-0"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Archive Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;
