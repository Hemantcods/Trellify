import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type CreateOrganisationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    name: string;
    description: string;
  }) => Promise<void>;
};

export const CreateOrganisationDialog = ({
  open,
  onOpenChange,
  onCreate,
}: CreateOrganisationDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setIsCreating(true);

      await onCreate({
        name: name.trim(),
        description: description.trim(),
      });

      setName("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (isCreating) return;

    if (!open) {
      setName("");
      setDescription("");
    }

    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Organisation</DialogTitle>
            <DialogDescription>
              Create an organisation to start collaborating with your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="organisation-name">
                Organisation name <span className="text-destructive">*</span>
              </Label>

              <Input
                id="organisation-name"
                placeholder="e.g. Acme Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isCreating}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organisation-description">
                Description
              </Label>

              <Textarea
                id="organisation-description"
                placeholder="What does your organisation do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreating}
                rows={4}
              />

              <p className="text-xs text-muted-foreground">
                You can change this later from organisation settings.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || isCreating}
              variant="default"
            >
              {isCreating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isCreating ? "Creating..." : "Create Organisation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};