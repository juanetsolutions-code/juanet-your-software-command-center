/**
 * Build-time Checks
 * Run during `npm run build` or CI to catch configuration issues early.
 */

import { validateEnvironment } from "./env-validation";

export function runBuildChecks(): void {
  console.log("[Deployment] Running build-time checks...");

  const env = validateEnvironment();

  if (!env.valid) {
    console.warn("[Deployment] Environment validation warnings:");
    env.warnings.forEach((w) => console.warn("  - " + w));
  } else {
    console.log("[Deployment] Environment looks good.");
  }

  // Future: add more static checks (feature flag schema, etc.)
  console.log("[Deployment] Build checks completed.");
}
