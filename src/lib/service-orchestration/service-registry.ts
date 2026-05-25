/**
 * Service Orchestration - Service Registry
 * Registers external services and their metadata for routing and orchestration.
 */

export interface ServiceDescriptor {
  id: string;
  name: string;
  type: string;
  regions: string[];
  healthEndpoint?: string;
}

export class ServiceRegistry {
  private services: ServiceDescriptor[] = [];

  register(service: ServiceDescriptor): void {
    this.services.push(service);
  }

  list(region?: string): ServiceDescriptor[] {
    return region ? this.services.filter((s) => s.regions.includes(region)) : [...this.services];
  }
}

export const serviceRegistry = new ServiceRegistry();
