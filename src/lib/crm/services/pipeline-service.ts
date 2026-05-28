import { PipelineRepository } from "../repository/pipeline-repository";
import type { Pipeline, Stage } from "../core/crm-entities";
import { DEFAULT_PIPELINE } from "../core/crm-constants";

export class PipelineService {
  private repository = new PipelineRepository();

  async createDefault(tenantId: string): Promise<Pipeline> {
    return this.repository.create({
      tenantId,
      name: DEFAULT_PIPELINE.name,
      description: DEFAULT_PIPELINE.description,
      isActive: true,
    });
  }

  async createCustom(tenantId: string, name: string, description?: string): Promise<Pipeline> {
    return this.repository.create({
      tenantId,
      name,
      description,
      isActive: true,
    });
  }

  async getByTenant(tenantId: string): Promise<Pipeline[]> {
    return this.repository.findByTenant(tenantId);
  }

  async getById(pipelineId: string, tenantId: string): Promise<Pipeline | undefined> {
    return this.repository.findById(pipelineId, tenantId);
  }

  async addStage(pipelineId: string, stage: Omit<Stage, "id">): Promise<Pipeline | undefined> {
    return this.repository.addStage(pipelineId, stage);
  }

  async getStageProbability(pipelineId: string, stageId: string): Promise<number | undefined> {
    const pipeline = await this.repository.findById(pipelineId, "");
    const stage = pipeline?.stages.find((s) => s.id === stageId);
    return stage?.probability;
  }
}

export const pipelineService = new PipelineService();