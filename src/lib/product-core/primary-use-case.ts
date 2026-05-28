import type { Lead } from "@/lib/crm/core/crm-entities";

export type PrimaryUseCase = {
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  kpi: string;
};

export const PRIMARY_USE_CASE: PrimaryUseCase = {
  name: "Automated Deal Closing",
  description: "Turn leads into revenue with minimal manual work",
  inputs: ["Leads (imported or captured)", "Deal stages", "Communication history"],
  outputs: ["Qualified leads", "Scheduled follow-ups", "Closed deals", "Revenue reports"],
  kpi: "Revenue per qualified lead",
};