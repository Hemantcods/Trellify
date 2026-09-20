import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { isValidUUID } from "@/lib/validation";
import { DeleteDialog } from "../components/delete-Dialog";
import { CreateBoardDialog } from "../components/create-dialog";
import { SectionColumn } from "../components/section-column";
import { AddSectionDialog } from "../components/add-section-dialog";
import { BoardPresence } from "../components/BoardPresence";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useBoardSocket } from "../hooks/useBoardSocket";
import { IssueApi, type Issue } from "../issue.api";
import { SectionApi, type Section } from "../section.api";
import { BoardApi } from "../board.api";

export const BoardDetailPage = () => {
  const { orgId, boardId } = useParams();
  const [board, setBoard] = useState<{ id: string; title: string; organisationId: string } | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const navigate = useNavigate();

  const { users, connected, send, subscribe } = useBoardSocket(boardId || "");

  // Load board data from API
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const [boardData, sectionsData, issuesData] = await Promise.all([
          BoardApi.getBoardById(orgId!, boardId!),
          SectionApi.getSections(boardId!),
          IssueApi.getIssuesByBoard(boardId!),
        ]);
        setBoard(boardData || null);
        setSections(sectionsData || []);
        setIssues(issuesData || []);
      } catch (error) {
        console.error("Failed to load board:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [orgId, boardId]);

  // Handle incoming WebSocket events from other users
  const handleSocketEvent = useCallback(
    (data: any) => {
      switch (data.type) {
        case "issue:created": {
          setIssues((prev) => [...prev, data.issue]);
          break;
        }
        case "issue:updated": {
          setIssues((prev) =>
            prev.map((i) =>
              i.id === data.issueId ? { ...i, ...data.changes } : i,
            ),
          );
          break;
        }
        case "issue:deleted": {
          setIssues((prev) => prev.filter((i) => i.id !== data.issueId));
          break;
        }
        case "issue:moved": {
          setIssues((prev) =>
            prev.map((i) =>
              i.id === data.issueId
                ? { ...i, sectionId: data.toSectionId, position: data.newPosition }
                : i,
            ),
          );
          break;
        }
        case "section:created": {
          setSections((prev) => [...prev, data.section]);
          break;
        }
        case "section:updated": {
          setSections((prev) =>
            prev.map((s) =>
              s.id === data.sectionId ? { ...s, ...data.changes } : s,
            ),
          );
          break;
        }
        case "section:deleted": {
          setSections((prev) => prev.filter((s) => s.id !== data.sectionId));
          break;
        }
      }
    },
    [],
  );

  // Subscribe to WebSocket events
  useEffect(() => {
    const unsubscribe = subscribe(handleSocketEvent);
    return unsubscribe;
  }, [subscribe, handleSocketEvent]);

  // Drag-and-drop handler with API + WebSocket broadcast
  const handleDragEnd = async (event: {
    active: { id: string | number };
    over: { id: string | number } | null;
  }) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeIssue = issues.find((i) => i.id === activeId);
    if (!activeIssue) return;

    const overSection = sections.find((s) => s.id === overId);
    const overIssue = issues.find((i) => i.id === overId);

    let targetSectionId: string;
    let targetIndex: number;

    if (overSection) {
      targetSectionId = overSection.id;
      const sectionIssues = issues.filter(
        (i) => i.sectionId === targetSectionId && i.id !== activeId,
      );
      targetIndex = sectionIssues.length;
    } else if (overIssue) {
      targetSectionId = overIssue.sectionId;
      const sectionIssues = issues.filter(
        (i) => i.sectionId === targetSectionId && i.id !== activeId,
      );
      targetIndex = sectionIssues.findIndex((i) => i.id === overId);
    } else {
      return;
    }

    const fromSectionId = activeIssue.sectionId;

    // 1. Optimistic UI update
    setIssues((prev) => {
      const others = prev.filter((i) => i.id !== activeId);
      const movedIssue = { ...activeIssue, sectionId: targetSectionId };
      const targetSectionIssues = others.filter(
        (i) => i.sectionId === targetSectionId,
      );
      const restOfIssues = others.filter(
        (i) => i.sectionId !== targetSectionId,
      );
      targetSectionIssues.splice(targetIndex, 0, movedIssue);
      return [...restOfIssues, ...targetSectionIssues];
    });

    // 2. API call to persist in DB
    try {
      await IssueApi.updateIssue(activeId, {
        sectionId: targetSectionId,
        position: targetIndex,
      });

      // 3. WebSocket broadcast to other users
      send({
        type: "issue:moved",
        issueId: activeId,
        fromSectionId,
        toSectionId: targetSectionId,
        newPosition: targetIndex,
      });
    } catch (error) {
      console.error("Failed to move issue:", error);
    }
  };

  // Create issue handler
  const handleCreateIssue = async (sectionId: string, title: string) => {
    try {
      const newIssue = await IssueApi.createIssue(sectionId, { title });
      setIssues((prev) => [...prev, newIssue]);
      send({ type: "issue:created", issue: newIssue });
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  // Delete issue handler
  const handleDeleteIssue = async (issueId: string) => {
    try {
      await IssueApi.deleteIssue(issueId);
      setIssues((prev) => prev.filter((i) => i.id !== issueId));
      send({ type: "issue:deleted", issueId });
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  // Create section handler
  const handleCreateSection = async (title: string) => {
    try {
      const newSection = await SectionApi.createSection(boardId!, { title });
      setSections((prev) => [...prev, newSection]);
      send({ type: "section:created", section: newSection });
      setAddSectionOpen(false);
    } catch (error) {
      console.error("Failed to create section:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div>Loading board details</div>
        </div>
      </div>
    );
  }

  if (!isValidUUID(orgId) || !isValidUUID(boardId)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold">Invalid board link</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The board link is invalid.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div>Loading board...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Board Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{board.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Organise your projects and collaborate with your team.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
              />
              {connected ? "Connected" : "Disconnected"}
            </div>

            <Button
              className="border text-white bg-black cursor-pointer"
              onClick={() => setAddSectionOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>

            <Button
              className="border text-white bg-black cursor-pointer"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Board
            </Button>

            <BoardPresence boardId={boardId} />
          </div>
        </div>

        {/* Sections Grid */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {sections.map((section) => (
              <div key={section.id} className="w-[320px] min-w-[320px]">
                <SectionColumn
                  section={section}
                  issues={issues.filter(
                    (issue) => issue.sectionId === section.id,
                  )}
                  orgId={orgId!}
                  boardId={board.id}
                  onCreateIssue={handleCreateIssue}
                  onDeleteIssue={handleDeleteIssue}
                />
              </div>
            ))}
          </div>
        </DndContext>

        {/* Empty state */}
        {sections.length === 0 && (
          <Card className="border-dashed col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold">No sections yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first section to start organising tasks.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setAddSectionOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={() => {}}
          isDeleting={false}
        />
        <CreateBoardDialog
          open={createOpen}
          onCreate={() => {}}
          onOpenChange={setCreateOpen}
        />
        <AddSectionDialog
          open={addSectionOpen}
          onOpenChange={setAddSectionOpen}
          onCreate={handleCreateSection}
        />
      </div>
    </div>
  );
};
