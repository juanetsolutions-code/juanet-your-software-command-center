/**
 * Prompt Orchestration System - Prompt Registry
 * Central registry for all system, tenant, and versioned prompts.
 */

export interface Prompt {
  id: string;
  name: string;
  content: string;
  version: number;
  tenantId?: string;
  type: "system" | "user" | "fewshot";
}

export class PromptRegistry {
  private prompts: Map<string, Prompt> = new Map();

  register(prompt: Prompt): void {
    this.prompts.set(prompt.id, prompt);
  }

  get(id: string): Prompt | undefined {
    return this.prompts.get(id);
  }

  getByName(name: string, tenantId?: string): Prompt | undefined {
    return Array.from(this.prompts.values()).find(
      (p) => p.name === name && (!tenantId || p.tenantId === tenantId),
    );
  }
}

export const promptRegistry = new PromptRegistry();
