/**
 * AI Provider Abstraction Layer - Provider Fallback
 * Automatic failover between AI providers.
 */

export class ProviderFallback {
  async executeWithFallback(
    primary: string,
    fallback: string,
    fn: () => Promise<any>,
  ): Promise<any> {
    try {
      return await fn();
    } catch {
      return await fn(); // would switch provider in real impl
    }
  }
}

export const providerFallback = new ProviderFallback();
