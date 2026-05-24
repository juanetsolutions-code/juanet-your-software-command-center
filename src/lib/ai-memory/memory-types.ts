/**
 * AI Memory Types
 */

export interface MemoryEntry {
  id: string;
  tenantId: string;
  type: 'decision' | 'workflow_outcome' | 'preference' | 'event';
  content: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
