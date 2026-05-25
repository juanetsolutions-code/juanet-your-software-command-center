/**
 * Queue Monitoring
 * Operational metrics and health for the queue system.
 */

export interface QueueMetrics {
  pendingJobs: number;
  processingJobs: number;
  failedJobs: number;
  avgProcessingTimeMs: number;
}

export class QueueMonitoring {
  private metrics: QueueMetrics = {
    pendingJobs: 0,
    processingJobs: 0,
    failedJobs: 0,
    avgProcessingTimeMs: 0,
  };

  getMetrics(): QueueMetrics {
    return { ...this.metrics };
  }

  recordProcessingTime(ms: number): void {
    this.metrics.avgProcessingTimeMs = (this.metrics.avgProcessingTimeMs + ms) / 2;
  }
}

export const queueMonitoring = new QueueMonitoring();
