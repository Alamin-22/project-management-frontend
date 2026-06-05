import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ITask } from "@/Redux/services/taskApi/Task.interface";
import { stripHtml } from "@/Utils/stripHtml";

interface Props {
  task: ITask;
  isArchived: boolean;
  isOverlay?: boolean;
  projectSlug: string;
}

const SortableTaskCard = ({
  task,
  isArchived,
  isOverlay = false,
  projectSlug,
}: Props) => {
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

  const plainTextDescription = stripHtml(task.description);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-background p-4 rounded-lg border shadow-sm group ${
        isOverlay
          ? "border-primary shadow-lg rotate-3 scale-105"
          : "border-border hover:border-primary/40"
      }`}
    >
      {/* Header Row: ID and Drag Handle */}
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
          className={`text-muted-foreground/50 p-1 -mr-1 -mt-1 rounded-md ${
            !isArchived &&
            "hover:text-foreground hover:bg-muted cursor-grab active:cursor-grabbing"
          }`}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Clickable Title & Description Preview */}
      <Link
        href={`/manager_workspace/projects/${projectSlug}/tasks/${task.slug}`}
      >
        <h4 className="font-bold text-sm text-foreground leading-snug mb-1 hover:text-primary transition-colors cursor-pointer">
          {task.title}
        </h4>
      </Link>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
        {plainTextDescription}
      </p>

      {/* Multi-Avatar Display */}
      {task.assigneeProfiles && task.assigneeProfiles.length > 0 && (
        <div className="flex items-center -space-x-2 overflow-hidden mb-3">
          {task.assigneeProfiles.map((profile, i) => (
            <Image
              key={i}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-card object-cover bg-muted"
              src={
                profile.profileImg?.url ||
                `https://placehold.co/200x200/png?text=U`
              }
              width={50}
              height={50}
              alt={profile.name}
              title={`${profile.name} ${profile.designation ? `(${profile.designation})` : ""}`}
            />
          ))}
        </div>
      )}

      {/* Footer Row: Priority & Date */}
      <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
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
