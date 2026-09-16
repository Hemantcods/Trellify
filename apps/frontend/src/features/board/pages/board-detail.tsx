import { useEffect, useState } from "react";
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

interface DummyBoard {
  id: string;
  title: string;
  organisationId: string;
}

const DUMMY_BOARD: DummyBoard = {
  id: "1",
  title: "Project Board",
  organisationId: "org-1",
};

const DUMMY_SECTIONS: Section[] = [
  {
    id: "s1",
    title: "Backlog",
    boardId: "1",
    position: 1,
  },
  {
    id: "s2",
    title: "In Progress",
    boardId: "1",
    position: 2,
  },
  {
    id: "s3",
    title: "Review",
    boardId: "1",
    position: 3,
  },
  {
    id: "s3",
    title: "Review",
    boardId: "1",
    position: 3,
  },
  {
    id: "s3",
    title: "Review",
    boardId: "1",
    position: 3,
  },
];

const DUMMY_ISSUES: Issue[] = [
  {
    id: "i1",
    title: "Setup project",
    description: "Initialize repo and CI pipeline",
    boardId: "1",
    sectionId: "s1",
    assignees: ["user-1", "user-2"],
  },
  {
    id: "i1",
    title: "Setup project",
    description: "Initialize repo and CI pipeline",
    boardId: "1",
    sectionId: "s1",
    assignees: ["user-1", "user-2"],
  },
  {
    id: "i2",
    title: "Fix login bug",
    description: "Users cannot sign in with Google",
    boardId: "1",
    sectionId: "s2",
    assignees: ["user-3"],
  },
  {
    id: "i3",
    title: "Update README",
    description: "Add contribution guidelines",
    boardId: "1",
    sectionId: "s3",
    assignees: [],
  },
];

export const BoardDetailPage = () => {
  const { orgId, boardId } = useParams();
  const [board, setBoard] = useState<DummyBoard | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const navigate = useNavigate();

  // Use dummy data instead of API calls
  useEffect(() => {
    setBoard(DUMMY_BOARD);
    setSections(DUMMY_SECTIONS);
    setLoading(false);
  }, []);

  const handleCreateSection = async (title: string) => {
    setSections((prev) => [
      ...prev,
      { id: Date.now().toString(), title, boardId: "1", position: prev.length },
    ]);
    setAddSectionOpen(false);
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
    return <div className="min-h-screen bg-background">Board not found</div>;
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

            <BoardPresence boardId={boardId } />
          </div>
        </div>

        {/* Sections Grid */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {sections.map((section) => (
            <div key={section.id} className="w-[320px] min-w-[320px]">
              <SectionColumn
                section={section}
                issues={DUMMY_ISSUES.filter(
                  (issue) => issue.sectionId === section.id,
                )}
                orgId={orgId!}
                boardId={board.id}
              />
            </div>
          ))}
        </div>

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

        {/* Delete Dialog */}
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
