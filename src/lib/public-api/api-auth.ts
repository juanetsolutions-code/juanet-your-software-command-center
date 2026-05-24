/**
 * Public API Auth (token-based)
 */

import { validateApiToken } from "@/lib/api-tokens/token-service";

export function authenticateApiRequest(token: string) {
  const record = validateApiToken(token);
  if (!record) throw new Error("Invalid or expired API token");
  return record;
}
