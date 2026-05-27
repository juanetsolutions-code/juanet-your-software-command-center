/**
 * Experimental Features - Hidden/beta feature flags
 */

export type ExperimentalFeature =
  | "ai_code_review"
  | "voice_messages"
  | "dark_mode_selector"
  | "advanced_filters";

const experimentalFlags: Map<string, boolean> = new Map();

export function enableExperimental(feature: ExperimentalFeature): void {
  experimentalFlags.set(feature, true);
}

export function disableExperimental(feature: ExperimentalFeature): void {
  experimentalFlags.set(feature, false);
}

export function isExperimentalEnabled(feature: ExperimentalFeature): boolean {
  return experimentalFlags.get(feature) ?? false;
}

export function listExperimentalFeatures(): ExperimentalFeature[] {
  return [...experimentalFlags.keys()]
    .filter((k) => experimentalFlags.get(k))
    .map((k) => k as ExperimentalFeature);
}
