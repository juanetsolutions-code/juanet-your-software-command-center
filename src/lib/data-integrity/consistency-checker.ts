/**
 * Consistency Checker
 * Runs a suite of integrity validators and returns a report.
 */

import {
  validateMissingProfiles,
  validateOrphanedRecords,
  validateTenantLinks,
} from "./validators";

export interface ConsistencyReport {
  timestamp: string;
  issues: Array<{ type: string; description: string; count: number }>;
  healthy: boolean;
}

export async function runConsistencyCheck(): Promise<ConsistencyReport> {
  const issues = [
    await validateMissingProfiles(),
    await validateOrphanedRecords(),
    await validateTenantLinks(),
  ];

  const hasProblems = issues.some((i) => i.count > 0);

  return {
    timestamp: new Date().toISOString(),
    issues: issues.map((i) => ({
      type: i.type,
      description: i.description,
      count: i.count,
    })),
    healthy: !hasProblems,
  };
}
