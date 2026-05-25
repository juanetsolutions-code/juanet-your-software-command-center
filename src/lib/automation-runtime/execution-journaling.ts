/**
 * Execution Journaling
 * Immutable log of every step execution for audit and replay.
 */

export interface ExecutionJournalEntry {
  executionId: string;
  step: number;
  action: string;
  result: any;
  timestamp: string;
}

export class ExecutionJournaling {
  private journal: ExecutionJournalEntry[] = [];

  log(entry: Omit<ExecutionJournalEntry, "timestamp">): void {
    this.journal.push({ ...entry, timestamp: new Date().toISOString() });
  }

  getJournal(executionId: string): ExecutionJournalEntry[] {
    return this.journal.filter((e) => e.executionId === executionId);
  }
}

export const executionJournaling = new ExecutionJournaling();
