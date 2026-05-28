import type { Pipeline } from "../core/crm-entities";

export class PipelineRepository {
  private pipelines: Map<string, Pipeline> = new Map();

  async create(data: Omit<Pipeline, "id" | "createdAt" | "stages">): Promise<Pipeline> {
    const pipeline: Pipeline = {
      ...data,
      id: this.generateId(),
      stages: [],
      createdAt: new Date().toISOString(),
    };
    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  async findById(id: string, tenantId: string): Promise<Pipeline | undefined> {
    const pipeline = this.pipelines.get(id);
    if (!pipeline || pipeline.tenantId !== tenantId) return undefined;
    return pipeline;
  }

  async findByTenant(tenantId: string): Promise<Pipeline[]> {
    return Array.from(this.pipelines.values()).filter((p) => p.tenantId === tenantId && p.isActive);
  }

  async getDefault(tenantId: string): Promise<Pipeline | undefined> {
    const pipelines = await this.findByTenant(tenantId);
    return pipelines.find((p) => p.name.toLowerCase().includes("default"));
  }

  async addStage(pipelineId: string, stageData: Omit<Pipeline["stages"][0], "id">): Promise<Pipeline | undefined> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) return undefined;

    const stage = {
      ...stageData,
      id: this.generateStageId(),
    };
    
    pipeline.stages.push(stage);
    return pipeline;
  }

  private generateId(): string {
    return `pipeline_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  private generateStageId(): string {
    return `stage_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}