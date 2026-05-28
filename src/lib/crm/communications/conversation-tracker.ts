import type { Communication } from "./email-logging";
import type { Contact } from "../core/crm-entities";

export type Conversation = {
  id: string;
  contactId: string;
  startTime: string;
  endTime?: string;
  summary?: string;
  outcome?: "connected" | "voicemail" | "no_answer";
  nextSteps?: string;
};

export class ConversationTracker {
  private conversations: Map<string, Conversation> = new Map();

  start(contactId: string): Conversation {
    const conv: Conversation = {
      id: `conv_${Date.now()}`,
      contactId,
      startTime: new Date().toISOString(),
    };
    this.conversations.set(conv.id, conv);
    return conv;
  }

  end(id: string, outcome?: "connected" | "voicemail" | "no_answer", summary?: string): Conversation | undefined {
    const conv = this.conversations.get(id);
    if (!conv) return undefined;
    conv.endTime = new Date().toISOString();
    conv.outcome = outcome;
    conv.summary = summary;
    return conv;
  }

  linkToCommunication(conversationId: string, communication: Communication): void {
    // Link conversation to CRM communication log
    console.log(`Linking conversation ${conversationId} to communication ${communication.id}`);
  }
}

export const conversationTracker = new ConversationTracker();