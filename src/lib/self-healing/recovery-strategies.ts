/**
 * Recovery Strategies
 * Defines pluggable, reversible recovery strategies for different failure modes.
 */

export interface RecoveryStrategy {
  id: string;
  name: string;
  applicableTo: string[];
  estimatedRecoveryTime: string;
  riskLevel: "low" | "medium" | "high";
  steps: string[];
  rollbackSteps: string[];
  prerequisites: string[];
}

export const defaultRecoveryStrategies: RecoveryStrategy[] = [
  {
    id: "restart-service",
    name: "Graceful Service Restart",
    applicableTo: ["api", "worker", "realtime"],
    estimatedRecoveryTime: "30-90s",
    riskLevel: "low",
    steps: ["drain_connections", "checkpoint_state", "restart_process", "health_probe"],
    rollbackSteps: ["restore_from_checkpoint"],
    prerequisites: ["circuit_breaker_open"],
  },
  {
    id: "failover-region",
    name: "Regional Failover",
    applicableTo: ["database", "cache", "storage"],
    estimatedRecoveryTime: "2-5m",
    riskLevel: "medium",
    steps: ["promote_replica", "update_dns", "verify_consistency"],
    rollbackSteps: ["demote", "revert_dns"],
    prerequisites: ["replica_lag_ok"],
  },
  {
    id: "scale-horizontal",
    name: "Horizontal Scale-out",
    applicableTo: ["compute", "queue"],
    estimatedRecoveryTime: "1-3m",
    riskLevel: "low",
    steps: ["provision_instances", "register_loadbalancer", "warmup"],
    rollbackSteps: ["drain_traffic", "deprovision"],
    prerequisites: ["budget_approved"],
  },
];

export class RecoveryStrategies {
  getStrategiesFor(service: string, degradation: string): RecoveryStrategy[] {
    return defaultRecoveryStrategies.filter(
      (s) => s.applicableTo.includes(service) || s.applicableTo.includes(degradation),
    );
  }
}

export const recoveryStrategies = new RecoveryStrategies();
