import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string };
  };
  currentUserId?: string;
  onDelete?: (commentId: string) => void;
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export const CommentItem = ({ comment, currentUserId, onDelete }: CommentItemProps) => {
  const userName = comment.user?.name ?? "Unknown";
  const isOwn = currentUserId === comment.user?.id;

  return (
    <div className="group flex gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-xs">
          {getInitial(userName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(comment.createdAt)}
          </span>
          {isOwn && onDelete && (
            <button
              type="button"
              className="ml-auto text-xs text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </button>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
};
