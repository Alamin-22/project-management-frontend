"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
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
import { Button } from "@/components/ui/button";
import { useAppState } from "@/Provider/StateProvider";
import LogoLoader from "@/components/Shared/Loader/LogoLoader";

type BoardState = Record<TTaskStatus, ITask[]>;

const MemberTaskBoardPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { user } = useAppState();
  const [filter, setFilter] = useState<"mine" | "all">("mine");

  const { data: projectData, isLoading: isProjectLoading } =
    useGetSingleProjectQuery(slug, { skip: !slug });
  const project = projectData?.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: any = { project: project?._id, limit: 500, sort: "order" };
  if (filter === "mine" && user?._id) {
    queryParams.assignedMembers = user._id;
  }

  const { data: tasksData, isLoading: isTasksLoading } = useGetAllTasksQuery(
    queryParams,
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
    ) {
      return id as TTaskStatus;
    }
    return Object.keys(boardData).find((key) =>
      boardData[key as TTaskStatus].some((task) => task.slug === id),
    ) as TTaskStatus;
  };

  const checkPermission = (task: ITask) => {
    const isAssigned = task.assignedMembers?.includes(user?.id || "");
    return user?.role !== "team_member" || isAssigned;
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as ITask;

    if (!checkPermission(task)) {
      toast.error("Access Denied: You can only move your own tasks.");
    }
    setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task as ITask;
    if (!checkPermission(task)) return; // Prevent dragover snap

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
    const task = activeTask;
    setActiveTask(null);

    const { active, over } = event;
    if (!over || !task) return;

    // reject drop if they aren't authorized,,,,revert instantly
    if (!checkPermission(task)) return;

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

    if (overIndex === -1) {
      overIndex = boardData[overContainer].length;
    }

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
    return <LogoLoader />;
  }

  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="px-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Tasks Board</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop tasks to update priorities and statuses.
          </p>
        </div>

        {/* filter */}
        <div className="flex items-center bg-card border border-border p-1 rounded-lg shadow-xs">
          <Button
            variant={filter === "mine" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("mine")}
            className="text-xs font-bold"
          >
            My Tasks
          </Button>
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs font-bold"
          >
            All Tasks
          </Button>
        </div>
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
                  baseUrl="/member_workspace/projects"
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
                baseUrl="/member_workspace/projects"
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
              Quickly move this task to a new stage on the Tasks Board.
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
