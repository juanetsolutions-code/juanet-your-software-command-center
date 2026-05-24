const PATTERNS: Array<{ kind: string; regex: RegExp }> = [
  { kind: "email", regex: /[\w.+-]+@[\w-]+\.[\w.-]+/g },
  { kind: "credit_card", regex: /\b(?:\d[ -]*?){13,16}\b/g },
  { kind: "ssn_us", regex: /\b\d{3}-\d{2}-\d{4}\b/g },
  { kind: "phone", regex: /\b\+?\d[\d\s().-]{7,}\d\b/g },
  { kind: "iban", regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{4,30}\b/g },
];

export interface SensitiveFinding {
  kind: string;
  count: number;
}

export function scanForSensitiveData(text: string): SensitiveFinding[] {
  const findings: SensitiveFinding[] = [];
  for (const { kind, regex } of PATTERNS) {
    const matches = text.match(regex);
    if (matches && matches.length > 0) findings.push({ kind, count: matches.length });
  }
  return findings;
}

export function redact(text: string): string {
  let out = text;
  for (const { regex } of PATTERNS) out = out.replace(regex, "[REDACTED]");
  return out;
}
