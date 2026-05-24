/**
 * Prompt Registry - Centralized management of prompts.
 */

const prompts = new Map<string, string>();

export function registerPrompt(key: string, template: string) {
  prompts.set(key, template);
}

export function getPrompt(key: string): string | undefined {
  return prompts.get(key);
}

export function listPrompts(): string[] {
  return Array.from(prompts.keys());
}
