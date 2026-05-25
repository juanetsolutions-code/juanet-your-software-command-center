/**
 * AI Fallback Routing
 * Routes to fallback models/providers on primary failure.
 */

export class AIFallbackRouting {
  getFallback(primary: string): string {
    const fallbacks: Record<string, string> = {
      "premium-model": "standard-model",
      "standard-model": "light-model",
    };
    return fallbacks[primary] || "light-model";
  }
}

export const aiFallbackRouting = new AIFallbackRouting();
