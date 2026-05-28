import { DealProgressor } from "./deal-progressor";
import { PipelineOptimizer } from "./pipeline-optimizer";
import { ChurnPreventionAgent } from "./churn-prevention-agent";
import { CustomerJourneyAI } from "./customer-journey-ai";

export class CrmWorkflowEngine {
  private dealProgressor = new DealProgressor();
  private pipelineOptimizer = new PipelineOptimizer();
  private churnPrevention = new ChurnPreventionAgent();
  private customerJourney = new CustomerJourneyAI();

  async runCycle(tenantId: string): Promise<{
    dealsProgressed: number;
    chutePrevented: number;
    optimizations: string[];
  }> {
    const dealsProgressed = await this.dealProgressor.progressDeals(tenantId);
    const chutePrevented = await this.churnPrevention.prevent(tenantId);
    
    const metrics = await this.pipelineOptimizer.optimize(tenantId);
    const optimizations = this.pipelineOptimizer.suggestOptimizations(metrics);

    return {
      dealsProgressed,
      chutePrevented,
      optimizations,
    };
  }
}