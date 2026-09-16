import { useEffect, useState } from "react";
import { BoardApi } from "../board.api";
import { Button } from "@/components/ui/button";
import { Building2, MoreVertical, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteDialog } from "../components/delete-Dialog";
import { CreateBoardDialog } from "../components/create-dialog";
import { isValidUUID } from "@/lib/validation";
import type { Board } from "shared";

export const BoardsPage = () => {
  const { orgId } = useParams();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      setIsDeleting(true);
      await BoardApi.deleteBoard(orgId!, selectedDeleteId);
      setDeleteOpen(false);
      setSelectedDeleteId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreate = async (data: { title: string }) => {
    try {
      const response = await BoardApi.createBoard(orgId!, data);
      setBoards((prev) => [...prev, response]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    const getBoards = async () => {
      try {
        const response = await BoardApi.getBoards(orgId!);
        setBoards(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getBoards();
  }, [orgId]);

  if (loading) {
    return <div>Loading boards</div>;
  }

  if (!isValidUUID(orgId)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Invalid organisation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The organisation link is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Boards</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Organise your projects and collaborate with your team.
            </p>
          </div>

          <Button
            variant="default"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Board
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/5" />
                  <Skeleton className="mt-2 h-4 w-full" />
                </CardHeader>

                <CardContent>
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && boards.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-semibold">No boards yet</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create your first board to start organising your projects.
              </p>

              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Board
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Boards */}
        {!loading && boards.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Card
                key={board.id}
                className="group transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => {
                  navigate(`/organisations/${orgId}/boards/${board.id}`);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <CardTitle className="">{board.title}</CardTitle>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 cursor-pointer"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                       <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                          Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeleteId(board.id);
                            setDeleteOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
        <CreateBoardDialog
          open={createOpen}
          onCreate={handleCreate}
          onOpenChange={setCreateOpen}
        />
      </div>
    </div>
  );
};