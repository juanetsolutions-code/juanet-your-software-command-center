/**
 * Rule Parser - Parses JSON rule definitions safely.
 */

import type { Rule } from './rule-types';

export function parseRule(json: string): Rule {
  const parsed = JSON.parse(json);
  if (!parsed.id || !parsed.condition || !parsed.actions) {
    throw new Error('Invalid rule definition');
  }
  return parsed as Rule;
}
