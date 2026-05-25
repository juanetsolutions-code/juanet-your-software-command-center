/**
 * Enterprise Data Pipeline Infrastructure - Ingestion Pipeline
 * Supports structured, unstructured, and batch ingestion with tenant isolation.
 */

export interface IngestedRecord {
  id: string;
  tenantId: string;
  source: string;
  payload: any;
  ingestedAt: string;
  metadata: Record<string, any>;
}

export class IngestionPipeline {
  private records: IngestedRecord[] = [];

  ingest(
    tenantId: string,
    source: string,
    payload: any,
    metadata: Record<string, any> = {},
  ): IngestedRecord {
    const rec: IngestedRecord = {
      id: `ingest-${Date.now()}`,
      tenantId,
      source,
      payload,
      ingestedAt: new Date().toISOString(),
      metadata,
    };
    this.records.push(rec);
    return rec;
  }
}

export const ingestionPipeline = new IngestionPipeline();
