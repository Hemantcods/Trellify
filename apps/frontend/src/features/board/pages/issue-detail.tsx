import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IssueApi, type IssueDetail, type Comment } from "../issue.api";
import { useBoardSocket } from "../hooks/useBoardSocket";
import { CommentList } from "../components/comment-list";
import { CommentInput } from "../components/comment-input";

export const IssueDetailPage = () => {
  const { orgId, boardId, issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<IssueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const { send, subscribe } = useBoardSocket(boardId || "");

  // Load issue detail
  useEffect(() => {
    const loadIssue = async () => {
      try {
        const data = await IssueApi.getIssueById(issueId!);
        setIssue(data);
      } catch (error) {
        console.error("Failed to load issue:", error);
      } finally {
        setLoading(false);
      }
    };
    loadIssue();
  }, [issueId]);

  // Handle incoming WebSocket comment events
  const handleSocketEvent = useCallback(
    (data: any) => {
      if (data.type === "comment:created" && data.issueId === issueId) {
        setIssue((prev) => {
          if (!prev) return prev;
          // Avoid duplicates
          if (prev.comments.some((c) => c.id === data.comment.id)) return prev;
          return {
            ...prev,
            comments: [...prev.comments, data.comment],
          };
        });
      }
      if (data.type === "comment:deleted" && data.issueId === issueId) {
        setIssue((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: prev.comments.filter((c) => c.id !== data.commentId),
          };
        });
      }
    },
    [issueId],
  );

  useEffect(() => {
    const unsubscribe = subscribe(handleSocketEvent);
    return unsubscribe;
  }, [subscribe, handleSocketEvent]);

  // Create comment
  const handleCreateComment = async (content: string) => {
    if (!issue) return;
    setSending(true);
    try {
      const comment = await IssueApi.createComment(issue.id, { content });
      setIssue((prev) => {
        if (!prev) return prev;
        return { ...prev, comments: [...prev.comments, comment] };
      });
      send({ type: "comment:created", issueId: issue.id, comment });
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setSending(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!issue) return;
    try {
      await IssueApi.deleteComment(commentId);
      setIssue((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.filter((c) => c.id !== commentId),
        };
      });
      send({ type: "comment:deleted", issueId: issue.id, commentId });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div>Loading issue...</div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div>Issue not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to board
          </Button>

          <h1 className="text-2xl font-bold tracking-tight">{issue.title}</h1>

          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <span>Section: {issue.sectionId}</span>
            {issue.assignees.length > 0 && (
              <>
                <span>·</span>
                <span>
                  {issue.assignees.length} assignee{issue.assignees.length > 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Description */}
        <div className="mb-8">
          <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
            Description
          </h2>
          {issue.description ? (
            <p className="whitespace-pre-wrap text-sm">{issue.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No description provided.
            </p>
          )}
        </div>

        <Separator className="my-6" />

        {/* Comments */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Comments ({issue.comments?.length ?? 0})
            </h2>
          </div>

          <CommentList
            comments={issue.comments ?? []}
            onDelete={handleDeleteComment}
          />

          <div className="mt-4">
            <CommentInput onSubmit={handleCreateComment} disabled={sending} />
          </div>
        </div>
      </div>
    </div>
  );
};
