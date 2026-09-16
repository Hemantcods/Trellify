import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { acceptInvite } from "../invitation.api";

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(user);
  const handleAccept = async () => {
    if (!token) {
      setError("Invalid invitation link.");
      return;
    }
    try {
      setAccepting(true);
      setError(null);
      const data = await acceptInvite(token);
      navigate(`/organisations/${data.membership.organisationId}/boards`, {
        replace: true,
      });
    } catch (error) {
      setError(error?.response?.message || "Failed to accept invitation.");
    } finally {
      setAccepting(false)
    }
  };
  useEffect(() => {
    if (isLoading) return;
    if (!user && token) {
      const invitationPath = `invitations/${token}`;
      navigate(`/signin?redirect=/${encodeURIComponent(invitationPath)}`, {
        replace: true,
      });
    }
  }, [user, isLoading, token, navigate]);
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking invitation...</p>
      </div>
    );
  }
  if (!user) {
    return null;
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-sm">
        <div className="space-y-6 text-center">
          <div>
            <h1 className="text-2xl font-semibold">You're invited!</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              You've been invited to join an organisation.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/40 p-4 text-left">
            <p className="text-sm text-muted-foreground">Signed in as</p>

            <p className="font-medium">{user.name}</p>

            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-50"
          >
            {accepting ? "Joining..." : "Accept invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
