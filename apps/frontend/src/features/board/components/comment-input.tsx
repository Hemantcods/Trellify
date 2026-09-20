import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  disabled?: boolean;
}

export const CommentInput = ({ onSubmit, disabled }: CommentInputProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a comment..."
        className="min-h-[80px] resize-none text-sm"
        disabled={disabled}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Ctrl+Enter to send
        </span>
        <Button
          size="sm"
          disabled={!content.trim() || disabled}
          onClick={handleSubmit}
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          Send
        </Button>
      </div>
    </div>
  );
};
