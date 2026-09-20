import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentItem } from "./comment-item";
import type { Comment } from "../issue.api";

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  onDelete?: (commentId: string) => void;
}

export const CommentList = ({ comments, currentUserId, onDelete }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to comment.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[400px]">
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
