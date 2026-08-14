import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listLocalReports, type StoredReport } from "@/lib/local-reports";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Plus, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Your reports — Lumière" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<StoredReport[] | null>(null);
  useEffect(() => setData(listLocalReports()), []);
  const isLoading = data === null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl">Your skin, understood.</h1>
          <p className="mt-2 text-muted-foreground">Generate a new report or revisit a past one.</p>
        </div>
        <Button
          onClick={() => navigate({ to: "/questionnaire" })}
          className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
        >
          <Plus className="mr-2 h-4 w-4" /> New report
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-border/60 bg-card p-10 text-center text-muted-foreground shadow-soft">
          Loading…
        </div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-3xl border border-border/60 bg-card p-12 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-2xl">Start your first skin report</h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
            Answer a short dermatologist‑style intake. We'll generate your ingredient guide and a
            personalized routine.
          </p>
          <Button
            onClick={() => navigate({ to: "/questionnaire" })}
            className="rounded-full bg-gradient-primary text-primary-foreground shadow-soft"
          >
            Begin intake <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((r) => (
            <Link
              key={r.id}
              to="/report/$id"
              params={{ id: r.id }}
              className="group rounded-3xl border border-border/60 bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                <span>{new Date(r.created_at).toLocaleDateString()}</span>
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="mb-2 text-xl">{r.report.skinProfile}</h3>
              <p className="line-clamp-3 text-sm text-muted-foreground">{r.report.summary}</p>
              <div className="mt-4 text-sm font-medium text-primary group-hover:underline">
                Open report →
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}