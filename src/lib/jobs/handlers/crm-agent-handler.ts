import type { Job, JobHandler } from "../../dead-letter-queue";
import { salesAgent } from "@/lib/crm/agent/sales-agent-orchestrator";
import type { AgentEvaluationResult } from "@/lib/crm/agent/sales-agent-orchestrator";
import { runWithRetry } from "../../jobs";
import { emitEvent } from "@/lib/event-bus";

async function handleCrmAgentJob(job: Job): Promise<AgentEvaluationResult> {
  const { tenantId, userId, userRole } = job.payload as { 
    tenantId: string; 
    userId?: string; 
    userRole?: string; 
  };

  if (!tenantId) {
    throw new Error("tenantId required for CRM agent job");
  }

  const result = await runWithRetry(
    `crm-autonomous-scan-${tenantId}`,
    async () => {
      return await salesAgent.scanAndAct(tenantId, userId, userRole);
    }
  );

  if (!result.success) {
    throw new Error(`CRM agent scan failed: ${result.error}`);
  }

  emitEvent({
    id: `evt_${Date.now()}`,
    type: "crm.agent.job_completed",
    tenantId,
    timestamp: new Date().toISOString(),
    payload: { jobId: job.id, actionsExecuted: result.actionsExecuted },
    version: "1.0",
  });

  return result;
}

export const crmAgentJobHandler: JobHandler = handleCrmAgentJob;

export function registerCrmAgentJobHandler(): void {
  import("../../job-scheduler").then(({ jobScheduler }) => {
    jobScheduler.registerHandler("crm_autonomous_scan", crmAgentJobHandler);
  });
}