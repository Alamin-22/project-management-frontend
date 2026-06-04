"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import CustomFormField from "@/Utils/CustomFormField";
import RichTextEditor from "@/components/Shared/RichTextEditor";
import {
  createProjectValidationSchema,
  TCreateProjectFormValues,
} from "@/Redux/services/projectApi/Project.validation";
import { useCreateProjectMutation } from "@/Redux/services/projectApi/ProjectApi";

interface CreateProjectModalProps {
  closeModal: () => void;
}

const CreateProjectModal = ({ closeModal }: CreateProjectModalProps) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const form = useForm<TCreateProjectFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createProjectValidationSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      deadline: new Date(),
    },
  });

  const onSubmit = async (values: TCreateProjectFormValues) => {
    try {
      await createProject(values).unwrap();

      Swal.fire({
        title: "Project Created",
        text: `Workspace for "${values.name}" is now active.`,
        icon: "success",
        background: "var(--card)",
        color: "var(--foreground)",
      });

      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.data?.message || "Failed to create project.",
        icon: "error",
        background: "var(--card)",
        color: "var(--foreground)",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-1">
        <CustomFormField
          control={form.control}
          name="name"
          label="Project Name"
          placeholder="e.g. Website Redesign"
        />

        <div className="space-y-2">
          <Label className="font-semibold text-foreground">
            Project Description
          </Label>
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {form.formState.errors.description && (
            <p className="text-xs font-medium text-destructive mt-1">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <CustomFormField
          control={form.control}
          name="deadline"
          label="Project Deadline"
          type="date"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={closeModal}
            className="font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="font-bold text-xs uppercase tracking-widest px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />{" "}
                Initializing...
              </>
            ) : (
              "Initialize Workspace"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProjectModal;
