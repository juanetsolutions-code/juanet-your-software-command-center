/**
 * Prompt Orchestration System - Prompt Versioning
 * Manages versions of prompts with rollback and A/B testing support.
 */

import type { Prompt } from "./prompt-registry";

export class PromptVersioning {
  private versions: Map<string, Prompt[]> = new Map();

  addVersion(prompt: Prompt): void {
    const list = this.versions.get(prompt.name) || [];
    list.push(prompt);
    this.versions.set(prompt.name, list);
  }

  getLatest(name: string): Prompt | undefined {
    const list = this.versions.get(name);
    return list?.sort((a, b) => b.version - a.version)[0];
  }
}

export const promptVersioning = new PromptVersioning();
