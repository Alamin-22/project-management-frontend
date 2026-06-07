"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Reply } from "lucide-react";
import { IComment } from "@/Redux/services/commentApi/Comment.interface";

interface CommentItemProps {
  comment: IComment;
  depth?: number;
  isArchived: boolean;
  // eslint-disable-next-line no-unused-vars
  onReplyClick: (id: string, name: string) => void;
}

const CommentItem = ({
  comment,
  depth = 0,
  isArchived,
  onReplyClick,
}: CommentItemProps) => {
  return (
    <div
      className={`group ${
        depth > 0
          ? "ml-4 md:ml-12 mt-4 border-l-2 border-border/50 pl-4"
          : "mt-6"
      }`}
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

          {/* Comment Bubble  */}
          <div className="text-sm text-foreground/90 bg-muted/40 p-3 rounded-lg rounded-tl-none border border-border/50">
            <p className="whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          </div>

          {!isArchived && (
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() =>
                  onReplyClick(
                    comment._id,
                    comment.author.profile?.name || "User",
                  )
                }
                className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Reply className="h-3 w-3" /> Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recursively render child replies */}
      {comment?.replies && comment?.replies.length > 0 && (
        <div className="space-y-2">
          {comment?.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              isArchived={isArchived}
              onReplyClick={onReplyClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
