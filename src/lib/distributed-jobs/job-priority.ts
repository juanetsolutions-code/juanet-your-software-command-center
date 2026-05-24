export type JobPriority = "low" | "normal" | "high" | "critical";

export function computePriority(job: { name: string; priority?: JobPriority }): JobPriority {
  if (job.priority) return job.priority;
  if (job.name.includes("billing") || job.name.includes("payment")) return "high";
  if (job.name.includes("alert") || job.name.includes("security")) return "critical";
  return "normal";
}

export const PRIORITY_WEIGHT: Record<JobPriority, number> = {
  critical: 100,
  high: 50,
  normal: 10,
  low: 1,
};
