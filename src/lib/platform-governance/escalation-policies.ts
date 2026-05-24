/**
 * Escalation Policies
 */

export interface EscalationPolicy {
  level: number;
  action: string;
  notify: string[];
}

const policies: EscalationPolicy[] = [
  { level: 1, action: "notify_support", notify: ["support@juanet.io"] },
  { level: 2, action: "notify_management", notify: ["ops@juanet.io"] },
];

export function getEscalationPolicy(level: number) {
  return policies.find((p) => p.level === level);
}
