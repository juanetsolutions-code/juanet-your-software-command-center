export type EncryptionScheme = "none" | "at-rest" | "in-transit" | "end-to-end";

export interface EncryptionPolicy {
  resource: string;
  scheme: EncryptionScheme;
  rotateDays?: number;
}

const policies = new Map<string, EncryptionPolicy>();

export function setEncryptionPolicy(p: EncryptionPolicy) {
  policies.set(p.resource, p);
}

export function getEncryptionPolicy(resource: string): EncryptionPolicy {
  return policies.get(resource) ?? { resource, scheme: "at-rest" };
}
