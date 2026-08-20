import { useEffect, useState } from "react";
import { OrganisationApi } from "../organisation.api";
import { Button } from "@/components/ui/button";
import { Building2, MoreVertical, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useNavigate } from "react-router-dom";
import { DeleteDialog } from "../components/delete-Dialog";
import type { CreateOrganisationInput } from "shared";
import { CreateOrganisationDialog } from "../components/create-dialog";
type Organisation = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export const OrganisationsPage = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDeleteId, setSelectedDeleteID] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      setIsDeleting(true);
      await OrganisationApi.deleteOrg(selectedDeleteId);
      setDeleteOpen(false);
      setSelectedDeleteID(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCreate = async (data: CreateOrganisationInput) => {
    try {
      const response = await OrganisationApi.createBoard(data);
      setOrganisations((prev) => [...prev, response.data]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  console.log(isDeleting);
  useEffect(() => {
    const getOrgs = async () => {
      try {
        const response = await OrganisationApi.getAllOrgs();
        setOrganisations(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getOrgs();
  }, []);
  if (loading) {
    return <div>Loadinf Organisatios</div>;
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organisations</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your organisations and collaborate with your team.
            </p>
          </div>

          <Button
            className="border text-white bg-black cursor-pointer"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Organisation
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
        {!loading && organisations.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-semibold">No organisations yet</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create your first organisation to start collaborating with your
                team.
              </p>

              <Button
                className="mt-6 hover:bg-neutral-200"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Organisation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Organisations */}
        {!loading && organisations.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {organisations.map((organisation) => (
              <Card
                key={organisation.id}
                className="group transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => {
                  navigate(`/organisations/${organisation.id}`);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <CardTitle className="">{organisation.name}</CardTitle>
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

                      <DropdownMenuContent className="bg-white" align="start">
                        <DropdownMenuItem className="hover:bg-neutral-200">
                          Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive hover:bg-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeleteID(organisation.id);
                            setDeleteOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardDescription className="line-clamp-2">
                    {organisation.description || "No description provided."}
                  </CardDescription>
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
        <CreateOrganisationDialog
          open={createOpen}
          onCreate={handleCreate}
          onOpenChange={setCreateOpen}
        />
      </div>
    </div>
  );
};
