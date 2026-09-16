import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-muted-foreground">
        404
      </h1>
      <p className="text-lg text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Button variant="default" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </Button>
    </div>
  );
};
