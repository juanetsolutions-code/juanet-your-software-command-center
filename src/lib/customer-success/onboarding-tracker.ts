/**
 * Onboarding Tracker
 * Tracks tenant onboarding progress and maturity.
 */

export interface OnboardingStep {
  name: string;
  completed: boolean;
  completedAt?: string;
}

const onboardingProgress = new Map<string, OnboardingStep[]>();

export function trackOnboardingStep(tenantId: string, stepName: string) {
  const steps = onboardingProgress.get(tenantId) || [];
  const existing = steps.find((s) => s.name === stepName);

  if (existing) {
    existing.completed = true;
    existing.completedAt = new Date().toISOString();
  } else {
    steps.push({
      name: stepName,
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }

  onboardingProgress.set(tenantId, steps);
}

export function getOnboardingProgress(tenantId: string) {
  return onboardingProgress.get(tenantId) || [];
}

export function getOnboardingCompletionRate(tenantId: string): number {
  const steps = getOnboardingProgress(tenantId);
  if (steps.length === 0) return 0;
  const completed = steps.filter((s) => s.completed).length;
  return Math.round((completed / steps.length) * 100);
}
