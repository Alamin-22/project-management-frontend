"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArchiveX, Loader2, Plus } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Link from "next/link";

import { useGetSingleProjectQuery } from "@/Redux/services/projectApi/ProjectApi";
import {
  useGetAllTasksQuery,
  useReorderTasksMutation,
} from "@/Redux/services/taskApi/TaskApi";
import {
  ITask,
  TASK_STATUS,
  TTaskStatus,
} from "@/Redux/services/taskApi/Task.interface";
import { Button } from "@/components/ui/button";

import KanbanColumn from "@/components/DashboardRelated/Admin/TaskRelated/KanbanColumn";
import SortableTaskCard from "@/components/DashboardRelated/Admin/TaskRelated/SortableTaskCard";
import UpdateTaskStatusModal from "@/components/DashboardRelated/Admin/TaskRelated/UpdateTaskStatusModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BoardState = Record<TTaskStatus, ITask[]>;

const TaskBoardPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(slug, { skip: !slug });
  const project = projectData?.data;

  const { data: tasksData, isLoading: isTasksLoading } = useGetAllTasksQuery(
    { project: project?._id, limit: 500, sort: "order" },
    { skip: !project?._id },
  );

  const [reorderTasks] = useReorderTasksMutation();

  const [boardData, setBoardData] = useState<BoardState>({
    [TASK_STATUS.todo]: [],
    [TASK_STATUS.in_progress]: [],
    [TASK_STATUS.completed]: [],
  });

  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const [serverDataRef, setServerDataRef] = useState<ITask[] | undefined>(
    undefined,
  );

  const [statusModalTask, setStatusModalTask] = useState<ITask | null>(null);

  const currentTasks = tasksData?.data?.result;

  if (currentTasks && currentTasks !== serverDataRef) {
    setServerDataRef(currentTasks);
    setBoardData({
      [TASK_STATUS.todo]: currentTasks
        .filter((t) => t.status === TASK_STATUS.todo)
        .sort((a, b) => a.order - b.order),
      [TASK_STATUS.in_progress]: currentTasks
        .filter((t) => t.status === TASK_STATUS.in_progress)
        .sort((a, b) => a.order - b.order),
      [TASK_STATUS.completed]: currentTasks
        .filter((t) => t.status === TASK_STATUS.completed)
        .sort((a, b) => a.order - b.order),
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as ITask;
    setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    const activeContainer = active.data.current?.task.status as TTaskStatus;
    const overContainer = isOverTask
      ? (over.data.current?.task.status as TTaskStatus)
      : (over.id as TTaskStatus);

    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    setBoardData((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];

      const activeIndex = activeItems.findIndex((t) => t.slug === activeId);
      const overIndex = isOverTask
        ? overItems.findIndex((t) => t.slug === overId)
        : overItems.length;

      const [movedTask] = activeItems.splice(activeIndex, 1);
      const updatedTask = { ...movedTask, status: overContainer };
      overItems.splice(overIndex, 0, updatedTask);

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeContainer = active.data.current?.task.status as TTaskStatus;
    const overContainer = (over.data.current?.task?.status ||
      over.id) as TTaskStatus;

    if (!activeContainer || !overContainer) return;

    const activeIndex = boardData[activeContainer].findIndex(
      (t) => t.slug === active.id,
    );
    const overIndex = boardData[overContainer].findIndex(
      (t) => t.slug === over.id,
    );

    let newBoardState = { ...boardData };

    if (activeContainer === overContainer && activeIndex !== overIndex) {
      newBoardState = {
        ...boardData,
        [activeContainer]: arrayMove(
          boardData[activeContainer],
          activeIndex,
          overIndex,
        ),
      };
      setBoardData(newBoardState);
    }

    const payloadTasks: { slug: string; status: TTaskStatus; order: number }[] =
      [];

    newBoardState[overContainer].forEach((task, index) => {
      payloadTasks.push({
        slug: task.slug,
        status: overContainer,
        order: index,
      });
    });

    if (activeContainer !== overContainer) {
      newBoardState[activeContainer].forEach((task, index) => {
        payloadTasks.push({
          slug: task.slug,
          status: activeContainer,
          order: index,
        });
      });
    }

    if (activeContainer !== overContainer || activeIndex !== overIndex) {
      try {
        await reorderTasks({ tasks: payloadTasks }).unwrap();
      } catch (error) {
        console.error("Failed to reorder tasks", error);
      }
    }
  };

  if (isProjectLoading || isTasksLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="px-6 pt-2 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Kanban Board</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop tasks to update priorities and statuses.
          </p>
        </div>
        {!project.isDeleted && (
          <div className="flex items-center gap-3">
            <Link href={`/manager_workspace/projects/${slug}/tasks/archived`}>
              <Button
                variant="outline"
                size="sm"
                className="font-semibold  text-red-500 "
              >
                <ArchiveX className="mr-2 h-4 w-4" /> Archives
              </Button>
            </Link>
            <Link href={`/manager_workspace/projects/${slug}/tasks/create`}>
              <Button size="sm" className="font-semibold">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {(Object.entries(boardData) as [TTaskStatus, ITask[]][]).map(
              ([status, tasks]) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={tasks}
                  isArchived={project.isDeleted}
                  projectSlug={slug}
                  onStatusClick={(task) => setStatusModalTask(task)}
                />
              ),
            )}
          </div>

          <DragOverlay>
            {activeTask ? (
              <SortableTaskCard
                task={activeTask}
                isArchived={false}
                isOverlay={true}
                projectSlug={slug}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Dialog
        open={!!statusModalTask}
        onOpenChange={(open) => !open && setStatusModalTask(null)}
      >
        <DialogContent className="max-w-md w-full border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl">Update Task Status</DialogTitle>
            <DialogDescription>
              Quickly move this task to a new stage on the Kanban board.
            </DialogDescription>
          </DialogHeader>

          {statusModalTask && (
            <UpdateTaskStatusModal
              task={statusModalTask}
              closeModal={() => setStatusModalTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskBoardPage;
