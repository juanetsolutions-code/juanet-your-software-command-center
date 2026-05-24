export interface ProviderHealth {
  provider: string;
  healthy: boolean;
  consecutiveFailures: number;
  lastCheckedAt: string;
}

const health = new Map<string, ProviderHealth>();

export function reportProviderResult(provider: string, success: boolean) {
  const h = health.get(provider) ?? {
    provider,
    healthy: true,
    consecutiveFailures: 0,
    lastCheckedAt: new Date().toISOString(),
  };
  if (success) {
    h.consecutiveFailures = 0;
    h.healthy = true;
  } else {
    h.consecutiveFailures++;
    if (h.consecutiveFailures >= 3) h.healthy = false;
  }
  h.lastCheckedAt = new Date().toISOString();
  health.set(provider, h);
}

export function pickProvider(preferred: string[], fallback: string[]): string | null {
  for (const p of [...preferred, ...fallback]) {
    const h = health.get(p);
    if (!h || h.healthy) return p;
  }
  return null;
}

export function getProviderHealth(provider: string) {
  return health.get(provider) ?? null;
}
