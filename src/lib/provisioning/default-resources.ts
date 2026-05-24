/**
 * Default Resources
 * Seeds starter projects, requests, and data for new tenants.
 */

export function loadDefaultResources(organizationId: string) {
  return {
    sampleProject: {
      name: "Welcome Project",
      description: "Get started with Juanet",
    },
    sampleRequests: 3,
  };
}
