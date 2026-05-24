/**
 * Project Context for AI consumption.
 */

export function buildProjectContext(project: any) {
  return {
    id: project.id,
    name: project.name,
    status: project.status,
    progress: project.progress,
    summary: `Project ${project.name} is ${project.status} at ${project.progress}%`,
  };
}
