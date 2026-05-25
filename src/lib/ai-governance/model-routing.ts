export interface ModelDescriptor {
  id: string;
  provider: string;
  tier: "fast" | "balanced" | "premium";
  costPer1kInputUsd?: number;
  costPer1kOutputUsd?: number;
}

const models: ModelDescriptor[] = [
  { id: "gpt-4o-mini", provider: "openai", tier: "fast" },
  { id: "gpt-4o", provider: "openai", tier: "balanced" },
  { id: "claude-3-5-sonnet", provider: "anthropic", tier: "premium" },
];

export function listModels(): ModelDescriptor[] {
  return [...models];
}

export function pickModel(criteria: {
  tier?: ModelDescriptor["tier"];
  provider?: string;
}): ModelDescriptor | null {
  return (
    models.find(
      (m) =>
        (!criteria.tier || m.tier === criteria.tier) &&
        (!criteria.provider || m.provider === criteria.provider),
    ) ?? null
  );
}
