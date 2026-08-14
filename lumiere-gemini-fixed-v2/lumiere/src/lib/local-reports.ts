import type { Answers, SkinReport } from "./report.functions";

export interface StoredReport {
  id: string;
  created_at: string;
  answers: Answers;
  report: SkinReport;
}

const KEY = "lumiere.reports";

export function listLocalReports(): StoredReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredReport[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalReport(entry: StoredReport) {
  if (typeof window === "undefined") return;
  const all = [entry, ...listLocalReports()];
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function getLocalReport(id: string): StoredReport | undefined {
  return listLocalReports().find((r) => r.id === id);
}
