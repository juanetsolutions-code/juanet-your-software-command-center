export type DataClassification = "public" | "internal" | "confidential" | "restricted";

const classifications = new Map<string, DataClassification>();

export function classify(resource: string, level: DataClassification) {
  classifications.set(resource, level);
}

export function getClassification(resource: string): DataClassification {
  return classifications.get(resource) ?? "internal";
}

export function isAtLeast(actual: DataClassification, required: DataClassification): boolean {
  const order: DataClassification[] = ["public", "internal", "confidential", "restricted"];
  return order.indexOf(actual) >= order.indexOf(required);
}
