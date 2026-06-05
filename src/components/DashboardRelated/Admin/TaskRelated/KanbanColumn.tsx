import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import {
  ITask,
  TASK_STATUS,
  TTaskStatus,
} from "@/Redux/services/taskApi/Task.interface";
import SortableTaskCard from "./SortableTaskCard";

interface Props {
  status: TTaskStatus;
  tasks: ITask[];
  isArchived: boolean;
}

const KanbanColumn = ({ status, tasks, isArchived }: Props) => {
  const { setNodeRef } = useDroppable({
    id: status,
    data: { type: "Column", status },
  });

  return (
    <div className="w-87.5 shrink-0 flex flex-col max-h-[70vh]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              status === TASK_STATUS.todo
                ? "bg-amber-500"
                : status === TASK_STATUS.in_progress
                  ? "bg-blue-500"
                  : "bg-emerald-500"
            }`}
          />
          {status}
        </h3>
        <Badge variant="secondary" className="text-xs font-bold">
          {tasks.length}
        </Badge>
      </div>

      {/* Droppable Container */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto custom-scrollbar rounded-xl bg-muted/30 p-3 "
      >
        <SortableContext
          id={status}
          items={tasks.map((t) => t.slug)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.slug}
                task={task}
                isArchived={isArchived}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
