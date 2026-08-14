import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callGeminiAI } from "./ai-gateway.server";

const AnswersSchema = z.object({
  age: z.string().max(20),
  gender: z.string().max(30).optional().default(""),
  skinType: z.string().max(40),
  concerns: z.array(z.string().max(60)).max(15),
  sensitivity: z.string().max(40),
  allergies: z.string().max(500).optional().default(""),
  medicalConditions: z.string().max(500).optional().default(""),
  currentProducts: z.string().max(1000).optional().default(""),
  pastProducts: z.string().max(1000).optional().default(""),
  medicatedCare: z.string().max(500).optional().default(""),
  sunExposure: z.string().max(40),
  waterIntake: z.string().max(40),
  sleep: z.string().max(40),
  diet: z.string().max(300).optional().default(""),
  climate: z.string().max(40),
  routineFrequency: z.string().max(40),
  makeupUse: z.string().max(40),
  goals: z.string().max(500).optional().default(""),
});

export type Answers = z.infer<typeof AnswersSchema>;

export interface SkinReport {
  summary: string;
  skinProfile: string;
  strengths: string[];
  concerns: string[];
  avoidIngredients: Array<{ name: string; reason: string }>;
  beneficialIngredients: Array<{ name: string; reason: string }>;
  routine: {
    morning: string[];
    evening: string[];
    weekly: string[];
  };
  productRecommendations: Array<{
    category: string;
    suggestion: string;
    howToUse: string;
    keyIngredients: string[];
  }>;
  lifestyleTips: string[];
  cautions: string[];
}


const SKIN_REPORT_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    summary: { type: "string" },
    skinProfile: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    concerns: { type: "array", items: { type: "string" } },
    avoidIngredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          reason: { type: "string" },
        },
        required: ["name", "reason"],
      },
    },
    beneficialIngredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          reason: { type: "string" },
        },
        required: ["name", "reason"],
      },
    },
    routine: {
      type: "object",
      properties: {
        morning: { type: "array", items: { type: "string" } },
        evening: { type: "array", items: { type: "string" } },
        weekly: { type: "array", items: { type: "string" } },
      },
      required: ["morning", "evening", "weekly"],
    },
    productRecommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          suggestion: { type: "string" },
          howToUse: { type: "string" },
          keyIngredients: { type: "array", items: { type: "string" } },
        },
        required: ["category", "suggestion", "howToUse", "keyIngredients"],
      },
    },
    lifestyleTips: { type: "array", items: { type: "string" } },
    cautions: { type: "array", items: { type: "string" } },
  },
  required: [
    "summary",
    "skinProfile",
    "strengths",
    "concerns",
    "avoidIngredients",
    "beneficialIngredients",
    "routine",
    "productRecommendations",
    "lifestyleTips",
    "cautions",
  ],
};

const SYSTEM_PROMPT = `You are an expert board-certified dermatologist and cosmetic chemist.
You will receive a detailed intake about a user's skin. Produce a personalized, evidence-based skin report.
Be specific, practical and gentle. Do NOT diagnose diseases. Recommend seeing a real dermatologist for medical concerns.
Return STRICT JSON matching this TypeScript type (no markdown, no commentary):

{
  "summary": string, // 2-3 sentence overview
  "skinProfile": string, // e.g. "Combination, dehydrated, moderately sensitive"
  "strengths": string[], // 2-4 items
  "concerns": string[], // 2-6 items
  "avoidIngredients": [{ "name": string, "reason": string }], // 4-8 items
  "beneficialIngredients": [{ "name": string, "reason": string }], // 5-10 items
  "routine": {
    "morning": string[], // ordered steps
    "evening": string[],
    "weekly": string[]
  },
  "productRecommendations": [
    { "category": string, "suggestion": string, "howToUse": string, "keyIngredients": string[] }
  ], // 5-8 items across cleanser, toner/essence, serum, moisturizer, SPF, treatment, mask
  "lifestyleTips": string[], // 3-6 items
  "cautions": string[] // things unique to this user to watch out for
}`;

export const generateSkinReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnswersSchema.parse(input))
  .handler(async ({ data }) => {
    const userPrompt = `Patient intake:\n${JSON.stringify(data, null, 2)}\n\nGenerate the JSON skin report now.`;
    const raw = await callGeminiAI({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      responseSchema: SKIN_REPORT_JSON_SCHEMA,
    });
    let report: SkinReport;
    try {
      report = JSON.parse(raw) as SkinReport;
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned invalid JSON");
      report = JSON.parse(match[0]) as SkinReport;
    }
    return { report };
  });
