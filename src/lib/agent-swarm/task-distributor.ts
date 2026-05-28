import type { AgentTask, AgentType } from "./agent-types";
import type { BaseAgent } from "./agent-types";

export class TaskDistributor {
  private taskQueue: Map<string, AgentTask[]> = new Map();
  private priorityThreshold: Map<AgentType, number> = new Map();

  distribute(task: AgentTask, preferredTypes?: AgentType[]): string | null {
    const matchingAgents = this.findMatchingAgents(task, preferredTypes);
    
    if (matchingAgents.length === 0) {
      this.enqueueTask(task);
      return null;
    }

    const bestAgent = this.selectBestAgent(matchingAgents, task.priority);
    if (bestAgent && bestAgent.onTask) {
      bestAgent.onTask(task).catch(console.error);
      this.emitTaskAssigned(task, bestAgent.id);
      return bestAgent.id;
    }

    this.enqueueTask(task);
    return null;
  }

  private findMatchingAgents(task: AgentTask, preferredTypes?: AgentType[]): BaseAgent[] {
    const registry = import("./agent-registry").then(m => m.agentRegistry);
    if (!preferredTypes) return [];
    
    return preferredTypes.flatMap((type) => {
      // Will be populated dynamically
      return [];
    });
  }

  private selectBestAgent(agents: BaseAgent[], priority: number): BaseAgent | null {
    return agents
      .filter((agent) => agent.status !== "shutdown")
      .sort((a, b) => {
        const loadA = (a as any).processedTasks ?? 0;
        const loadB = (b as any).processedTasks ?? 0;
        return loadA - loadB;
      })[0] ?? null;
  }

  private enqueueTask(task: AgentTask): void {
    const queue = this.taskQueue.get(task.type) ?? [];
    queue.push(task);
    this.taskQueue.set(task.type, queue);
  }

  getQueuedTasks(type?: string): AgentTask[] {
    if (!type) {
      return Array.from(this.taskQueue.values()).flat();
    }
    return this.taskQueue.get(type) ?? [];
  }

  private emitTaskAssigned(task: AgentTask, agentId: string): void {
    emitEvent({
      id: `evt_${Date.now()}`,
      type: "agent.task_assigned",
      tenantId: task.tenantId,
      timestamp: new Date().toISOString(),
      payload: { taskId: task.id, agentId },
      version: "1.0",
    });
  }
}

export const taskDistributor = new TaskDistributor();

function emitEvent(event: { id: string; type: string; tenantId?: string; timestamp: string; payload: Record<string, unknown>; version: string }): void {
  import("@/lib/event-bus").then(({ eventBus }) => {
    eventBus.emit(event);
  });
}