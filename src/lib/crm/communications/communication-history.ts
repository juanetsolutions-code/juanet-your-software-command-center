import type { Communication } from "./email-logging";
import type { Contact } from "../core/crm-entities";

export class CommunicationHistory {
  private history: Map<string, Communication[]> = new Map();

  add(communication: Communication): void {
    const existing = this.history.get(communication.contactId) || [];
    existing.push(communication);
    this.history.set(communication.contactId, existing);
  }

  getAll(contactId: string): Communication[] {
    return this.history.get(contactId) || [];
  }

  getLastInteraction(contactId: string): Communication | undefined {
    const history = this.getAll(contactId);
    if (history.length === 0) return undefined;
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }

  getInteractionScore(contact: Contact, communications: Communication[]): number {
    if (communications.length === 0) return 0;
    
    const recentCount = communications.filter((c) => {
      const ts = new Date(c.timestamp).getTime();
      return ts > Date.now() - 30 * 24 * 60 * 60 * 1000;
    }).length;
    
    return Math.min(100, recentCount * 20);
  }
}