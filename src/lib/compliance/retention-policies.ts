/**
 * Retention Policies
 */

export interface RetentionPolicy {
  resource: string;
  days: number;
  action: "delete" | "archive";
}

const policies: RetentionPolicy[] = [
  { resource: "logs", days: 90, action: "delete" },
  { resource: "audit_events", days: 365, action: "archive" },
];

export function getRetentionPolicy(resource: string): RetentionPolicy | undefined {
  return policies.find((p) => p.resource === resource);
}
