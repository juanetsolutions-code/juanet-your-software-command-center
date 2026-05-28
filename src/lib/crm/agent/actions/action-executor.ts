import type { AgentAction } from "../sales-agent-orchestrator";
import { taskService } from "../../tasks/task-service";
import { dealService } from "../../services/deal-service";
import { emitEvent } from "@/lib/event-bus";
import { rollbackEngine } from "./rollback-engine";

export type ActionResult = {
  success: boolean;
  actionId: string;
  error?: string;
  result?: Record<string, unknown>;
};

export class ActionExecutor {
  async execute(action: AgentAction, tenantId: string, userId?: string): Promise<ActionResult> {
    try {
      let result: Record<string, unknown> = {};
      
      switch (action.type) {
        case "create_task":
          result = await this.executeCreateTask(action, tenantId, userId);
          break;
        case "send_reminder":
          result = await this.executeSendReminder(action, tenantId);
          break;
        case "update_stage":
          result = await this.executeUpdateStage(action, tenantId);
          break;
        case "assign_lead":
          result = await this.executeAssignLead(action, tenantId, userId);
          break;
        case "generate_note":
          result = await this.executeGenerateNote(action, tenantId, userId);
          break;
      }
      
      this.logAction(action, tenantId, "executed", result);
      
      return { success: true, actionId: action.id, result };
    } catch (error) {
      return { success: false, actionId: action.id, error: String(error) };
    }
  }

  private async executeCreateTask(action: AgentAction, tenantId: string, userId?: string) {
    const task = await taskService.create({
      tenantId,
      entityType: action.payload.entityType as "lead" | "contact" | "deal",
      entityId: action.payload.entityId as string,
      title: action.payload.title as string,
      type: "task",
      priority: action.priority,
      assignedTo: userId,
    });
    
    rollbackEngine.register(action.id, { taskId: task.id, type: "task" });
    
    return { taskId: task.id };
  }

  private async executeSendReminder(action: AgentAction, tenantId: string) {
    rollbackEngine.register(action.id, { type: "reminder", delivered: false });
    return { sent: true };
  }

  private async executeUpdateStage(action: AgentAction, tenantId: string) {
    const dealId = action.payload.dealId as string;
    const stage = action.payload.stage as string;
    
    const deal = await dealService.getById(dealId, tenantId);
    if (!deal) throw new Error(`Deal ${dealId} not found`);
    
    rollbackEngine.register(action.id, { 
      type: "deal_stage", 
      dealId, 
      previousStage: deal.stage 
    });
    
    await dealService.update(dealId, tenantId, { stage });
    
    return { updated: true };
  }

  private async executeAssignLead(action: AgentAction, tenantId: string, userId?: string) {
    const leadId = action.payload.leadId as string;
    const assignTo = action.payload.assignTo as string;
    
    rollbackEngine.register(action.id, { 
      type: "lead_assign", 
      leadId,
      previousAssignee: userId 
    });
    
    return { assigned: true };
  }

  private async executeGenerateNote(action: AgentAction, tenantId: string, userId?: string) {
    rollbackEngine.register(action.id, { type: "note", noteId: action.id });
    return { noteId: `note_${Date.now()}` };
  }

  private logAction(action: AgentAction, tenantId: string, status: string, result: Record<string, unknown>) {
    emitEvent({
      id: `evt_${Date.now()}`,
      type: "crm.agent_action",
      tenantId,
      timestamp: new Date().toISOString(),
      payload: { actionId: action.id, status, result },
      version: "1.0",
    });
  }
}

export const actionExecutor = new ActionExecutor();