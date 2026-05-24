/**
 * Abuse Detection Foundation
 */

export function detectAbuse(tenantId: string, signals: Record<string, number>): boolean {
  // Placeholder logic
  const suspicious = Object.values(signals).some((v) => v > 1000);
  return suspicious;
}
