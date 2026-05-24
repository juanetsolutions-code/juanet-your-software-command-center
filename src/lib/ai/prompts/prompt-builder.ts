/**
 * Prompt Builder - Builds prompts with context and safety.
 */

import { sanitizeContextForAI } from "../ai-context";

export function buildPrompt(
  template: string,
  variables: Record<string, any> = {},
  context?: any,
): string {
  let prompt = template;

  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  });

  // Inject safe context
  if (context) {
    const safeContext = sanitizeContextForAI(context);
    prompt += `\n\nContext: ${JSON.stringify(safeContext)}`;
  }

  return prompt;
}
