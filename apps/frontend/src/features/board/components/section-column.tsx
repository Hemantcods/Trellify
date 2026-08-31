import { MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

export const SectionColumn = ({
  section,
  issues,
  orgId,
  boardId,
}: SectionColumnProps) => {
  return (
    <div className="flex min-h-[300px] flex-col rounded-lg border bg-muted/30">
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Rename section
            </DropdownMenuItem>

            <DropdownMenuItem>
              Delete section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Issues */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {issues.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No issues in this section
            </p>
          </div>
        ) : (
          issues.map((issue) => (
            <button
              key={issue.id}
              type="button"
              className="group w-full rounded-md border bg-background px-3 py-3 text-left transition hover:border-foreground/30 hover:shadow-sm"
              onClick={() => {
                // Navigate to issue page later
                console.log("Open issue:", issue.id);
              }}
            >
              <div className="flex items-start gap-2">
                {/* Drag handle */}
                <span className="mt-0.5 cursor-grab text-muted-foreground opacity-0 transition group-hover:opacity-100">
                  ⠿
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {issue.title}
                  </p>

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
              </div>
            </button>
          ))
        )}

        {/* Add Issue */}
        <Button
          variant="ghost"
          className="mt-1 justify-start text-muted-foreground hover:text-foreground"
          onClick={() => {
            console.log("Create issue in section:", section.id);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add issue
        </Button>
      </div>
    </div>
  );
};
