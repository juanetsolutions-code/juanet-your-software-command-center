/**
 * Stream Partitions
 * Manages partitioning for scalable event streaming.
 */

export class StreamPartitions {
  getPartition(tenantId: string, key: string): number {
    // Simple hash partitioning
    return Math.abs((tenantId + key).split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 8;
  }
}

export const streamPartitions = new StreamPartitions();
