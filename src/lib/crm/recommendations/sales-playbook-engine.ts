import type { Deal } from "../core/crm-entities";

export type Playbook = {
  id: string;
  name: string;
  stages: string[];
  actions: Array<{ stage: string; action: string; timing: string }>;
};

export class SalesPlaybookEngine {
  private playbooks: Playbook[] = [
    {
      id: "default",
      name: "Standard Sales Process",
      stages: ["prospecting", "qualification", "proposal", "negotiation"],
      actions: [
        { stage: "prospecting", action: "Initial outreach call", timing: "24h" },
        { stage: "qualification", action: "Discovery meeting", timing: "48h" },
        { stage: "proposal", action: "Send formal proposal", timing: "72h" },
        { stage: "negotiation", action: "Address objections", timing: "daily" },
      ],
    },
  ];

  getPlaybook(stage: Deal["stage"]): string[] {
    const playbook = this.playbooks[0];
    return playbook.actions
      .filter(a => a.stage === stage)
      .map(a => `${a.timing}: ${a.action}`);
  }

  getAllPlaybooks(): Playbook[] {
    return this.playbooks;
  }
}

export const salesPlaybook = new SalesPlaybookEngine();