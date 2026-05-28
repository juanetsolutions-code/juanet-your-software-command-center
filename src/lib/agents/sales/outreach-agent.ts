import type { Lead } from "@/lib/crm/core/crm-entities";
import { BaseAgent, type AgentTask, type AgentType, type AgentCapability } from "../agent-swarm/agent-types";
import { emitEvent } from "@/lib/event-bus";

export type OutreachMessage = {
  id: string;
  leadId: string;
  channel: "email" | "in_app" | "webhook";
  subject: string;
  content: string;
  timestamp: string;
};

export type OutreachSequence = {
  id: string;
  leadId: string;
  steps: OutreachMessage[];
  currentStep: number;
  completed: boolean;
};

export class OutreachAgent extends BaseAgent {
  readonly id = "outreach-agent";
  readonly type: AgentType = "sales";
  readonly capabilities: AgentCapability[] = [
    { name: "message_generation", version: "1.0", description: "Generates personalized outreach messages" },
    { name: "channel_routing", version: "1.0", description: "Routes messages to appropriate channels" },
  ];

  private sequences: Map<string, OutreachSequence> = new Map();

  async generateMessage(lead: Lead, channel: "email" | "in_app" | "webhook" = "email"): Promise<OutreachMessage> {
    const message: OutreachMessage = {
      id: `msg_${Date.now()}`,
      leadId: lead.id,
      channel,
      subject: this.generateSubject(lead),
      content: this.generateContent(lead),
      timestamp: new Date().toISOString(),
    };

    emitEvent({
      id: `evt_${Date.now()}`,
      type: "outreach.message_generated",
      tenantId: lead.tenantId,
      timestamp: new Date().toISOString(),
      payload: { messageId: message.id, leadId: lead.id, channel },
      version: "1.0",
    });

    return message;
  }

  private generateSubject(lead: Lead): string {
    const templates = [
      "Quick question about {company}",
      "{firstName}, ready to unlock more from Juanet?",
      "Juanet + {company} = better results",
      "See how {company} can get more from our platform",
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template
      .replace("{company}", lead.company ?? "")
      .replace("{firstName}", lead.firstName);
  }

  private generateContent(lead: Lead): string {
    return `Hi ${lead.firstName},\n\nI noticed ${lead.company ? `${lead.company} has` : 'you\'ve'} been exploring Juanet. I wanted to reach out to see how we can help you get more value from our platform.\n\nWould you have 15 minutes this week for a quick call?\n\nBest regards,\nThe Juanet Team`;
  }

  async startSequence(lead: Lead): Promise<OutreachSequence> {
    const sequence: OutreachSequence = {
      id: `seq_${Date.now()}`,
      leadId: lead.id,
      steps: [],
      currentStep: 0,
      completed: false,
    };

    const channels: ("email" | "in_app")[] = ["email", "email", "in_app"];
    
    for (let i = 0; i < channels.length; i++) {
      const message = await this.generateMessage(lead, channels[i]);
      sequence.steps.push(message);
    }

    this.sequences.set(sequence.id, sequence);
    return sequence;
  }

  async onTask(task: AgentTask): Promise<void> {
    this.setStatus("in_progress");
    
    if (task.type === "generate_outreach") {
      const lead = (task.payload as any).lead as Lead;
      if (lead) {
        await this.generateMessage(lead);
      }
    }
    
    this.setStatus("idle");
  }
}

export const outreachAgent = new OutreachAgent();