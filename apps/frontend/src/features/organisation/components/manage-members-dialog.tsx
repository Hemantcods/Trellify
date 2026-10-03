import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Users } from "lucide-react";
import { MembershipRoles } from "shared";
import { OrganisationApi, type OrganisationMember } from "../organisation.api";

type ManageMembersDialogProps = {
  orgId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const roleLabels: Record<MembershipRoles, string> = {
  [MembershipRoles.OWNER]: "Owner",
  [MembershipRoles.ADMIN]: "Admin",
  [MembershipRoles.MEMBER]: "Member",
};

const roleStyles: Record<MembershipRoles, string> = {
  [MembershipRoles.OWNER]: "bg-primary/10 text-primary",
  [MembershipRoles.ADMIN]: "bg-secondary text-secondary-foreground",
  [MembershipRoles.MEMBER]: "bg-muted text-muted-foreground",
};

function getInitial(name: string) {
  return (name ?? "").trim().charAt(0).toUpperCase() || "?";
}

function getErrorMessage(error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status;

  if (status === 403) {
    return "You do not have permission to view the members of this organisation.";
  }

  if (status === 404) {
    return "This organisation could not be found.";
  }

  return "Failed to load members. Please try again.";
}

const MemberRow = ({ member }: { member: OrganisationMember }) => (
  <div className="flex items-center gap-3 px-1 py-2.5">
    <Avatar className="h-9 w-9">
      <AvatarFallback>{getInitial(member.name)}</AvatarFallback>
    </Avatar>

    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">{member.name}</p>
      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
    </div>

    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
        roleStyles[member.role] ?? roleStyles[MembershipRoles.MEMBER]
      }`}
    >
      {roleLabels[member.role] ?? "Member"}
    </span>
  </div>
);

/**
 * Mounted only while the dialog is open - Radix unmounts `DialogContent` on
 * close, so every open starts from a clean loading state with no reset effect.
 */
const MembersList = ({ orgId }: { orgId: string }) => {
  const [members, setMembers] = useState<OrganisationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getMembers = async () => {
      try {
        const data = await OrganisationApi.getMembers(orgId);

        if (!cancelled) {
          setMembers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    getMembers();

    return () => {
      cancelled = true;
    };
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="space-y-4 py-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>

            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="max-w-xs text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>

        <div>
          <h3 className="text-sm font-semibold">No members yet</h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Members you invite to this organisation will show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {members.length} {members.length === 1 ? "member" : "members"}
      </p>

      <ScrollArea className="max-h-72 pr-3">
        <div className="divide-y">
          {members.map((member) => (
            <MemberRow key={member.userId} member={member} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const ManageMembersDialog = ({
  orgId,
  open,
  onOpenChange,
}: ManageMembersDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Manage Members</DialogTitle>
        <DialogDescription>
          Everyone who belongs to this organisation.
        </DialogDescription>
      </DialogHeader>

      {open && <MembersList orgId={orgId} />}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);