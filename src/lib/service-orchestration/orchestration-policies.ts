/**
 * Service Orchestration - Orchestration Policies
 */

export class OrchestrationPolicies {
  getPolicy(name: string): any {
    return { name, rules: [] };
  }
}

export const orchestrationPolicies = new OrchestrationPolicies();
