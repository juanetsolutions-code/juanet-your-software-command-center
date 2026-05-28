import type { AgentAction } from "./sales-agent-orchestrator";
import type { Signal } from "../signals/signal-engine";

export type AgentFeedItem = {
  type: "action_taken" | "suggestion_pending" | "opportunity" | "risk_mitigated";
  timestamp: string;
  title: string;
  description: string;
  action?: AgentAction;
  signal?: Signal;
};

export class DashboardFeed {
  private feed: AgentFeedItem[] = [];

  addActionTaken(action: AgentAction, result: Record<string, unknown>): void {
    this.feed.push({
      type: "action_taken",
      timestamp: new Date().toISOString(),
      title: `Action executed: ${action.type}`,
      description: `Successfully completed`,
      action,
    });
  }

  addOpportunity(signal: Signal): void {
    this.feed.push({
      type: "opportunity",
      timestamp: new Date().toISOString(),
      title: "Revenue opportunity detected",
      description: signal.message,
      signal,
    });
  }

  getRecent(tenantId: string, limit?: number): AgentFeedItem[] {
    return limit ? this.feed.slice(0, limit) : this.feed;
  }
}