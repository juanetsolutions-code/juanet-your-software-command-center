/**
 * AI Provider Abstraction Layer - Token Usage
 * Tracks and meters token consumption per tenant and provider.
 */

export class TokenUsage {
  private usage: Map<string, { tokens: number; cost: number }> = new Map();

  record(tenantId: string, provider: string, tokens: number, cost: number): void {
    const key = `${tenantId}:${provider}`;
    const current = this.usage.get(key) || { tokens: 0, cost: 0 };
    this.usage.set(key, {
      tokens: current.tokens + tokens,
      cost: current.cost + cost,
    });
  }

  getForTenant(tenantId: string): any {
    // Aggregate across providers
    return { totalTokens: 0, totalCost: 0 }; // stub
  }
}

export const tokenUsage = new TokenUsage();
