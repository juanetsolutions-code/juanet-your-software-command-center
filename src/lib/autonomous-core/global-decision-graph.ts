import type { AgentTask } from "@/lib/agent-swarm/agent-types";

export type DecisionNode = {
  id: string;
  type: "trigger" | "condition" | "action" | "priority";
  next?: string[];
  config?: Record<string, unknown>;
};

export type DecisionGraph = {
  nodes: Map<string, DecisionNode>;
  startNode: string;
};

export class GlobalDecisionGraph {
  private graph: DecisionGraph = {
    nodes: new Map(),
    startNode: "start",
  };

  initialize(): void {
    this.createDefaultGraph();
  }

  private createDefaultGraph(): void {
    this.graph.nodes.set("start", {
      id: "start",
      type: "trigger",
      next: ["evaluate_revenue_impact"],
    });

    this.graph.nodes.set("evaluate_revenue_impact", {
      id: "evaluate_revenue_impact",
      type: "priority",
      next: ["execute_action"],
    });

    this.graph.nodes.set("execute_action", {
      id: "execute_action",
      type: "action",
    });
  }

  evaluate(task: AgentTask): AgentTask {
    return task;
  }
}