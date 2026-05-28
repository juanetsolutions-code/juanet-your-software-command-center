import type { Pipeline, Stage } from "../core/crm-entities";

export class PipelineEngine {
  validatePipeline(pipeline: Pipeline): boolean {
    return pipeline.stages.length > 0 && 
           pipeline.stages.every((s) => s.name && s.probability >= 0 && s.probability <= 100);
  }

  reorderStages(pipeline: Pipeline, stageIds: string[]): Pipeline {
    const stages = [...pipeline.stages].sort((a, b) => {
      const aPos = stageIds.indexOf(a.id);
      const bPos = stageIds.indexOf(b.id);
      return aPos - bPos;
    });
    
    return { ...pipeline, stages };
  }

  calculatePipelineValue(pipeline: Pipeline, deals: Array<{ value: number; probability: number }>): number {
    return deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  }

  getStagePosition(pipeline: Pipeline, stageId: string): number | undefined {
    const stage = pipeline.stages.find((s) => s.id === stageId);
    return stage?.position;
  }

  getNextStage(pipeline: Pipeline, currentStageId: string): Stage | undefined {
    const stages = [...pipeline.stages].sort((a, b) => a.position - b.position);
    const currentIndex = stages.findIndex((s) => s.id === currentStageId);
    return currentIndex >= 0 && currentIndex < stages.length - 1 ? stages[currentIndex + 1] : undefined;
  }

  getPreviousStage(pipeline: Pipeline, currentStageId: string): Stage | undefined {
    const stages = [...pipeline.stages].sort((a, b) => a.position - b.position);
    const currentIndex = stages.findIndex((s) => s.id === currentStageId);
    return currentIndex > 0 ? stages[currentIndex - 1] : undefined;
  }
}

export const pipelineEngine = new PipelineEngine();