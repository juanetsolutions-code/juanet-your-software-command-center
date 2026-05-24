/**
 * Diagnostics Report CLI
 *
 * Usage: npx tsx scripts/ops/diagnostics-report.ts
 */

import { getSystemStatus } from "@/lib/observability/system-status";
import { getRecentErrors } from "@/lib/monitoring/error-tracker";

async function main() {
  console.log("📋 Juanet Diagnostics Report\n");

  const status = await getSystemStatus();
  const errors = getRecentErrors(3);

  console.log("System Status:", status.status);
  console.log("Timestamp:", status.timestamp);

  console.log("\nRecent Errors:");
  if (errors.length === 0) {
    console.log("  None in recent history.");
  } else {
    errors.forEach((e) => console.log(`  - [${e.context}] ${e.message}`));
  }

  console.log("\nPerformance Snapshot:", JSON.stringify(status.performance, null, 2));

  console.log("\n✅ Diagnostics report generated.");
}

main().catch(console.error);
