export interface ResiliencePolicy {
  name: string;
  retries: number;
  timeoutMs: number;
  breakerThreshold: number;
}

const policies = new Map<string, ResiliencePolicy>();

export function definePolicy(p: ResiliencePolicy) {
  policies.set(p.name, p);
}

export function getPolicy(name: string): ResiliencePolicy {
  return (
    policies.get(name) ?? {
      name,
      retries: 3,
      timeoutMs: 10_000,
      breakerThreshold: 5,
    }
  );
}
