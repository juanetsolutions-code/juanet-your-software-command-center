/**
 * Distributed Recovery Policies
 * Policies governing how the platform recovers from partial failures.
 */

export interface RecoveryPolicy {
  name: string;
  maxRetries: number;
  backoffStrategy: "exponential" | "linear";
  requiresManualApproval: boolean;
}

export const distributedRecoveryPolicies: RecoveryPolicy[] = [
  {
    name: "standard",
    maxRetries: 3,
    backoffStrategy: "exponential",
    requiresManualApproval: false,
  },
  { name: "critical", maxRetries: 5, backoffStrategy: "exponential", requiresManualApproval: true },
];

export class DistributedRecoveryPolicies {
  getPolicy(name: string): RecoveryPolicy {
    return (
      distributedRecoveryPolicies.find((p) => p.name === name) || distributedRecoveryPolicies[0]
    );
  }
}

export const distributedRecoveryPoliciesManager = new DistributedRecoveryPolicies();
