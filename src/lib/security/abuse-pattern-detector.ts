import type { SecurityEvent } from "./auth-risk-scoring";

export type AbusePatternConfig = {
  type: "request-burst" | "credential-stuffing" | "scraping" | "automated-attack";
  threshold: number;
  windowSeconds: number;
  tenantId?: string;
};

class AbusePatternDetector {
  private patterns: Map<string, AbusePatternConfig> = new Map();
  private counters: Map<string, { count: number; resetTime: number }> = new Map();

  addPattern(config: AbusePatternConfig): void {
    const key = this.getPatternKey(config);
    this.patterns.set(key, config);
  }

  check(ip: string, tenantId?: string): string[] {
    const triggered: string[] = [];
    const now = Date.now();

    for (const [key, config] of this.patterns) {
      if (tenantId && config.tenantId && config.tenantId !== tenantId) continue;

      const counter = this.getOrCreateCounter(key);
      
      if (now > counter.resetTime) {
        counter.count = 0;
        counter.resetTime = now + config.windowSeconds * 1000;
      }

      counter.count++;
      if (counter.count > config.threshold) {
        triggered.push(config.type);
      }
    }

    return triggered;
  }

  private getOrCreateCounter(key: string): { count: number; resetTime: number } {
    if (!this.counters.has(key)) {
      this.counters.set(key, { count: 0, resetTime: Date.now() });
    }
    return this.counters.get(key)!;
  }

  private getPatternKey(config: AbusePatternConfig): string {
    return `${config.type}-${config.tenantId ?? "global"}`;
  }
}

export const abuseDetector = new AbusePatternDetector();

export function addAbusePattern(config: AbusePatternConfig): void {
  abuseDetector.addPattern(config);
}

export function checkAbuse(ip: string, tenantId?: string): string[] {
  return abuseDetector.check(ip, tenantId);
}