/**
 * Pipeline Monitoring
 * Observability, metrics, and alerting for all data pipelines.
 */

export interface PipelineMetric {
  pipeline: string;
  tenantId: string;
  metric: string;
  value: number;
  timestamp: string;
}

export class PipelineMonitoring {
  private metrics: PipelineMetric[] = [];

  record(pipeline: string, tenantId: string, metric: string, value: number): void {
    this.metrics.push({
      pipeline,
      tenantId,
      metric,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}

export const pipelineMonitoring = new PipelineMonitoring();
