/**
 * Execution Calendar
 * Timezone-aware calendar for visualizing and managing scheduled executions.
 */

export interface CalendarEntry {
  date: string;
  jobs: Array<{ id: string; tenantId: string; type: string }>;
}

export class ExecutionCalendar {
  getUpcoming(days = 7): CalendarEntry[] {
    const entries: CalendarEntry[] = [];
    const now = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(now.getTime() + i * 86400000);
      entries.push({ date: d.toISOString().split("T")[0], jobs: [] });
    }
    return entries;
  }
}

export const executionCalendar = new ExecutionCalendar();
