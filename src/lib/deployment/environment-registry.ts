/**
 * Environment Registry
 * Manages all deployment environments with configuration and access controls.
 */

export interface Environment {
  name: string;
  region: string;
  type: "dev" | "staging" | "prod";
  tenantIsolation: boolean;
}

export class EnvironmentRegistry {
  private envs: Environment[] = [
    { name: "us-east-prod", region: "us-east-1", type: "prod", tenantIsolation: true },
    { name: "eu-west-prod", region: "eu-west-1", type: "prod", tenantIsolation: true },
  ];

  getEnvironments(): Environment[] {
    return [...this.envs];
  }
}

export const environmentRegistry = new EnvironmentRegistry();
