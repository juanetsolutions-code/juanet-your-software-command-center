/**
 * AI Policy Enforcement.
 */

export function enforceAIPolicy(tenantId: string, action: string): boolean {
  // Placeholder for future policy rules (e.g., disabled for certain tenants)
  if (action === "ai_agent_mode" && tenantId.startsWith("restricted-")) {
    return false;
  }
  return true;
}
