/**
 * Operational Health Check CLI
 *
 * Usage: npx tsx scripts/ops/health-check.ts
 */

import { getSystemStatus } from "@/lib/observability/system-status";

async function main() {
  console.log("🔍 Juanet System Health Check\n");

  const status = await getSystemStatus();

  console.log(`Overall Status: ${status.status.toUpperCase()}`);
  console.log(`Timestamp: ${status.timestamp}\n`);

  console.log("Components:");
  Object.entries(status.components).forEach(([name, healthy]) => {
    console.log(`  ${healthy ? "✅" : "❌"} ${name}`);
  });

  console.log("\nHealth Summary:");
  console.log(`  Supabase: ${status.health.supabase.healthy ? "OK" : "DOWN"}`);
  console.log(`  Recent Errors: ${status.health.errors.recentCount}`);

  if (status.status !== "ok") {
    console.log("\n⚠️  System is not fully healthy. Check logs.");
  } else {
    console.log("\n✅ All systems operational.");
  }
}

main().catch(console.error);
