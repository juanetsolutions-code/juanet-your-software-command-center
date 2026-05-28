import type { DomainEvent } from "../event-bus/event-bus";

export type SecurityEvent = {
  id: string;
  type: "auth-success" | "auth-failure" | "rate-limit-hit" | "suspicious-activity" | "policy-violation";
  tenantId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details: Record<string, unknown>;
  timestamp: string;
};

export type SecurityScore = {
  score: number;
  level: "safe" | "caution" | "warning" | "critical";
  factors: string[];
};

class SecurityEventDetector {
  private events: SecurityEvent[] = [];
  private windowMs = 3600000;

  record(event: SecurityEvent): void {
    this.events.push(event);
    this.prune();
  }

  analyze(tenantId?: string): SecurityScore {
    const now = Date.now();
    const relevant = this.events.filter(
      (e) => (!tenantId || e.tenantId === tenantId) && now - new Date(e.timestamp).getTime() < this.windowMs
    );

    let score = 0;
    const factors: string[] = [];

    const failures = relevant.filter((e) => e.type === "auth-failure").length;
    const rateLimits = relevant.filter((e) => e.type === "rate-limit-hit").length;
    const suspicious = relevant.filter((e) => e.type === "suspicious-activity").length;

    if (failures > 5) {
      score += Math.min(40, failures * 5);
      factors.push("multiple-auth-failures");
    }
    if (rateLimits > 10) {
      score += Math.min(30, rateLimits * 2);
      factors.push("rate-limit-abuse");
    }
    if (suspicious > 0) {
      score += Math.min(30, suspicious * 10);
      factors.push("suspicious-activity");
    }

    return {
      score: Math.min(100, score),
      level: score > 80 ? "critical" : score > 50 ? "warning" : score > 20 ? "caution" : "safe",
      factors,
    };
  }

  getEvents(tenantId?: string): SecurityEvent[] {
    return tenantId
      ? this.events.filter((e) => e.tenantId === tenantId)
      : [...this.events];
  }

  private prune(): void {
    const cutoff = Date.now() - this.windowMs;
    this.events = this.events.filter((e) => new Date(e.timestamp).getTime() > cutoff);
  }
}

export const securityDetector = new SecurityEventDetector();

export function recordSecurityEvent(event: SecurityEvent): void {
  securityDetector.record(event);
}

export function getSecurityScore(tenantId?: string): SecurityScore {
  return securityDetector.analyze(tenantId);
}