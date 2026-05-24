export interface InferencePolicy {
  tenantId: string;
  maxTokensPerCall?: number;
  allowedTiers?: Array<"fast" | "balanced" | "premium">;
  blockedProviders?: string[];
}

const policies = new Map<string, InferencePolicy>();

export function setPolicy(p: InferencePolicy) {
  policies.set(p.tenantId, p);
}

export function getPolicy(tenantId: string): InferencePolicy | null {
  return policies.get(tenantId) ?? null;
}

export function validateInferenceRequest(
  tenantId: string,
  req: { maxTokens?: number; tier?: "fast" | "balanced" | "premium"; provider?: string },
): { allowed: boolean; reason?: string } {
  const p = policies.get(tenantId);
  if (!p) return { allowed: true };
  if (p.maxTokensPerCall && req.maxTokens && req.maxTokens > p.maxTokensPerCall)
    return { allowed: false, reason: "tokens_exceed_policy" };
  if (p.allowedTiers && req.tier && !p.allowedTiers.includes(req.tier))
    return { allowed: false, reason: "tier_not_allowed" };
  if (p.blockedProviders && req.provider && p.blockedProviders.includes(req.provider))
    return { allowed: false, reason: "provider_blocked" };
  return { allowed: true };
}
