/**
 * Autonomous Execution Controls
 * Fine-grained controls over what autonomous AI actions are permitted.
 */

export interface AutonomousExecutionControl {
  tenantId: string;
  actionType: string;
  allowed: boolean;
  requiresHuman: boolean;
}

export class AutonomousExecutionControls {
  private controls = new Map<string, AutonomousExecutionControl>();

  setControl(tenantId: string, actionType: string, allowed: boolean, requiresHuman: boolean): void {
    this.controls.set(`${tenantId}:${actionType}`, {
      tenantId,
      actionType,
      allowed,
      requiresHuman,
    });
  }

  isAllowed(tenantId: string, actionType: string): boolean {
    return this.controls.get(`${tenantId}:${actionType}`)?.allowed ?? true;
  }
}

export const autonomousExecutionControls = new AutonomousExecutionControls();
