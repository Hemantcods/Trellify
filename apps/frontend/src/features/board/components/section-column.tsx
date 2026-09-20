import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";

interface Section {
  id: string;
  title: string;
  boardId: string;
  position: number;
}

interface Issue {
  id: string;
  title: string;
  description: string | null;
  boardId: string;
  sectionId: string;
  assignees: string[];
}

interface SectionColumnProps {
  section: Section;
  issues: Issue[];
  orgId: string;
  boardId: string;
  onCreateIssue?: (sectionId: string, title: string) => void;
  onDeleteIssue?: (issueId: string) => void;
}

interface SortableIssueProps {
  issue: Issue;
  onDelete?: (issueId: string) => void;
  onClick?: () => void;
}

const SortableIssue = ({ issue, onDelete, onClick }: SortableIssueProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative w-full rounded-md border bg-background px-3 py-3 text-left transition hover:border-foreground/30 hover:shadow-sm ${
        isDragging ? "z-50 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab text-muted-foreground opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
        >
          ⠿
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{issue.title}</p>

          {issue.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {issue.description}
            </p>
          )}

          {/* Assignees */}
          {issue.assignees.length > 0 && (
            <div className="mt-2 flex items-center gap-1">
              {issue.assignees.map((assignee) => (
                <span
                  key={assignee}
                  className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {assignee}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            type="button"
            className="mt-0.5 opacity-0 transition group-hover:opacity-100 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(issue.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const SectionColumn = ({
  section,
  issues,
  orgId,
  boardId,
  onCreateIssue,
  onDeleteIssue,
}: SectionColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: section.id });
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const issueIds = issues.map((i) => i.id);

  const handleSubmit = () => {
    const trimmed = newTitle.trim();
    if (trimmed && onCreateIssue) {
      onCreateIssue(section.id, trimmed);
      setNewTitle("");
      setIsAdding(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[300px] flex-col rounded-lg border bg-muted/30 transition-colors ${
        isOver ? "border-primary/50 bg-primary/5" : ""
      }`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">{section.title}</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {issues.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Rename section</DropdownMenuItem>
            <DropdownMenuItem>Delete section</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Issues */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <SortableContext
          items={issueIds}
          strategy={verticalListSortingStrategy}
        >
          {issues.length === 0 && !isAdding ? (
            <div className="flex flex-1 items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No issues in this section
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <SortableIssue
                key={issue.id}
                issue={issue}
                onDelete={onDeleteIssue}
                onClick={() =>
                  navigate(`/organisations/${orgId}/boards/${boardId}/issues/${issue.id}`)
                }
              />
            ))
          )}
        </SortableContext>

        {/* Add Issue */}
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Issue title..."
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewTitle("");
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={handleSubmit}
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="mt-1 justify-start text-muted-foreground hover:text-foreground"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add issue
          </Button>
        )}
      </div>
    </div>
  );
};
