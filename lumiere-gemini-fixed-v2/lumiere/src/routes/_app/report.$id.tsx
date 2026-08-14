import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLocalReport, type StoredReport } from "@/lib/local-reports";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, Sun, Moon, CalendarDays, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_app/report/$id")({
  head: () => ({ meta: [{ title: "Your skin report — Lumière" }] }),
  component: ReportPage,
});

function ReportPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<StoredReport | null | undefined>(undefined);
  useEffect(() => setData(getLocalReport(id) ?? null), [id]);
  const isLoading = data === undefined;
  const error = data === null;

  if (isLoading) return <main className="mx-auto max-w-4xl px-6 py-16 text-center text-muted-foreground">Loading your report…</main>;
  if (error || !data) return <main className="mx-auto max-w-4xl px-6 py-16 text-center text-destructive">Couldn't load this report.</main>;

  const r = data.report;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to reports
      </Link>

      <div className="rounded-3xl bg-hero p-8 shadow-glow">
        <span className="inline-flex items-center gap-2 rounded-full bg-card/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" /> Your skin report
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl">{r.skinProfile}</h1>
        <p className="mt-3 max-w-2xl text-foreground/80">{r.summary}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Strengths" icon={<CheckCircle2 className="h-5 w-5 text-primary" />}>
          <ul className="space-y-2 text-sm">
            {r.strengths.map((s) => (<li key={s} className="flex gap-2"><span className="text-primary">•</span>{s}</li>))}
          </ul>
        </Card>
        <Card title="Concerns to address" icon={<AlertCircle className="h-5 w-5 text-destructive" />}>
          <ul className="space-y-2 text-sm">
            {r.concerns.map((s) => (<li key={s} className="flex gap-2"><span className="text-destructive">•</span>{s}</li>))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Ingredients to seek" icon={<CheckCircle2 className="h-5 w-5 text-primary" />}>
          <ul className="space-y-3 text-sm">
            {r.beneficialIngredients.map((i) => (
              <li key={i.name} className="rounded-xl bg-secondary/60 p-3">
                <div className="font-medium text-secondary-foreground">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.reason}</div>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Ingredients to avoid" icon={<XCircle className="h-5 w-5 text-destructive" />}>
          <ul className="space-y-3 text-sm">
            {r.avoidIngredients.map((i) => (
              <li key={i.name} className="rounded-xl bg-muted p-3">
                <div className="font-medium text-foreground">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.reason}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card title="Morning" icon={<Sun className="h-5 w-5 text-primary" />}>
          <ol className="list-decimal space-y-1 pl-5 text-sm">{r.routine.morning.map((x) => <li key={x}>{x}</li>)}</ol>
        </Card>
        <Card title="Evening" icon={<Moon className="h-5 w-5 text-primary" />}>
          <ol className="list-decimal space-y-1 pl-5 text-sm">{r.routine.evening.map((x) => <li key={x}>{x}</li>)}</ol>
        </Card>
        <Card title="Weekly" icon={<CalendarDays className="h-5 w-5 text-primary" />}>
          <ol className="list-decimal space-y-1 pl-5 text-sm">{r.routine.weekly.map((x) => <li key={x}>{x}</li>)}</ol>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-3xl">Products for you</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {r.productRecommendations.map((p) => (
            <div key={p.category + p.suggestion} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
              <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">{p.category}</div>
              <div className="mb-2 text-lg font-medium">{p.suggestion}</div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {p.keyIngredients.map((k) => (
                  <span key={k} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{k}</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">How to use: </span>{p.howToUse}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Lifestyle tips" icon={<Sparkles className="h-5 w-5 text-primary" />}>
          <ul className="space-y-2 text-sm">{r.lifestyleTips.map((s) => <li key={s} className="flex gap-2"><span className="text-primary">•</span>{s}</li>)}</ul>
        </Card>
        <Card title="Watch out for" icon={<AlertCircle className="h-5 w-5 text-destructive" />}>
          <ul className="space-y-2 text-sm">{r.cautions.map((s) => <li key={s} className="flex gap-2"><span className="text-destructive">•</span>{s}</li>)}</ul>
        </Card>
      </div>

      <p className="mt-8 rounded-2xl bg-muted p-4 text-center text-xs text-muted-foreground">
        Lumière provides general skincare guidance and is not a substitute for professional medical advice.
        For persistent or severe skin concerns, please consult a dermatologist.
      </p>

      <div className="mt-6 flex justify-center">
        <Link to="/questionnaire">
          <Button variant="outline" className="rounded-full">Update my intake</Button>
        </Link>
      </div>
    </main>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
}