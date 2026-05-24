/**
 * Message Context for AI.
 */

export function buildMessageContext(messages: any[]) {
  return {
    count: messages.length,
    lastMessage: messages[messages.length - 1]?.text || "",
    participants: [...new Set(messages.map((m) => m.author))],
  };
}
