import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, FlaskConical, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumière — AI skin analysis & personal skincare report" },
      { name: "description", content: "Answer a dermatologist-style intake and get a personal skin report: ingredients to seek, ones to avoid, and a routine made for you." },
      { property: "og:title", content: "Lumière — AI skin analysis & personal skincare report" },
      { property: "og:description", content: "A personal skin report with ingredient guidance and a routine matched to your skin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-primary shadow-soft" />
          <span className="font-display text-2xl font-semibold text-foreground">Lumière</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-foreground">
            My reports
          </Link>
          <Link to="/questionnaire">
            <Button size="sm" className="rounded-full bg-gradient-primary text-primary-foreground shadow-soft">
              Get started
            </Button>
          </Link>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero opacity-70" />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/60 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> AI‑powered skin analysis
            </span>
            <h1 className="text-5xl leading-tight text-foreground md:text-6xl">
              A skin report as thoughtful as a dermatologist visit.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Answer a short intake about your skin, history and routine. Receive a personal report
              with the ingredients that suit you — and the ones to avoid.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/questionnaire">
                <Button size="lg" className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                  Start my report <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-primary opacity-20 blur-3xl" />
            <div className="rounded-[2rem] border border-border/60 bg-card p-8 shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Sample report</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                  Combination · Sensitive
                </span>
              </div>
              <h3 className="mb-4 text-2xl">Your skin at a glance</h3>
              <div className="space-y-3">
                {[
                  ["Seek", "Niacinamide, Ceramides, Panthenol", "text-primary"],
                  ["Avoid", "Fragrance, Denatured alcohol", "text-destructive"],
                  ["Routine", "AM: gentle cleanser → serum → SPF 50", "text-foreground"],
                ].map(([label, val, cls]) => (
                  <div key={label} className="rounded-2xl bg-muted/60 p-4">
                    <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                    <div className={`text-sm font-medium ${cls}`}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: HeartHandshake, title: "Deep intake", body: "Skin type, past products, sensitivities, lifestyle — the full picture." },
            { icon: FlaskConical, title: "Ingredient guidance", body: "Chemicals that help your skin, and the ones you should skip." },
            { icon: Sparkles, title: "Personal routine", body: "A morning and evening routine matched to what your skin needs." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lumière · Not a substitute for medical advice.
      </footer>
    </div>
  );
}
