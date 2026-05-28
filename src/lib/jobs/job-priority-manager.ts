import type { Job, JobPriority } from "./job-scheduler";

export type PriorityRule = {
  condition: (job: Job) => boolean;
  priority: JobPriority;
};

class PriorityManager {
  private rules: PriorityRule[] = [];
  private defaultPriority: JobPriority = "normal";

  addRule(rule: PriorityRule): void {
    this.rules.push(rule);
  }

  removeRule(rule: PriorityRule): void {
    const index = this.rules.indexOf(rule);
    if (index > -1) {
      this.rules.splice(index, 1);
    }
  }

  determinePriority(job: Job): JobPriority {
    for (const rule of this.rules) {
      if (rule.condition(job)) {
        return rule.priority;
      }
    }
    return this.defaultPriority;
  }

  setDefaultPriority(priority: JobPriority): void {
    this.defaultPriority = priority;
  }

  getRules(): PriorityRule[] {
    return [...this.rules];
  }
}

export const priorityManager = new PriorityManager();

export function addPriorityRule(rule: PriorityRule): void {
  priorityManager.addRule(rule);
}

export function getJobPriority(job: Job): JobPriority {
  return priorityManager.determinePriority(job);
}