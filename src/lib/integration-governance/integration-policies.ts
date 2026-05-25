/**
 * Integration Governance - Policies
 */

export class IntegrationPolicies {
  getPolicy(name: string) {
    return { id: name, rules: [] };
  }
}

export const integrationPolicies = new IntegrationPolicies();
