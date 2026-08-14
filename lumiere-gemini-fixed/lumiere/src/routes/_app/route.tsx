import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-primary shadow-soft" />
            <span className="font-display text-xl">Lumière</span>
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-foreground">
            My reports
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
