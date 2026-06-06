"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUpdateTaskMutation } from "@/Redux/services/taskApi/TaskApi";
import {
  ITask,
  TASK_STATUS,
  TTaskStatus,
} from "@/Redux/services/taskApi/Task.interface";
import { useAppState } from "@/Provider/StateProvider";

interface Props {
  task: ITask;
  closeModal: () => void;
}

const UpdateTaskStatusModal = ({ task, closeModal }: Props) => {
  const { user } = useAppState();
  const [selectedStatus, setSelectedStatus] = useState<TTaskStatus>(
    task.status,
  );
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const isAssigned = task.assignedMembers?.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (m: any) => m === user?._id || m?._id === user?._id,
  );
  const canEdit = user?.role !== "team_member" || isAssigned;

  const handleUpdate = async () => {
    if (selectedStatus === task.status) {
      closeModal();
      return;
    }

    try {
      await updateTask({
        slug: task.slug,
        data: { status: selectedStatus },
      }).unwrap();

      Swal.fire({
        title: "Status Updated",
        text: `Task successfully moved to ${selectedStatus}.`,
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
      Swal.fire(
        "Error",
        error?.data?.message || "Failed to update status",
        "error",
      );
    }
  };

  if (!canEdit) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">Access Denied</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You can only update the status of tasks that are specifically
            assigned to you.
          </p>
        </div>
        <Button variant="outline" onClick={closeModal} className="w-full mt-2">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <RadioGroup
        value={selectedStatus}
        onValueChange={(val) => setSelectedStatus(val as TTaskStatus)}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center space-x-3 space-y-0 rounded-md border border-border p-4 hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value={TASK_STATUS.todo} id="status-todo" />
          <Label
            htmlFor="status-todo"
            className="flex-1 cursor-pointer font-bold flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" /> To-Do
          </Label>
        </div>
        <div className="flex items-center space-x-3 space-y-0 rounded-md border border-border p-4 hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem
            value={TASK_STATUS.in_progress}
            id="status-in-progress"
          />
          <Label
            htmlFor="status-in-progress"
            className="flex-1 cursor-pointer font-bold flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500" /> In Progress
          </Label>
        </div>
        <div className="flex items-center space-x-3 space-y-0 rounded-md border border-border p-4 hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value={TASK_STATUS.completed} id="status-completed" />
          <Label
            htmlFor="status-completed"
            className="flex-1 cursor-pointer font-bold flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={closeModal}
          className="font-bold text-xs uppercase tracking-widest"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          disabled={isLoading}
          className="font-bold text-xs uppercase tracking-widest"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Confirm Update"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateTaskStatusModal;
