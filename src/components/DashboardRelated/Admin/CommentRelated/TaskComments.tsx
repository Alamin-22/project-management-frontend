"use client";

import { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageSquare, Loader2, Reply, X } from "lucide-react";
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
import { IComment } from "@/Redux/services/commentApi/Comment.interface";

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

  // Recursive Component to render nested threads
  const CommentNode = ({
    comment,
    depth = 0,
  }: {
    comment: IComment;
    depth?: number;
  }) => {
    return (
      <div
        className={`group ${depth > 0 ? "ml-4 md:ml-12 mt-4 border-l-2 border-border/50 pl-4" : "mt-6"}`}
      >
        <div className="flex gap-3 md:gap-4">
          <Image
            src={
              comment.author.profile?.profileImg?.url ||
              `https://placehold.co/200x200/png?text=U`
            }
            alt={comment.author.profile?.name || "User"}
            width={40}
            height={40}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover ring-2 ring-background shrink-0 bg-muted"
          />
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground leading-none">
                {comment.author.profile?.name || "Unknown User"}
              </span>
              {comment.author.profile?.designation && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm leading-none hidden sm:inline-block">
                  {comment.author.profile.designation}
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Comment Bubble Style */}
            <div className="text-sm text-foreground/90 bg-muted/30 p-3 rounded-lg rounded-tl-none border border-border/50">
              <p className="whitespace-pre-wrap">{comment.content}</p>
            </div>

            {/* Action Bar */}
            {!isArchived && (
              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={() =>
                    handleReplyClick(
                      comment._id,
                      comment.author.profile?.name || "User",
                    )
                  }
                  className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Reply className="h-3 w-3" /> Reply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recursively render child replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map((reply) => (
              <CommentNode key={reply._id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
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
            <CommentNode key={comment._id} comment={comment} />
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
          <div className="bg-muted/30 p-1 md:p-2 rounded-xl border border-border/50 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
            {/* Reply Indicator */}
            {replyingTo && (
              <div className="flex items-center justify-between bg-background px-3 py-1.5 rounded-t-lg border-b border-border text-xs font-medium text-muted-foreground mb-2 mx-1 mt-1">
                <span className="flex items-center gap-1.5">
                  <Reply className="h-3.5 w-3.5 text-primary" />
                  Replying to{" "}
                  <span className="text-foreground font-bold">
                    {replyingTo.name}
                  </span>
                </span>
                <button
                  onClick={cancelReply}
                  className="hover:text-foreground transition-colors p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative flex items-end gap-2 px-1 pb-1"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder={
                            replyingTo
                              ? "Write your reply..."
                              : "Write an update, ask a question, or share progress..."
                          }
                          className="resize-none min-h-12.5 max-h-37.5 border-0 focus-visible:ring-0 bg-transparent px-3 py-2 text-sm shadow-none"
                          {...field}
                          ref={(e) => {
                            field.ref(e);
                            inputRef.current = e;
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs px-3 pb-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubmitting || !content?.trim()}
                  className={`h-10 w-10 shrink-0 rounded-lg mb-1 mr-1 transition-all ${
                    content?.trim()
                      ? "bg-primary text-primary-foreground shadow-md hover:scale-105"
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
