/**
 * Provider Adapters
 * Unified interface for different third-party integration providers.
 */

export interface ProviderAdapter {
  name: string;
  connect(credentials: any): Promise<{ connected: boolean; metadata?: any }>;
  sync(): Promise<{ success: boolean; records?: number }>;
}

export class ProviderAdapterRegistry {
  private adapters = new Map<string, ProviderAdapter>();

  register(adapter: ProviderAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  get(name: string): ProviderAdapter | undefined {
    return this.adapters.get(name);
  }
}

export const providerAdapterRegistry = new ProviderAdapterRegistry();
