/**
 * Recovery Actions
 * Library of predefined recovery actions that can be triggered automatically or manually.
 */

export interface RecoveryActionDefinition {
  name: string;
  description: string;
  reversible: boolean;
}

export const recoveryActionsLibrary: RecoveryActionDefinition[] = [
  { name: "restart_service", description: "Graceful service restart", reversible: true },
  { name: "failover_region", description: "Failover to secondary region", reversible: false },
  { name: "clear_cache", description: "Invalidate all caches", reversible: true },
];

export class RecoveryActions {
  getAvailableActions(): RecoveryActionDefinition[] {
    return recoveryActionsLibrary;
  }
}

export const recoveryActions = new RecoveryActions();
