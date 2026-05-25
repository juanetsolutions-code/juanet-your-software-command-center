/**
 * Intelligent Security Analysis - Behavioral Analysis
 * Profiles normal vs anomalous user and system behavior for threat detection prep.
 */

export interface BehaviorProfile {
  tenantId: string;
  subjectId: string;
  subjectType: "user" | "service" | "api_key";
  normalPatterns: Record<string, any>;
  lastUpdated: string;
  deviationScore: number;
}

export class BehavioralAnalysis {
  private profiles = new Map<string, BehaviorProfile>();

  updateProfile(
    tenantId: string,
    subjectId: string,
    observed: Record<string, any>,
  ): BehaviorProfile {
    const key = `${tenantId}:${subjectId}`;
    const existing = this.profiles.get(key);
    const profile: BehaviorProfile = existing || {
      tenantId,
      subjectId,
      subjectType: "user",
      normalPatterns: {},
      lastUpdated: "",
      deviationScore: 0,
    };

    profile.normalPatterns = { ...profile.normalPatterns, ...observed };
    profile.lastUpdated = new Date().toISOString();
    profile.deviationScore = Math.random() * 0.3; // stub

    this.profiles.set(key, profile);
    return profile;
  }
}

export const behavioralAnalysis = new BehavioralAnalysis();
