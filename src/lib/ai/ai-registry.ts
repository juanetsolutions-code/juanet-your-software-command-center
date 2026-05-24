/**
 * AI Provider Registry
 * Allows dynamic registration and selection of AI providers.
 */

import type { AIProvider, AIProviderType } from "./ai-types";
import { AI_CONFIG } from "./ai-config";

const registry = new Map<AIProviderType, AIProvider>();

export function registerAIProvider(provider: AIProvider) {
  registry.set(provider.type, provider);
}

export function getAIProvider(type: AIProviderType): AIProvider | undefined {
  const provider = registry.get(type);
  if (provider && AI_CONFIG.isProviderEnabled(type)) {
    return provider;
  }
  return undefined;
}

export function getAvailableProviders(): AIProviderType[] {
  return Array.from(registry.keys()).filter((type) => AI_CONFIG.isProviderEnabled(type));
}

export async function selectBestProvider(): Promise<AIProvider | undefined> {
  // Simple selection logic - can be made smarter later
  const available = getAvailableProviders();
  if (available.length === 0) return undefined;

  // Prefer grok > openai > anthropic > local for now
  const preferenceOrder: AIProviderType[] = ["grok", "openai", "anthropic", "local"];

  for (const pref of preferenceOrder) {
    if (available.includes(pref)) {
      return registry.get(pref);
    }
  }
  return registry.get(available[0]);
}
