/**
 * Prompt Orchestration System - Tenant Prompts
 * Tenant-customizable prompts with safe override mechanisms.
 */

export class TenantPrompts {
  private overrides: Map<string, Record<string, string>> = new Map();

  setOverride(tenantId: string, promptName: string, content: string): void {
    const current = this.overrides.get(tenantId) || {};
    current[promptName] = content;
    this.overrides.set(tenantId, current);
  }

  getEffective(tenantId: string, basePrompt: string, promptName: string): string {
    const override = this.overrides.get(tenantId)?.[promptName];
    return override || basePrompt;
  }
}

export const tenantPrompts = new TenantPrompts();
