/**
 * Prompt Safety - Prevents prompt injection and unsafe content.
 */

export function sanitizePrompt(prompt: string): string {
  // Basic injection prevention
  return prompt
    .replace(/ignore previous instructions/gi, "[REDACTED]")
    .replace(/system:/gi, "[REDACTED]")
    .slice(0, 8000); // hard length limit
}

export function validatePromptSafety(prompt: string): boolean {
  const dangerousPatterns = [
    /ignore (all|previous) instructions/i,
    /you are now/i,
    /forget everything/i,
  ];

  return !dangerousPatterns.some((p) => p.test(prompt));
}
