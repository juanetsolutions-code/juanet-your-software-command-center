export type AgentCapability =
  | "support.reply"
  | "support.triage"
  | "finance.invoice"
  | "finance.report"
  | "ops.monitor"
  | "ops.remediate"
  | "content.generate"
  | "content.review"
  | "data.analyze"
  | "workflow.execute";

export const CAPABILITY_GROUPS: Record<string, AgentCapability[]> = {
  support: ["support.reply", "support.triage"],
  finance: ["finance.invoice", "finance.report"],
  ops: ["ops.monitor", "ops.remediate"],
  content: ["content.generate", "content.review"],
  data: ["data.analyze"],
  workflow: ["workflow.execute"],
};
