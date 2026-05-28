import type { Stage, Pipeline } from "../core/crm-entities";

export class StageManager {
  createStage(pipelineId: string, data: Omit<Stage, "id" | "pipelineId">): Stage {
    return {
      ...data,
      id: this.generateStageId(),
      pipelineId,
    };
  }

  updateStageProbability(pipeline: Pipeline, stageId: string, probability: number): Stage | undefined {
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (stage) {
      stage.probability = probability;
    }
    return stage;
  }

  reorderStage(pipeline: Pipeline, stageId: string, newPosition: number): Pipeline {
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (!stage) return pipeline;

    stage.position = newPosition;
    
    for (const s of pipeline.stages) {
      if (s.id !== stageId && s.position >= newPosition) {
        s.position += 1;
      }
    }

    return pipeline;
  }

  calculateProbabilityForPipeline(pipeline: Pipeline, deal: { value: number }): number {
    const avgProbability = pipeline.stages.reduce((sum, s) => sum + s.probability, 0) / pipeline.stages.length;
    return avgProbability;
  }

  private generateStageId(): string {
    return `stage_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

export const stageManager = new StageManager();