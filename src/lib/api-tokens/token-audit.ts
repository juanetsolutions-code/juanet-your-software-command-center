/**
 * Token Audit
 */

export function logTokenUsage(tokenId: string, action: string, ip?: string) {
  console.log(`[TokenAudit] ${tokenId} performed ${action} from ${ip || "unknown"}`);
}
