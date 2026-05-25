export class ApprovalRouting {
  route(request: any) {
    return "default";
  }
}
export const approvalRouting = new ApprovalRouting();
