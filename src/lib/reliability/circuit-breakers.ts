export type BreakerState = "closed" | "open" | "half-open";

interface BreakerStats {
  state: BreakerState;
  failures: number;
  openedAt?: number;
  threshold: number;
  resetMs: number;
}

const breakers = new Map<string, BreakerStats>();

function get(name: string, threshold = 5, resetMs = 30_000): BreakerStats {
  let b = breakers.get(name);
  if (!b) {
    b = { state: "closed", failures: 0, threshold, resetMs };
    breakers.set(name, b);
  }
  return b;
}

export async function withBreaker<T>(
  name: string,
  fn: () => Promise<T>,
  opts?: { threshold?: number; resetMs?: number },
): Promise<T> {
  const b = get(name, opts?.threshold, opts?.resetMs);
  if (b.state === "open") {
    if (b.openedAt && Date.now() - b.openedAt > b.resetMs) b.state = "half-open";
    else throw new Error(`Circuit ${name} open`);
  }
  try {
    const result = await fn();
    b.failures = 0;
    b.state = "closed";
    return result;
  } catch (err) {
    b.failures++;
    if (b.failures >= b.threshold) {
      b.state = "open";
      b.openedAt = Date.now();
    }
    throw err;
  }
}

export function getBreakerState(name: string): BreakerState {
  return breakers.get(name)?.state ?? "closed";
}
