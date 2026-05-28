export type RiskScore = {
  score: number;
  level: "low" | "medium" | "high" | "critical";
  factors: string[];
};

export type AbusePattern = {
  type: "rate-limit" | "credential-stuffing" | "api-abuse" | "data-harvesting";
  threshold: number;
  windowSeconds: number;
  tenantId?: string;
};

export type AuthEvent = {
  type: "login" | "failed-login" | "logout" | "token-refresh" | "password-change";
  tenantId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: string;
  success: boolean;
};

class ThreatDetector {
  private events: AuthEvent[] = [];
  private patterns: AbusePattern[] = [];
  private windowSize = 3600000;

  registerEvent(event: AuthEvent): void {
    this.events.push({ ...event });
    this.pruneEvents();
  }

  detectThreats(tenantId?: string): RiskScore {
    const events = tenantId ? this.events.filter((e) => e.tenantId === tenantId) : this.events;
    const now = Date.now();
    const windowEvents = events.filter(
      (e) => now - new Date(e.timestamp).getTime() < this.windowSize
    );

    const failedLogins = windowEvents.filter((e) => !e.success).length;
    const uniqueIps = new Set(windowEvents.map((e) => e.ip).filter(Boolean)).size;
    const uniqueUsers = new Set(windowEvents.map((e) => e.userId).filter(Boolean)).size;

    const factors: string[] = [];
    let score = 0;

    if (failedLogins > 10) {
      score += 50;
      factors.push("high-failed-logins");
    }
    if (uniqueIps > 50 && windowEvents.length > 100) {
      score += 30;
      factors.push("high-ip-diversity");
    }
    if (uniqueUsers === 0 && windowEvents.length > 50) {
      score += 40;
      factors.push("no-user-targets");
    }

    return {
      score: Math.min(100, score),
      level: score > 80 ? "critical" : score > 50 ? "high" : score > 20 ? "medium" : "low",
      factors,
    };
  }

  registerPattern(pattern: AbusePattern): void {
    this.patterns.push(pattern);
  }

  checkPatterns(tenantId?: string): string[] {
    const triggered: string[] = [];
    const events = tenantId ? this.events.filter((e) => e.tenantId === tenantId) : this.events;
    const now = Date.now();

    for (const pattern of this.patterns) {
      const windowEvents = events.filter(
        (e) => now - new Date(e.timestamp).getTime() < pattern.windowSeconds * 1000
      );

      if (windowEvents.length > pattern.threshold) {
        triggered.push(pattern.type);
      }
    }

    return triggered;
  }

  clearEvents(): void {
    this.events = [];
  }

  getEvents(): AuthEvent[] {
    return [...this.events];
  }
}

export const threatDetector = new ThreatDetector();

export function recordAuthEvent(event: AuthEvent): void {
  threatDetector.registerEvent(event);
}

export function getRiskScore(tenantId?: string): RiskScore {
  return threatDetector.detectThreats(tenantId);
}

export function registerAbusePattern(pattern: AbusePattern): void {
  threatDetector.registerPattern(pattern);
}