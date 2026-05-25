/**
 * Enterprise Integration Core - Integration Lifecycle
 * Manages the full lifecycle states of integrations: registration, activation, pausing, error handling, and decommissioning.
 */

import type { IntegrationConfig } from "./integration-types";

export type IntegrationLifecycleState =
  | "registered"
  | "active"
  | "paused"
  | "error"
  | "decommissioned";

export interface LifecycleTransition {
  from: IntegrationLifecycleState;
  to: IntegrationLifecycleState;
  reason?: string;
  timestamp: string;
}

export class IntegrationLifecycle {
  private stateMap = new Map<string, IntegrationLifecycleState>();
  private history = new Map<string, LifecycleTransition[]>();

  transition(integrationId: string, newState: IntegrationLifecycleState, reason?: string): void {
    const current = this.stateMap.get(integrationId) || "registered";

    // Simple state machine rules
    const allowed: Record<IntegrationLifecycleState, IntegrationLifecycleState[]> = {
      registered: ["active", "decommissioned"],
      active: ["paused", "error", "decommissioned"],
      paused: ["active", "decommissioned"],
      error: ["active", "decommissioned"],
      decommissioned: [],
    };

    if (!allowed[current].includes(newState)) {
      throw new Error(`Invalid lifecycle transition from ${current} to ${newState}`);
    }

    this.stateMap.set(integrationId, newState);

    const transition: LifecycleTransition = {
      from: current,
      to: newState,
      reason,
      timestamp: new Date().toISOString(),
    };

    const history = this.history.get(integrationId) || [];
    history.push(transition);
    this.history.set(integrationId, history);
  }

  getState(integrationId: string): IntegrationLifecycleState {
    return this.stateMap.get(integrationId) || "registered";
  }

  getHistory(integrationId: string): LifecycleTransition[] {
    return this.history.get(integrationId) || [];
  }
}

export const integrationLifecycle = new IntegrationLifecycle();
