/**
 * AI Automation Runtime - Automation History
 * Complete audit and history of all automation runs for learning and compliance.
 */

export interface AutomationRun {
  id: string;
  automationId: string;
  tenantId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  steps: any[];
}

export class AutomationHistory {
  private runs: AutomationRun[] = [];

  record(run: Omit<AutomationRun, "id">): AutomationRun {
    const full: AutomationRun = { ...run, id: `arun_${Date.now()}` };
    this.runs.push(full);
    return full;
  }

  getForTenant(tenantId: string): AutomationRun[] {
    return this.runs.filter((r) => r.tenantId === tenantId);
  }
}

export const automationHistory = new AutomationHistory();
