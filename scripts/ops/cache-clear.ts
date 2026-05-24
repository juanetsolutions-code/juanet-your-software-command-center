/**
 * Cache Clear CLI (Safe)
 *
 * Usage: npx tsx scripts/ops/cache-clear.ts
 */

import { clearAll } from "@/lib/dashboard/cache";

console.log("🧹 Clearing in-memory cache...");
clearAll();
console.log("✅ Cache cleared successfully (in-memory only).");
