import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

type AddSectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (title: string) => Promise<void>;
};

export const AddSectionDialog = ({
  open,
  onOpenChange,
  onCreate,
}: AddSectionDialogProps) => {
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setIsCreating(true);

      await onCreate(title.trim());

      setTitle("");
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
      setTitle("");
    }

    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125 bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Give your section a name to organise tasks.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <label htmlFor="section-name">
                Section name <span className="text-destructive">*</span>
              </label>

              <Input
                id="section-name"
                placeholder="e.g. Backlog"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isCreating}
                autoFocus
              />
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
              disabled={!title.trim() || isCreating}
              className="bg-black text-white hover:bg-black/90"
            >
              {isCreating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isCreating ? "Creating..." : "Create Section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};