import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { OrganisationApi } from "@/features/organisation/organisation.api";
import { useAuth } from "@/features/auth/AuthContext";

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsCreating(true);
      setError(null);
      const response = await OrganisationApi.createBoard({
        name: name.trim(),
        description: description.trim(),
      });
      navigate(`/organisations/${response.data.id}/boards`, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Failed to create organisation. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </CardTitle>
          <CardDescription>
            Create your first organisation to get started with Trello Clone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">
                Organisation name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-name"
                placeholder="e.g. My Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isCreating}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                placeholder="What does your organisation do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreating}
                rows={3}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={isCreating}
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!name.trim() || isCreating}
              >
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isCreating ? "Creating..." : "Create Organisation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
