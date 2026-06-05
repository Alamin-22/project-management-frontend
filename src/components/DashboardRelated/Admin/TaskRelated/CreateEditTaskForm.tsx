/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
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

interface CreateEditTaskFormProps {
  task?: ITask;
  projectSlug: string; // We need this to get the project ID and Team Members
}

const CreateEditTaskForm = ({ task, projectSlug }: CreateEditTaskFormProps) => {
  const router = useRouter();
  const isUpdateMode = !!task;

  // Fetch the project to get the _id and the team members roster
  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(projectSlug);
  const project = projectData?.data;

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const isSubmitting = isCreating || isUpdating;

  const formatForInput = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(
      isUpdateMode ? updateTaskValidationSchema : createTaskValidationSchema,
    ),
    defaultValues: {
      title: "",
      description: "",
      project: "",
      assignedMember: "",
      priority: TASK_PRIORITY.medium,
      dueDate: formatForInput(new Date()),
      status: TASK_STATUS.todo,
    },
  });

  // Populate data when project loads or in Edit Mode
  useEffect(() => {
    if (project && !isUpdateMode) {
      form.setValue("project", project._id);
    }

    if (project && isUpdateMode && task) {
      form.reset({
        title: task.title,
        description: task.description,
        project: task.project,
        assignedMember:
          typeof task.assignedMember === "object"
            ? (task.assignedMember as any)._id
            : task.assignedMember,
        priority: task.priority,
        dueDate: formatForInput(new Date(task.dueDate)),
        status: task.status,
      });
    }
  }, [project, task, isUpdateMode, form]);

  const onSubmit = async (values: any) => {
    try {
      if (isUpdateMode && task) {
        await updateTask({
          slug: task.slug,
          data: {
            title: values.title,
            description: values.description,
            assignedMember: values.assignedMember,
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

        router.push(`/manager_workspace/projects/${projectSlug}/task-board`);
      } else {
        await createTask({
          title: values.title,
          description: values.description,
          project: project!._id,
          assignedMember: values.assignedMember,
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

        router.push(`/manager_workspace/projects/${projectSlug}/task-board`);
      }
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
    return (
      <div className="flex py-12 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="title"
            label="Task Title"
            placeholder="e.g. Design Homepage UI"
          />
          <CustomFormField
            control={form.control}
            name="assignedMember"
            label="Assign To"
            type="select"
            options={memberOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="dueDate"
            label="Due Date"
            type="datetime-local"
          />
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

        {isUpdateMode && (
          <div className="w-full md:w-1/2 md:pr-3">
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

        <div className="space-y-2 pt-2">
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
