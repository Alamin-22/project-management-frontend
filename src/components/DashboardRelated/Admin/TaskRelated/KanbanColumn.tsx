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
  projectSlug: string;
}

const KanbanColumn = ({ status, tasks, isArchived, projectSlug }: Props) => {
  const { setNodeRef } = useDroppable({
    id: status,
    data: { type: "Column", status },
  });

  return (
    <div className="flex flex-col h-full  border border-border rounded-xl bg-card shadow-sm p-4">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1 pb-3 border-b border-border/50">
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
        className="flex-1 overflow-y-auto custom-scrollbar min-h-37.5 -mx-2 px-2"
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
                projectSlug={projectSlug}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
