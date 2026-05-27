/**
 * Activity Feed - Centralized activity system
 */

export type ActivityKind =
  | "deploy"
  | "message"
  | "invoice"
  | "license"
  | "request"
  | "project"
  | "user"
  | "system";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  text: string;
  timeLabel: string;
  timestamp: string;
  userId?: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityFeedOptions {
  limit?: number;
  kinds?: ActivityKind[];
  userId?: string;
  tenantId?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: "a-1",
    kind: "deploy",
    text: "atlas-core deployed to staging",
    timeLabel: "12m ago",
    timestamp: "2026-05-27T22:00:00Z",
  },
  {
    id: "a-2",
    kind: "message",
    text: "Marcus replied on Skyline LMS",
    timeLabel: "1h ago",
    timestamp: "2026-05-27T21:00:00Z",
  },
  {
    id: "a-3",
    kind: "invoice",
    text: "INV-1042 paid via M-Pesa",
    timeLabel: "3h ago",
    timestamp: "2026-05-27T19:00:00Z",
  },
  {
    id: "a-4",
    kind: "license",
    text: "Pulse CRM key issued",
    timeLabel: "Yesterday",
    timestamp: "2026-05-26T10:00:00Z",
  },
  {
    id: "a-5",
    kind: "request",
    text: "New request: Internal HR portal",
    timeLabel: "2d ago",
    timestamp: "2026-05-25T10:00:00Z",
  },
  {
    id: "a-6",
    kind: "project",
    text: "Harvest ERP status updated to planning",
    timeLabel: "3d ago",
    timestamp: "2026-05-24T10:00:00Z",
  },
];

export function listActivity(options: ActivityFeedOptions = {}): ActivityItem[] {
  let result = [...mockActivities];

  if (options.kinds?.length) {
    result = result.filter((a) => options.kinds!.includes(a.kind));
  }

  if (options.userId) {
    result = result.filter((a) => a.userId === options.userId);
  }

  if (options.tenantId) {
    result = result.filter((a) => a.tenantId === options.tenantId);
  }

  if (options.limit) {
    result = result.slice(0, options.limit);
  }

  return result;
}

export function getRecentActivity(limit = 5): ActivityItem[] {
  return listActivity({ limit });
}

export function recordActivity(activity: Omit<ActivityItem, "id" | "timeLabel">): ActivityItem {
  const newActivity: ActivityItem = {
    ...activity,
    id: `a-${Date.now()}`,
    timeLabel: "Just now",
  };
  mockActivities.unshift(newActivity);
  return newActivity;
}
