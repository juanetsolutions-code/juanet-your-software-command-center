export type AutonomyLimits = {
  maxActionsPerHour: number;
  maxActionsPerDay: number;
  allowedActionTypes: string[];
  requireApprovalFor: string[];
};

export class AutonomyLimitsSystem {
  private limits: Map<string, AutonomyLimits> = new Map();

  getDefault(tenantId: string): AutonomyLimits {
    return {
      maxActionsPerHour: 5,
      maxActionsPerDay: 20,
      allowedActionTypes: ["create_task", "generate_note"],
      requireApprovalFor: ["update_stage", "send_reminder", "assign_lead"],
    };
  }

  set(tenantId: string, limits: Partial<AutonomyLimits>): void {
    const current = this.limits.get(tenantId) ?? this.getDefault(tenantId);
    this.limits.set(tenantId, { ...current, ...limits });
  }

  get(tenantId: string): AutonomyLimits {
    return this.limits.get(tenantId) ?? this.getDefault(tenantId);
  }
}

export const autonomyLimits = new AutonomyLimitsSystem();