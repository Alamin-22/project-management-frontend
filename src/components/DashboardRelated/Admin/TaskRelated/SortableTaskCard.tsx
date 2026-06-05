import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { ITask } from "@/Redux/services/taskApi/Task.interface";

interface Props {
  task: ITask;
  isArchived: boolean;
  isOverlay?: boolean;
}

const SortableTaskCard = ({ task, isArchived, isOverlay = false }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.slug,
    data: { type: "Task", task },
    disabled: isArchived,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card p-4 rounded-lg border shadow-sm group ${
        isOverlay
          ? "border-primary shadow-lg rotate-3 scale-105"
          : "border-border hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <Badge
          variant="outline"
          className="text-[10px] font-mono text-muted-foreground"
        >
          {task.taskId}
        </Badge>
        <div
          {...attributes}
          {...listeners}
          className={`text-muted-foreground/50 ${
            !isArchived &&
            "hover:text-foreground cursor-grab active:cursor-grabbing"
          }`}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
      <h4 className="font-bold text-sm text-foreground leading-snug mb-3">
        {task.title}
      </h4>
      <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
        <Badge
          variant="secondary"
          className={`text-[10px] px-2 py-0 h-5 ${
            task.priority === "High"
              ? "bg-destructive/10 text-destructive"
              : task.priority === "Medium"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                : "bg-blue-500/10 text-blue-500"
          }`}
        >
          {task.priority}
        </Badge>
        <span className="text-[10px] font-medium text-muted-foreground">
          {format(new Date(task.dueDate), "MMM dd")}
        </span>
      </div>
    </div>
  );
};

export default SortableTaskCard;
