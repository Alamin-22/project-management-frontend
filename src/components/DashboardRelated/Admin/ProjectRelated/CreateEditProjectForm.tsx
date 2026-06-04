"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import CustomFormField from "@/Utils/CustomFormField";
import RichTextEditor from "@/components/Shared/RichTextEditor";
import {
  createProjectValidationSchema,
  updateProjectValidationSchema,
} from "@/Redux/services/projectApi/Project.validation";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/Redux/services/projectApi/ProjectApi";
import {
  IProject,
  PROJECT_STATUS,
} from "@/Redux/services/projectApi/Project.interface";

interface CreateEditProjectFormProps {
  project?: IProject;
}

const CreateEditProjectForm = ({ project }: CreateEditProjectFormProps) => {
  const router = useRouter();
  const isUpdateMode = !!project;

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const isSubmitting = isCreating || isUpdating;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(
      isUpdateMode
        ? updateProjectValidationSchema
        : createProjectValidationSchema,
    ),
    defaultValues: {
      name: "",
      description: "",
      deadline: new Date(),
      status: PROJECT_STATUS.active,
    },
  });

  // Populate data if in Edit Mode
  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description,
        deadline: new Date(project.deadline),
        status: project.status,
      });
    }
  }, [project, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
      if (isUpdateMode && project) {
        await updateProject({
          slug: project.slug,
          data: {
            name: values.name,
            description: values.description,
            deadline: values.deadline,
            status: values.status,
          },
        }).unwrap();

        Swal.fire({
          title: "Project Updated",
          text: "Workspace details have been successfully modified.",
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });
      } else {
        await createProject({
          name: values.name,
          description: values.description,
          deadline: values.deadline,
        }).unwrap();

        Swal.fire({
          title: "Project Initialized",
          text: `Workspace for "${values.name}" is now active.`,
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });

        router.push("/manager_workspace/projects");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text:
          error?.data?.message ||
          `Failed to ${isUpdateMode ? "update" : "create"} project.`,
        icon: "error",
        background: "var(--card)",
        color: "var(--foreground)",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="name"
            label="Project Name"
            placeholder="e.g. Q3 Marketing Campaign"
          />
          <CustomFormField
            control={form.control}
            name="deadline"
            label="Target Deadline"
            type="date"
          />
        </div>

        {/* Status Dropdown - ONLY shows in Edit Mode */}
        {isUpdateMode && (
          <div className="w-full md:w-1/2 md:pr-3">
            <CustomFormField
              control={form.control}
              name="status"
              label="Project Status"
              type="select"
              options={[
                { label: "Active", value: PROJECT_STATUS.active },
                { label: "On Hold", value: PROJECT_STATUS.on_hold },
                { label: "Completed", value: PROJECT_STATUS.completed },
              ]}
            />
          </div>
        )}

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-foreground">
              Workspace Brief & Resources
            </Label>
            <span className="text-xs text-muted-foreground hidden sm:block">
              You can upload images or attach files directly here.
            </span>
          </div>
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {form.formState.errors.description && (
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.description.message as string}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-bold text-xs uppercase tracking-widest px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Processing...
              </>
            ) : isUpdateMode ? (
              "Save Changes"
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateEditProjectForm;
