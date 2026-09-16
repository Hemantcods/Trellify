import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Kanban, Users } from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Organise with boards",
    description:
      "Create boards for each project and organise tasks into sections.",
  },
  {
    icon: Users,
    title: "Collaborate in real-time",
    description:
      "See who's viewing a board and work together with your team.",
  },
  {
    icon: CheckCircle,
    title: "Track progress",
    description:
      "Assign issues, set priorities, and track progress across sections.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <span className="text-lg font-semibold tracking-tight">
            Trello Clone
          </span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Manage projects<br />with your team
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A simple project management tool to organise tasks, collaborate in
            real-time, and keep your team on track.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">Start for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signin">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Trello Clone
      </footer>
    </div>
  );
}
