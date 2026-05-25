/**
 * Prompt Orchestration System - Prompt Security
 * Guards against prompt injection, data leakage, and unsafe content.
 */

export class PromptSecurity {
  sanitize(prompt: string): string {
    // Basic injection protection
    return prompt.replace(/ignore previous instructions/gi, "[REDACTED]");
  }

  isSafe(prompt: string): boolean {
    const dangerous = ["system:", "ignore all", "jailbreak"];
    return !dangerous.some((d) => prompt.toLowerCase().includes(d));
  }
}

export const promptSecurity = new PromptSecurity();
