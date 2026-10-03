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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  UserPlus,
  Users,
} from "lucide-react";
import { inviteEmailSchema, MembershipRoles } from "shared";
import { OrganisationApi, type OrganisationMember } from "../organisation.api";
import { inviteMember } from "@/features/invitations/invitation.api";

type ManageMembersDialogProps = {
  orgId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canInvite: boolean;
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

/**
 * The backend messages are typo-ridden ("permisstion", "alredy"), so map the
 * known ones to clean copy instead of echoing them.
 */
const inviteErrorMessages: { match: RegExp; message: string }[] = [
  {
    match: /already a member/i,
    message: "That person is already a member of this organisation.",
  },
  {
    match: /pending invitation/i,
    message: "An invitation is already pending for that email address.",
  },
  {
    match: /not a member/i,
    message: "You are not a member of this organisation.",
  },
  {
    match: /permission|permisstion/i,
    message: "Only the owner or an admin can invite members.",
  },
];

function getInitial(name: string) {
  return (name ?? "").trim().charAt(0).toUpperCase() || "?";
}

function getMembersErrorMessage(error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status;

  if (status === 403) {
    return "Only the owner or an admin can view the members of this organisation.";
  }

  if (status === 404) {
    return "This organisation could not be found.";
  }

  return "Failed to load members. Please try again.";
}

function getInviteErrorMessage(errors: unknown, status?: number) {
  const text = typeof errors === "string" ? errors : "";

  if (text) {
    const known = inviteErrorMessages.find(({ match }) => match.test(text));

    if (known) {
      return known.message;
    }
  }

  if (status === 403) {
    return "Only the owner or an admin can invite members.";
  }

  if (status === 409) {
    return "That invitation could not be created. They may already be a member or already have a pending invitation.";
  }

  return "Failed to send the invitation. Please try again.";
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
 * Only mounted while the dialog is open - Radix unmounts `DialogContent` on
 * close, so each open starts on the members view with a clean form.
 */
const MembersPanel = ({
  orgId,
  canInvite,
  onClose,
}: {
  orgId: string;
  canInvite: boolean;
  onClose: () => void;
}) => {
  const [view, setView] = useState<"members" | "invite">("members");

  const [members, setMembers] = useState<OrganisationMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

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
          setMembersError(getMembersErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMembers(false);
        }
      }
    };

    getMembers();

    return () => {
      cancelled = true;
    };
  }, [orgId]);

  const resetForm = () => {
    setFormError(null);
    setSentTo(null);
    setEmail("");
  };

  const showInviteForm = () => {
    resetForm();
    setView("invite");
  };

  const showMembers = () => {
    resetForm();
    setView("members");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = inviteEmailSchema.safeParse({ email });

    if (!parsed.success) {
      setFormError("Enter a valid email address.");
      return;
    }

    try {
      setIsSending(true);
      setFormError(null);

      const response = await inviteMember(orgId, parsed.data.email);

      if (!response.success) {
        setFormError(getInviteErrorMessage(response.errors));
        return;
      }

      setSentTo(response.data?.email ?? parsed.data.email);
      setEmail("");
    } catch (err) {
      console.error(err);

      const httpError = (
        err as { response?: { status?: number; data?: { errors?: unknown } } }
      ).response;

      setFormError(
        getInviteErrorMessage(httpError?.data?.errors, httpError?.status),
      );
    } finally {
      setIsSending(false);
    }
  };

  if (view === "invite") {
    return (
      <form onSubmit={handleSend}>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            We will email them a link to join this organisation.
          </DialogDescription>
        </DialogHeader>

        {sentTo ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-9 w-9 text-primary" />

            <div>
              <h3 className="text-sm font-semibold">Invitation sent</h3>
              <p className="mt-1 max-w-xs break-all text-sm text-muted-foreground">
                {sentTo} has 7 days to accept it.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>

              <Input
                id="invite-email"
                type="email"
                placeholder="e.g. teammate@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending}
                autoFocus
              />
            </div>

            {formError && (
              <p className="flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {formError}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              They must be signed in with this exact email address to accept.
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={showMembers}
            disabled={isSending}
          >
            {sentTo ? (
              "Back to members"
            ) : (
              <>
                <ArrowLeft className="h-4 w-4" />
                Back
              </>
            )}
          </Button>

          {!sentTo && (
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSending || !email.trim()}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {isSending ? "Sending..." : "Send Invitation"}
            </Button>
          )}
        </DialogFooter>
      </form>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Manage Members</DialogTitle>
        <DialogDescription>
          Everyone who belongs to this organisation.
        </DialogDescription>
      </DialogHeader>

      {isLoadingMembers && (
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
      )}

      {!isLoadingMembers && membersError && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="max-w-xs text-sm text-muted-foreground">{membersError}</p>
        </div>
      )}

      {!isLoadingMembers && !membersError && members.length === 0 && (
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
      )}

      {!isLoadingMembers && !membersError && members.length > 0 && (
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
      )}

      <DialogFooter className={canInvite ? "sm:justify-between" : undefined}>
        {canInvite && (
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={showInviteForm}
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogFooter>
    </>
  );
};

export const ManageMembersDialog = ({
  orgId,
  open,
  onOpenChange,
  canInvite,
}: ManageMembersDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-lg">
      {open && (
        <MembersPanel
          orgId={orgId}
          canInvite={canInvite}
          onClose={() => onOpenChange(false)}
        />
      )}
    </DialogContent>
  </Dialog>
);