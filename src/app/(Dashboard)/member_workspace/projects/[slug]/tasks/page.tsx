"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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

const MemberTaskBoardPage = () => {
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

  const findContainer = (id: string) => {
    if (
      id === TASK_STATUS.todo ||
      id === TASK_STATUS.in_progress ||
      id === TASK_STATUS.completed
    )
      return id as TTaskStatus;
    return Object.keys(boardData).find((key) =>
      boardData[key as TTaskStatus].some((task) => task.slug === id),
    ) as TTaskStatus;
  };

  const onDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as ITask;
    setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    setBoardData((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];

      const activeIndex = activeItems.findIndex((t) => t.slug === activeId);
      const overIndex = overItems.findIndex((t) => t.slug === overId);

      const [movedTask] = activeItems.splice(activeIndex, 1);
      const updatedTask = { ...movedTask, status: overContainer };

      const newOverIndex = overIndex >= 0 ? overIndex : overItems.length;
      overItems.splice(newOverIndex, 0, updatedTask);

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

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    const activeIndex = boardData[activeContainer].findIndex(
      (t) => t.slug === activeId,
    );
    let overIndex = boardData[overContainer].findIndex(
      (t) => t.slug === overId,
    );

    if (overIndex === -1) overIndex = boardData[overContainer].length;

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

    Object.keys(newBoardState).forEach((statusKey) => {
      newBoardState[statusKey as TTaskStatus].forEach((task, index) => {
        const originalTask = currentTasks?.find((t) => t.slug === task.slug);
        if (
          !originalTask ||
          originalTask.status !== statusKey ||
          originalTask.order !== index
        ) {
          payloadTasks.push({
            slug: task.slug,
            status: statusKey as TTaskStatus,
            order: index,
          });
        }
      });
    });

    if (payloadTasks.length > 0) {
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
            View project tasks and drag to update statuses.
          </p>
        </div>
        {/* We completely removed the "Add Task" and "Archives" buttons here! */}
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

export default MemberTaskBoardPage;
