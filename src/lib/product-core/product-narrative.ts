export type ProductNarrative = {
  tagline: string;
  oneLine: string;
  primaryWorkflow: string[];
  firstTenMinutes: string[];
};

export const PRODUCT_NARRATIVE: ProductNarrative = {
  tagline: "Your autonomous sales machine",
  oneLine: "Juanet automatically finds, qualifies, and closes deals for your business.",
  primaryWorkflow: [
    "Import or capture leads",
    "AI scores and prioritizes them",
    "Follow up through automated sequences",
    "Close deals with AI guidance",
  ],
  firstTenMinutes: [
    "Connect your email or import contacts",
    "See your first qualified lead in 2 minutes",
    "Get your first action recommendation",
    "Review potential revenue pipeline",
  ],
};