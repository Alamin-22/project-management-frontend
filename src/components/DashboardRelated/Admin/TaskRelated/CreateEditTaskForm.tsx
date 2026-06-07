/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import CustomFormField from "@/Utils/CustomFormField";
import RichTextEditor from "@/components/Shared/RichTextEditor";
import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/Redux/services/taskApi/TaskApi";
import {
  createTaskValidationSchema,
  updateTaskValidationSchema,
} from "@/Redux/services/taskApi/Task.validation";
import {
  ITask,
  TASK_PRIORITY,
  TASK_STATUS,
} from "@/Redux/services/taskApi/Task.interface";
import LogoLoader from "@/components/Shared/Loader/LogoLoader";

interface CreateEditTaskFormProps {
  task?: ITask;
  projectSlug: string;
}

const CreateEditTaskForm = ({ task, projectSlug }: CreateEditTaskFormProps) => {
  const router = useRouter();
  const isUpdateMode = !!task;

  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(projectSlug);
  const project = projectData?.data;

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const isSubmitting = isCreating || isUpdating;

  const formatForInput = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

  const form = useForm<any>({
    resolver: zodResolver(
      isUpdateMode ? updateTaskValidationSchema : createTaskValidationSchema,
    ),
    values: {
      title: task?.title || "",
      description: task?.description || "",
      project: task?.project || project?._id || "",
      assignedMembers:
        task?.assignedMembers?.map((m: any) =>
          typeof m === "object" ? m._id : m,
        ) || [],
      priority: task?.priority || TASK_PRIORITY.medium,
      dueDate: task?.dueDate
        ? formatForInput(new Date(task.dueDate))
        : formatForInput(new Date()),
      status: task?.status || TASK_STATUS.todo,
    },
  });

  const onError = (errors: any) => {
    const firstErrorKey = Object.keys(errors)[0];
    const errorElement = document.getElementById(`field-${firstErrorKey}`);

    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onSubmit = async (values: any) => {
    try {
      if (isUpdateMode && task) {
        await updateTask({
          slug: task.slug,
          data: {
            title: values.title,
            description: values.description,
            assignedMembers: values.assignedMembers,
            priority: values.priority,
            status: values.status,
            dueDate: new Date(values.dueDate).toISOString(),
          },
        }).unwrap();

        Swal.fire({
          title: "Task Updated",
          text: "Task details have been successfully modified.",
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });
      } else {
        await createTask({
          title: values.title,
          description: values.description,
          project: project!._id,
          assignedMembers: values.assignedMembers,
          priority: values.priority,
          dueDate: new Date(values.dueDate).toISOString(),
        }).unwrap();

        Swal.fire({
          title: "Task Created",
          text: `"${values.title}" has been added to the board.`,
          icon: "success",
          background: "var(--card)",
          color: "var(--foreground)",
        });
      }
      router.push(`/manager_workspace/projects/${projectSlug}/tasks`);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text:
          error?.data?.message ||
          `Failed to ${isUpdateMode ? "update" : "create"} task.`,
        icon: "error",
        background: "var(--card)",
        color: "var(--foreground)",
      });
    }
  };

  if (isProjectLoading) {
    return <LogoLoader />;
  }

  const memberOptions =
    project?.teamMembers?.map((member: any) => ({
      label: member.profile?.name
        ? `${member.profile.name} (${member.email})`
        : member.email,
      value: member._id,
    })) || [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div id="field-title">
            <CustomFormField
              control={form.control}
              name="title"
              label="Task Title"
              placeholder="e.g. Design Homepage UI"
            />
          </div>
          <div id="field-assignedMembers">
            <CustomFormField
              control={form.control}
              name="assignedMembers"
              label="Assign To"
              type="multi-select"
              placeholder="Select team members..."
              options={memberOptions}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div id="field-dueDate">
            <CustomFormField
              control={form.control}
              name="dueDate"
              label="Due Date"
              type="datetime-local"
            />
          </div>
          <div id="field-priority">
            <CustomFormField
              control={form.control}
              name="priority"
              label="Priority Level"
              type="select"
              options={[
                { label: "High Priority", value: TASK_PRIORITY.high },
                { label: "Medium Priority", value: TASK_PRIORITY.medium },
                { label: "Low Priority", value: TASK_PRIORITY.low },
              ]}
            />
          </div>
        </div>

        {isUpdateMode && (
          <div className="w-full md:w-1/2 md:pr-3" id="field-status">
            <CustomFormField
              control={form.control}
              name="status"
              label="Task Status"
              type="select"
              options={[
                { label: "To-Do", value: TASK_STATUS.todo },
                { label: "In Progress", value: TASK_STATUS.in_progress },
                { label: "Completed", value: TASK_STATUS.completed },
              ]}
            />
          </div>
        )}

        <div className="space-y-2 pt-2" id="field-description">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-foreground">
              Task Description & Assets
            </Label>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Attach files or detailed requirements here.
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
              "Create Task"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateEditTaskForm;
