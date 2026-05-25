export class ApprovalPolicies {
  getPolicy(id: string) {
    return { id, rules: [] };
  }
}
export const approvalPolicies = new ApprovalPolicies();
