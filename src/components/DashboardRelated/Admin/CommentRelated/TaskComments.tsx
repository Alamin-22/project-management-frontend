"use client";

import { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, MessageSquare, Loader2, Reply, X } from "lucide-react";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  useGetTaskCommentsQuery,
  useAddCommentMutation,
} from "@/Redux/services/commentApi/CommentApi";
import {
  commentValidationSchema,
  TCommentFormValues,
} from "@/Redux/services/commentApi/Comment.validation";
import CommentItem from "./CommentItem";

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

  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<TCommentFormValues>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: { content: "", parentComment: undefined },
  });

  const content = useWatch({
    control: form.control,
    name: "content",
  });

  const handleReplyClick = (commentId: string, authorName: string) => {
    setReplyingTo({ id: commentId, name: authorName });
    form.setValue("parentComment", commentId);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    form.setValue("parentComment", undefined);
  };

  const onSubmit = async (values: TCommentFormValues) => {
    if (isArchived) return;

    try {
      await addComment({
        taskSlug,
        content: values.content,
        parentComment: values.parentComment,
      }).unwrap();

      form.reset({ content: "", parentComment: undefined });
      setReplyingTo(null);
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

  // Keyboard Event Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSubmitting && content?.trim()) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 flex flex-col h-full max-h-200">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-2 shrink-0">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Discussion</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 mt-6">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-16 w-full rounded-lg rounded-tl-none" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No comments yet. Be the first to start the discussion!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              isArchived={isArchived}
              onReplyClick={handleReplyClick}
            />
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 pt-4 border-t border-border mt-auto">
        {isArchived ? (
          <div className="bg-muted/50 rounded-lg p-3 text-center text-sm text-muted-foreground font-medium border border-dashed border-border">
            Commenting is disabled for archived tasks.
          </div>
        ) : (
          <div className="relative bg-background border border-input rounded-xl focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
            {/* reply indicator */}
            {replyingTo && (
              <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border text-xs font-medium text-muted-foreground rounded-t-xl">
                <span className="flex items-center gap-1.5">
                  <Reply className="h-3.5 w-3.5 text-primary" />
                  Replying to{" "}
                  <span className="text-foreground font-bold">
                    {replyingTo.name}
                  </span>
                </span>
                <button
                  onClick={cancelReply}
                  className="hover:text-foreground transition-colors p-1 bg-background/50 rounded-full hover:bg-background"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative flex items-end gap-2 p-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1 m-0">
                      <FormControl>
                        <Textarea
                          placeholder={
                            replyingTo
                              ? "Write your reply..."
                              : "Write an update, ask a question... (Shift+Enter for new line)"
                          }
                          className="min-h-12.5 max-h-50 w-full resize-none border-0 bg-transparent px-3 py-3 text-sm focus-visible:ring-0  scrollbar-thin"
                          {...field}
                          onKeyDown={handleKeyDown}
                          ref={(e) => {
                            field.ref(e);
                            inputRef.current = e;
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubmitting || !content?.trim()}
                  className={`h-10 w-10 shrink-0 rounded-lg transition-all self-end mb-1 mr-1 ${
                    content?.trim()
                      ? "bg-primary text-primary-foreground hover:scale-105"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 ml-0.5" />
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskComments;
