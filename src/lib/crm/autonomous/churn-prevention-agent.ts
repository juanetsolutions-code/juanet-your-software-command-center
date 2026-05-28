import type { Deal } from "@/lib/crm/core/crm-entities";
import { dealService } from "@/lib/crm/services/deal-service";
import { taskService } from "@/lib/crm/tasks/task-service";

export type ChurnRisk = {
  dealId: string;
  risk: "low" | "medium" | "high";
  reasons: string[];
};

export class ChurnPreventionAgent {
  async assessChurnRisk(tenantId: string): Promise<ChurnRisk[]> {
    const deals = await dealService.list(tenantId);
    
    return deals
      .filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost")
      .map((deal) => this.calculateChurnRisk(deal));
  }

  private calculateChurnRisk(deal: Deal): ChurnRisk {
    const reasons: string[] = [];
    let risk: "low" | "medium" | "high" = "low";

    if (deal.updatedAt) {
      const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (days > 30) {
        risk = "high";
        reasons.push("No activity for 30+ days");
      } else if (days > 14) {
        risk = "medium";
        reasons.push("No activity for 14+ days");
      }
    }

    if ((deal.probability ?? 100) < 30) {
      risk = "high";
      reasons.push("Low probability");
    }

    return { dealId: deal.id, risk, reasons };
  }

  async prevent(tenantId: string): Promise<number> {
    const risks = await this.assessChurnRisk(tenantId);
    let interventions = 0;

    for (const risk of risks) {
      if (risk.risk === "high") {
        await this.createIntervention(risk);
        interventions++;
      } else if (risk.risk === "medium") {
        await this.createIntervention(risk);
        interventions++;
      }
    }

    return interventions;
  }

  private async createIntervention(risk: ChurnRisk): Promise<void> {
    const deal = await dealService.getById(risk.dealId, "");
    if (!deal) return;

    await taskService.create({
      tenantId: deal.tenantId,
      entityType: "deal",
      entityId: deal.id,
      title: `Churn prevention: ${risk.reasons.join(", ")}`,
      type: "call",
      priority: risk.risk === "high" ? "urgent" : "high",
    });
  }
}