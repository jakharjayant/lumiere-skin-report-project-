import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateSkinReport, type Answers } from "@/lib/report.functions";
import { saveLocalReport } from "@/lib/local-reports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/questionnaire")({
  head: () => ({ meta: [{ title: "Skin intake — Lumière" }] }),
  component: Questionnaire,
});

const CONCERNS = [
  "Acne",
  "Dark spots / hyperpigmentation",
  "Redness / rosacea",
  "Dryness",
  "Oiliness",
  "Enlarged pores",
  "Fine lines / wrinkles",
  "Dullness",
  "Uneven texture",
  "Blackheads",
  "Dark circles",
  "Sensitivity / stinging",
];

type StepProps = { a: Answers; set: <K extends keyof Answers>(k: K, v: Answers[K]) => void };

const empty: Answers = {
  age: "",
  gender: "",
  skinType: "",
  concerns: [],
  sensitivity: "",
  allergies: "",
  medicalConditions: "",
  currentProducts: "",
  pastProducts: "",
  medicatedCare: "",
  sunExposure: "",
  waterIntake: "",
  sleep: "",
  diet: "",
  climate: "",
  routineFrequency: "",
  makeupUse: "",
  goals: "",
};

function Questionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(empty);
  const [submitting, setSubmitting] = useState(false);
  const gen = useServerFn(generateSkinReport);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((s) => ({ ...s, [k]: v }));

  const steps: Array<{ title: string; render: (p: StepProps) => React.ReactNode; valid: () => boolean }> = [
    {
      title: "About you",
      valid: () => !!a.age && !!a.skinType,
      render: ({ a, set }) => (
        <div className="space-y-5">
          <Field label="Age range">
            <RadioRow value={a.age} onChange={(v) => set("age", v)} options={["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"]} />
          </Field>
          <Field label="Gender (optional)">
            <RadioRow value={a.gender} onChange={(v) => set("gender", v)} options={["Female", "Male", "Non-binary", "Prefer not to say"]} />
          </Field>
          <Field label="How would you describe your skin type?">
            <RadioRow value={a.skinType} onChange={(v) => set("skinType", v)} options={["Oily", "Dry", "Combination", "Normal", "Not sure"]} />
          </Field>
        </div>
      ),
    },
    {
      title: "Concerns & sensitivity",
      valid: () => a.concerns.length > 0 && !!a.sensitivity,
      render: ({ a, set }) => (
        <div className="space-y-5">
          <Field label="What are your top skin concerns? (select all)">
            <div className="grid grid-cols-2 gap-2">
              {CONCERNS.map((c) => {
                const checked = a.concerns.includes(c);
                return (
                  <label
                    key={c}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                      checked ? "border-primary bg-secondary" : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        const on = v === true;
                        set(
                          "concerns",
                          on ? [...a.concerns, c] : a.concerns.filter((x) => x !== c),
                        );
                      }}
                    />
                    {c}
                  </label>
                );
              })}
            </div>
          </Field>
          <Field label="How sensitive is your skin?">
            <RadioRow value={a.sensitivity} onChange={(v) => set("sensitivity", v)} options={["Not sensitive", "Slightly", "Moderately", "Very sensitive"]} />
          </Field>
          <Field label="Known allergies (optional)">
            <Input value={a.allergies} onChange={(e) => set("allergies", e.target.value)} placeholder="e.g. fragrance, nickel" />
          </Field>
          <Field label="Any diagnosed skin conditions? (optional)">
            <Input value={a.medicalConditions} onChange={(e) => set("medicalConditions", e.target.value)} placeholder="e.g. eczema, rosacea, acne" />
          </Field>
        </div>
      ),
    },
    {
      title: "Products & history",
      valid: () => true,
      render: ({ a, set }) => (
        <div className="space-y-5">
          <Field label="What are you using right now?">
            <Textarea rows={3} value={a.currentProducts} onChange={(e) => set("currentProducts", e.target.value)} placeholder="Cleanser, moisturizer, sunscreen, serums…" />
          </Field>
          <Field label="Past products and how they worked for you">
            <Textarea rows={3} value={a.pastProducts} onChange={(e) => set("pastProducts", e.target.value)} placeholder="Brand + product — did it help, irritate, do nothing?" />
          </Field>
          <Field label="Any medicated or prescription skincare?">
            <Textarea rows={2} value={a.medicatedCare} onChange={(e) => set("medicatedCare", e.target.value)} placeholder="e.g. tretinoin, benzoyl peroxide, isotretinoin, antibiotics" />
          </Field>
        </div>
      ),
    },
    {
      title: "Lifestyle",
      valid: () => !!a.sunExposure && !!a.waterIntake && !!a.sleep && !!a.climate && !!a.routineFrequency && !!a.makeupUse,
      render: ({ a, set }) => (
        <div className="space-y-5">
          <Field label="Daily sun exposure">
            <RadioRow value={a.sunExposure} onChange={(v) => set("sunExposure", v)} options={["Rarely outdoors", "Some", "A lot"]} />
          </Field>
          <Field label="Water intake">
            <RadioRow value={a.waterIntake} onChange={(v) => set("waterIntake", v)} options={["Low", "Moderate", "High"]} />
          </Field>
          <Field label="Sleep">
            <RadioRow value={a.sleep} onChange={(v) => set("sleep", v)} options={["<5h", "5–7h", "7–9h"]} />
          </Field>
          <Field label="Climate you live in">
            <RadioRow value={a.climate} onChange={(v) => set("climate", v)} options={["Humid", "Dry", "Cold", "Hot", "Temperate"]} />
          </Field>
          <Field label="How often do you follow a skincare routine?">
            <RadioRow value={a.routineFrequency} onChange={(v) => set("routineFrequency", v)} options={["Rarely", "Sometimes", "Daily", "Twice daily"]} />
          </Field>
          <Field label="Makeup use">
            <RadioRow value={a.makeupUse} onChange={(v) => set("makeupUse", v)} options={["None", "Light", "Daily heavy"]} />
          </Field>
          <Field label="Diet notes (optional)">
            <Input value={a.diet} onChange={(e) => set("diet", e.target.value)} placeholder="e.g. dairy-heavy, high sugar, vegetarian" />
          </Field>
          <Field label="What are your goals?">
            <Textarea rows={2} value={a.goals} onChange={(e) => set("goals", e.target.value)} placeholder="e.g. clearer skin, fade dark spots, glow" />
          </Field>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  async function submit() {
    setSubmitting(true);
    try {
      const res = await gen({ data: a });
      const id = crypto.randomUUID();
      saveLocalReport({ id, created_at: new Date().toISOString(), answers: a, report: res.report });
      navigate({ to: "/report/$id", params: { id } });
    } catch (e) {
      console.error("Skin report generation failed:", e);
      toast.error(
        e instanceof Error
          ? e.message
          : "Failed to generate report. Check the server console for details.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{current.title}</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
        <h1 className="mb-6 text-3xl">{current.title}</h1>
        {current.render({ a, set })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
          className="rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button
            onClick={() => (current.valid() ? setStep((s) => s + 1) : toast.error("Please complete this step"))}
            className="rounded-full bg-gradient-primary text-primary-foreground shadow-soft"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => (current.valid() ? submit() : toast.error("Please complete this step"))}
            disabled={submitting}
            className="rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
          >
            {submitting ? "Analyzing your skin…" : (<><Sparkles className="mr-2 h-4 w-4" /> Generate my report</>)}
          </Button>
        )}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function RadioRow({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o}
          className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
            value === o ? "border-primary bg-secondary text-secondary-foreground" : "border-border bg-card hover:bg-muted"
          }`}
        >
          <RadioGroupItem value={o} className="sr-only" />
          {o}
        </label>
      ))}
    </RadioGroup>
  );
}