"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/Utils/CustomFormField";
import { useUpdateProjectMutation } from "@/Redux/services/projectApi/ProjectApi";
import {
  IProject,
  PROJECT_STATUS,
} from "@/Redux/services/projectApi/Project.interface";

interface UpdateStatusModalProps {
  project: IProject;
  closeModal: () => void;
}

const updateStatusSchema = z.object({
  status: z.enum([
    PROJECT_STATUS.active,
    PROJECT_STATUS.completed,
    PROJECT_STATUS.on_hold,
  ]),
});

type TStatusForm = z.infer<typeof updateStatusSchema>;

const UpdateStatusModal = ({ project, closeModal }: UpdateStatusModalProps) => {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const form = useForm<TStatusForm>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: project.status,
    },
  });

  useEffect(() => {
    form.reset({ status: project.status });
  }, [project.status, form]);

  const onSubmit = async (values: TStatusForm) => {
    if (values.status === project.status) {
      closeModal();
      return;
    }

    try {
      await updateProject({
        slug: project.slug,
        data: { status: values.status },
      }).unwrap();

      Swal.fire({
        title: "Status Updated",
        text: `Project is now marked as ${values.status.replace("_", " ")}.`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        background: "var(--card)",
        color: "var(--foreground)",
      });

      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.data?.message || "Failed to update status.",
        icon: "error",
        background: "var(--card)",
        color: "var(--foreground)",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomFormField
          control={form.control}
          name="status"
          label="Current Project Status"
          type="select"
          options={[
            { label: "Active", value: PROJECT_STATUS.active },
            { label: "On Hold", value: PROJECT_STATUS.on_hold },
            { label: "Completed", value: PROJECT_STATUS.completed },
          ]}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Saving...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateStatusModal;
