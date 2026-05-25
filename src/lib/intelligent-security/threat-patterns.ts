/**
 * Threat Patterns
 * Library of known and emerging threat signatures for behavioral correlation.
 */

export interface ThreatPattern {
  id: string;
  name: string;
  indicators: string[];
  severity: number;
  mitreTactics?: string[];
}

export const threatPatterns: ThreatPattern[] = [
  {
    id: "tp-001",
    name: "Credential Stuffing",
    indicators: ["high_failed_logins", "geo_anomaly", "device_fingerprint_change"],
    severity: 0.85,
    mitreTactics: ["Initial Access"],
  },
  {
    id: "tp-002",
    name: "Insider Data Exfil",
    indicators: ["unusual_query_volume", "after_hours_access", "large_export"],
    severity: 0.92,
  },
  {
    id: "tp-003",
    name: "API Abuse",
    indicators: ["rate_limit_bypass", "unusual_endpoint_pattern", "token_reuse"],
    severity: 0.7,
  },
];

export class ThreatPatterns {
  match(signals: string[]): ThreatPattern[] {
    return threatPatterns.filter((p) => p.indicators.some((ind) => signals.includes(ind)));
  }
}

export const threatPatternsLib = new ThreatPatterns();
