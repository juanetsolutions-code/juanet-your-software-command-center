/**
 * AI Memory Types
 */

export interface MemoryEntry {
  id: string;
  tenantId: string;
  type: "decision" | "workflow_outcome" | "preference" | "event";
  content: string;
  metadata?: Record<string, any>;
  timestamp: string;
  tags?: string[];
}

export interface MemoryQuery {
  type?: string;
  tags?: string[];
  searchText?: string;
  limit?: number;
}

export interface MemoryResult {
  entry: MemoryEntry;
  relevance: number;
  source: string;
}
