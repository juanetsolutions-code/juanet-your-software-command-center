/**
 * Repair Tools (Suggestions Only)
 * NEVER auto-fixes in production. Only provides safe, reviewable recommendations.
 */

import { runConsistencyCheck } from "./consistency-checker";

export interface RepairSuggestion {
  issue: string;
  recommendation: string;
  risk: "low" | "medium" | "high";
  script?: string; // future SQL or migration hint
}

export async function getRepairSuggestions(): Promise<RepairSuggestion[]> {
  const report = await runConsistencyCheck();
  const suggestions: RepairSuggestion[] = [];

  for (const issue of report.issues) {
    if (issue.count === 0) continue;

    if (issue.type === "missing_profiles") {
      suggestions.push({
        issue: issue.type,
        recommendation: "Run profile backfill migration or create missing profiles manually.",
        risk: "medium",
        script: "-- TODO: INSERT INTO profiles ...",
      });
    }

    if (issue.type === "orphaned_records") {
      suggestions.push({
        issue: issue.type,
        recommendation: "Review and re-assign or delete orphaned records via admin console.",
        risk: "high",
      });
    }

    if (issue.type === "tenant_links") {
      suggestions.push({
        issue: issue.type,
        recommendation: "Attach records to a valid organization via update queries.",
        risk: "medium",
      });
    }
  }

  return suggestions;
}
