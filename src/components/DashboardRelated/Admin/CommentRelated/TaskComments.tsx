"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  useGetTaskCommentsQuery,
  useAddCommentMutation,
} from "@/Redux/services/commentApi/CommentApi";
import {
  commentValidationSchema,
  TCommentFormValues,
} from "@/Redux/services/commentApi/Comment.validation";

interface TaskCommentsProps {
  taskSlug: string;
  isArchived: boolean;
}

const TaskComments = ({ taskSlug, isArchived }: TaskCommentsProps) => {
  const { data, isLoading } = useGetTaskCommentsQuery(taskSlug, {
    skip: !taskSlug,
  });
  const comments = data?.data || [];

  const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();

  const form = useForm<TCommentFormValues>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: { content: "" },
  });

  const content = useWatch({
    control: form.control,
    name: "content",
  });

  const onSubmit = async (values: TCommentFormValues) => {
    if (isArchived) return;

    try {
      await addComment({
        taskSlug,
        content: values.content,
      }).unwrap();

      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.data?.message || "Failed to post comment.",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        background: "var(--card)",
        color: "var(--foreground)",
      });
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Discussion</h2>
        <span className="ml-auto bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </div>

      <div className="flex-1 space-y-6 mb-6 overflow-y-auto custom-scrollbar pr-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-muted-foreground">
              No comments yet. Start the discussion!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 group">
              <Image
                src={
                  comment.author.profile?.profileImg?.url ||
                  `https://placehold.co/200x200/png?text=U`
                }
                alt={comment.author.profile?.name || "User"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-background shrink-0 bg-muted"
              />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground leading-none">
                    {comment.author.profile?.name || "Unknown User"}
                  </span>
                  {comment.author.profile?.designation && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 rounded-sm leading-none">
                      {comment.author.profile.designation}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="text-sm text-foreground/90 bg-muted/30 p-3 rounded-lg border border-border/50">
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-border relative">
        {isArchived ? (
          <div className="bg-muted/50 rounded-lg p-3 text-center text-sm text-muted-foreground font-medium border border-dashed border-border">
            Commenting is disabled for archived tasks.
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Write an update, ask a question, or share progress..."
                        className="resize-none min-h-25 pr-12 bg-background focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isSubmitting || !content?.trim()}
                className="absolute bottom-3 right-3 h-8 w-8 rounded-md"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default TaskComments;
