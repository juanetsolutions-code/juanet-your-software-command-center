export * from "./integration-registry";
export * from "./oauth";
export * from "./webhook-manager";
export * from "./integration-types";

// Integration registry re-exports might define IntegrationConfig; avoid duplicate re-exports in higher-level index by keeping namespaced imports in code.

// Production Integration Framework Extensions (additive)
export * from "./oauth-connectors";
export * from "./webhook-engine";
export * from "./provider-adapters";
export * from "./sync-engine";
export * from "./integration-health";
export * from "./integration-auth";

// Advanced Integration Orchestration Extensions (additive)
export * from "./integration-workflows";
export * from "./sync-reconciliation";
export * from "./integration-queues";
export * from "./provider-failover";
export * from "./adaptive-sync";

// Enterprise Integrations & Connectivity Ecosystem - Core Infrastructure (additive)
export * from "./integration-runtime";
export * from "./integration-manager";
export * from "./integration-lifecycle";
