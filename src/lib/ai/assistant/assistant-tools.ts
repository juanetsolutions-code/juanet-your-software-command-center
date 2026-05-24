/**
 * Assistant Tools - Tools the AI assistant can call (function calling prep).
 */

export interface AssistantTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  handler: (args: any, context: any) => Promise<any>;
}

const tools = new Map<string, AssistantTool>();

export function registerTool(tool: AssistantTool) {
  tools.set(tool.name, tool);
}

export function getAvailableTools(): AssistantTool[] {
  return Array.from(tools.values());
}

// Example tool registration
registerTool({
  name: "get_project_status",
  description: "Get status of a project",
  parameters: { projectId: "string" },
  handler: async (args, ctx) => {
    return { status: "in_progress", projectId: args.projectId };
  },
});
