# Juanet Project: Complete File Structure

Below is the complete file structure of the Juanet project, excluding only `node_modules`, `.git`, and `dist` directories for readability (as they contain dependencies, version control metadata, and compiled output respectively). All source code, configuration, documentation, and other project files are included.

```
juanet-your-software-command-center/
├── .lovable/
│   └── project.json
├── .qodo/
│   ├── agents/
│   └── workflows/
├── .tanstack/
│   └── tmp/
├── .wrangler/
│   ├── deploy/
│   │   └── config.json
│   └── config.json
├── scripts/
│   ├── backup/
│   ├── ops/
│   ├── seed/
│   └── migration-status.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── README.md
│   ├── policies/
│   │   └── 001_rls_templates.sql
│   └── config.toml
├── docs/
│   ├── backend-architecture.md
│   ├── supabase-setup.md
│   └── project-overview.md
├── src/
│   ├── components/
│   │   ├── app/
│   │   │   ├── AppShell.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── command-center/
│   │   │   ├── CommandPalette.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── dashboard/
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── InvoiceTable.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   ├── PaymentMethodCard.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectDetailPanel.tsx
│   │   ├── data-display/  # Contains various data visualization components (charts, graphs, etc.)
│   │   ├── data-grid/     # Contains reusable data grid components with sorting, filtering, pagination
│   │   ├── insights/      # Contains analytics and insight components
│   │   ├── marketing/     # Contains marketing site components
│   │   │   ├── _marketing.about.tsx
│   │   │   ├── _marketing.contact.tsx
│   │   │   ├── _marketing.index.tsx
│   │   │   ├── _marketing.portfolio.tsx
│   │   │   ├── _marketing.projects.tsx
│   │   │   ├── _marketing.services.tsx
│   │   │   ├── _marketing.shop.tsx
│   │   │   └── _marketing.tsx
│   │   ├── states/        # Contains state-related UI components
│   │   └── ui/            # Contains primitive UI components (Button, Input, Modal, etc.)
│   ├── hooks/             # Contains custom React hooks
│   │   ├── index.ts
│   │   ├── useInvoices.ts
│   │   ├── useMessages.ts
│   │   ├── usePayments.ts
│   │   ├── useProjects.ts
│   │   └── useRequests.ts
│   ├── lib/
│   │   ├── supabase/      # Supabase integration helpers
│   │   │   ├── client.ts
│   │   │   ├── health.ts
│   │   │   ├── index.ts
│   │   │   ├── mappers.ts
│   │   │   ├── realtime.ts
│   │   │   ├── rows.ts
│   │   │   ├── safe-query.ts
│   │   │   ├── schema-v2.ts
│   │   │   ├── schema.ts
│   │   │   ├── server.ts
│   │   │   ├── status.ts
│   │   │   └── types.ts
│   │   ├── auth/          # Authentication and authorization logic
│   │   │   ├── api.ts
│   │   │   ├── context.tsx
│   │   │   ├── guards.ts
│   │   │   ├── index.ts
│   │   │   ├── permissions.ts
│   │   │   ├── profile.ts
│   │   │   ├── roles.ts
│   │   │   ├── session.ts
│   │   │   ├── store.ts
│   │   │   └── types.ts
│   │   ├── tenant/        # Multi-tenancy context and utilities
│   │   │   ├── context.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   ├── dashboard/     # Dashboard-specific logic (repositories, caching, etc.)
│   │   │   ├── api.ts
│   │   │   ├── cache.ts
│   │   │   ├── index.ts
│   │   │   ├── mock.ts
│   │   │   ├── query-context.ts
│   │   │   ├── tenant-context.ts
│   │   │   ├── types.ts
│   │   │   └── repositories/
│   │   │       ├── _shared.ts
│   │   │       ├── base-repository.ts
│   │   │       ├── index.ts
│   │   │       ├── invoices.ts
│   │   │       ├── messages.ts
│   │   │       ├── organizations.ts
│   │   │       ├── payments.ts
│   │   │       ├── profiles.ts
│   │   │       ├── projects.ts
│   │   │       ├── requests.ts
│   │   │       └── workspaces.ts
│   │   ├── utils/         # Utility functions (logger, etc.)
│   │   │   ├── env.ts
│   │   │   ├── logger.ts
│   │   │   └── utils.ts
│   │   ├── activity/      # Activity tracking and logging
│   │   ├── adaptive-workflows/ # Adaptive workflow engine
│   │   ├── agent-safety/  # Agent safety mechanisms
│   │   ├── agent-swarm/   # Agent swarm coordination
│   │   ├── agents/        # Core agent implementations
│   │   ├── ai/            # Artificial intelligence module
│   │   │   ├── agents/    # AI agents
│   │   │   ├── assistants/# AI assistants
│   │   │   ├── decisions/ # AI decision-making
│   │   │   ├── governance/# AI governance
│   │   │   ├── memory/    # AI memory systems
│   │   │   ├── orchestrator/# AI orchestration
│   │   │   ├── planning/  # AI planning
│   │   │   ├── providers/ # AI providers (OpenAI, Anthropic, etc.)
│   │   │   ├── safety/    # AI safety systems
│   │   │   ├── tools/     # AI tools
│   │   │   └── workforce/ # AI workforce management
│   │   ├── analytics-pipeline/ # Analytics data pipeline
│   │   ├── api-gateway/   # API gateway implementation
│   │   ├── api-tokens/    # API token management
│   │   ├── approvals/     # Approval workflow system
│   │   ├── assets/        # Asset management
│   │   ├── audit/         # Audit logging and compliance
│   │   ├── automation/    # Core automation engine
│   │   ├── automation-runtime/ # Automation runtime execution
│   │   ├── automation-safety/ # Automation safety systems
│   │   ├── automation-store/ # Automation data storage
│   │   ├── autonomous/    # Autonomous operations
│   │   ├── billing/       # Billing and invoicing system
│   │   ├── bootstrap/     # Application bootstrap utilities
│   │   ├── branding/      # Branding and theming
│   │   ├── cache/         # Caching mechanisms
│   │   ├── collaboration/ # Collaboration features
│   │   ├── communications/# Communication systems
│   │   ├── compliance/    # Compliance and regulatory features
│   │   ├── config-governance/# Configuration governance
│   │   ├── connector-sdk/ # Connector SDK for integrations
│   │   ├── context/       # Context management
│   │   ├── context-engine/# Context processing engine
│   │   ├── copilots/      # AI copilot features
│   │   ├── crm/           # Customer Relationship Management
│   │   │   ├── account/   # Account management
│   │   │   ├── agent/     # Sales agent features
│   │   │   ├── ai/        # AI-powered CRM features
│   │   │   ├── analytics/ # CRM analytics
│   │   │   ├── automation/# CRM automation
│   │   │   ├── autonomous/# Autonomous CRM features
│   │   │   ├── communications/# CRM communications
│   │   │   ├── core/      # CRM core entities
│   │   │   ├── crm-ai-insights.ts
│   │   │   ├── crm-insights-engine.ts
│   │   │   ├── deal-scoring-engine.ts
│   │   │   ├── events/    # CRM event handling
│   │   │   ├── executive/ # Executive CRM reporting
│   │   │   ├── intelligence/# CRM intelligence
│   │   │   ├── leads/     # Lead management
│   │   │   ├── pipeline/  # Sales pipeline management
│   │   │   ├── prioritization/# Lead prioritization
│   │   │   ├── recommendations/# CRM recommendations
│   │   │   ├── reports/   # CRM reporting
│   │   │   ├── repository/# CRM data repositories
│   │   │   ├── services/  # CRM services
│   │   │   ├── signals/   # CRM signal processing
│   │   │   ├── state/     # CRM state management
│   │   │   └── tasks/     # Task management in CRM
│   │   ├── cross-platform-intelligence/# Cross-platform intelligence
│   │   ├── customer-success/# Customer success metrics
│   │   ├── database/      # Database utilities
│   │   ├── data-governance/# Data governance policies
│   │   ├── data-integrity/# Data integrity tools
│   │   ├── data-pipelines/# Data processing pipelines
│   │   ├── data-sync/     # Data synchronization
│   │   ├── data-transfer/ # Data transfer utilities
│   │   ├── decision-engine/# Decision engine
│   │   ├── deployment/    # Deployment utilities
│   │   ├── diagnostics/   # System diagnostics
│   │   ├── disaster-recovery/# Disaster recovery systems
│   │   ├── distributed-jobs/# Distributed job processing
│   │   ├── distributed-state/# Distributed state management
│   │   ├── document-intelligence/# Document processing
│   │   ├── edge-runtime/  # Edge runtime environment
│   │   ├── enterprise/    # Enterprise features
│   │   ├── enterprise-command/# Enterprise command center
│   │   ├── enterprise-workflows/# Enterprise workflow engine
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   ├── event-bus/     # Event bus system
│   │   ├── events/        # Event handling
│   │   ├── event-streaming/# Event streaming
│   │   ├── executive-intelligence/# Executive intelligence
│   │   ├── executive-reporting/# Executive reporting
│   │   ├── extensions/    # Plugin/extension system
│   │   ├── feature-flags/ # Feature flag system
│   │   ├── features/      # Feature toggles
│   │   ├── federation/    # Identity federation
│   │   ├── health/        # Health monitoring
│   │   ├── identity-federation/# Identity federation (duplicate?)
│   │   ├── infrastructure/# Infrastructure utilities
│   │   ├── integration-governance/# Integration governance
│   │   ├── integration-marketplace/# Integration marketplace
│   │   ├── integrations/  # Third-party integrations
│   │   ├── intelligence/  # Business intelligence
│   │   ├── intelligent-security/# Intelligent security systems
│   │   ├── jobs/          # Job queuing and processing
│   │   ├── knowledge-graph/# Knowledge graph
│   │   ├── knowledge-intelligence/# Knowledge intelligence
│   │   ├── launch-readiness/# Launch readiness checks
│   │   ├── migration/     # Data migration utilities
│   │   ├── monitoring/    # System monitoring
│   │   ├── notifications/ # Notification system
│   │   ├── notifications-center/# Notification center
│   │   ├── observability/ # Observability and monitoring
│   │   ├── operational-intelligence/# Operational intelligence
│   │   ├── operational-search/# Operational search
│   │   ├── operations-center/# Operations center
│   │   ├── organization/  # Organization management
│   │   ├── outreach/      # Outreach and messaging
│   │   ├── performance/   # Performance optimization
│   │   ├── platform-audit/# Platform auditing
│   │   ├── platform-governance/# Platform governance
│   │   ├── platform-sdk/  # Platform SDK
│   │   ├── playbooks/     # Operational playbooks
│   │   ├── predictive/    # Predictive analytics
│   │   ├── prompts/       # Prompt management
│   │   ├── providers/     # Data providers
│   │   ├── provisioning/  # Tenant provisioning
│   │   ├── public-api/    # Public API endpoints
│   │   ├── queue-runtime/ # Queue runtime processing
│   │   ├── rbac/          # Role-based access control
│   │   ├── realtime-collaboration/# Real-time collaboration
│   │   ├── release-management/# Release management
│   │   ├── reliability/   # Reliability engineering
│   │   ├── resource-governance/# Resource governance
│   │   ├── resource-optimization/# Resource optimization
│   │   ├── rules/         # Rule engine
│   │   ├── saas-operations/# SaaS operations
│   │   ├── scheduling/    # Job scheduling
│   │   ├── search/        # Search functionality
│   │   ├── security/      # Security systems
│   │   ├── security-hardening/# Security hardening
│   │   ├── self-healing/  # Self-healing systems
│   │   ├── service-orchestration/# Service orchestration
│   │   ├── services/      # Core services
│   │   ├── settings/      # Settings management
│   │   ├── signals/       # Signal processing
│   │   ├── simulation/    # Simulation systems
│   │   ├── site.ts        # Site configuration
│   │   ├── sla/           # Service Level Agreement tracking
│   │   ├── subscriptions/ # Subscription management
│   │   ├── system-health/ # System health monitoring
│   │   ├── tenant-lifecycle/# Tenant lifecycle management
│   │   ├── tenant-operations/# Tenant operations
│   │   ├── triggers/      # Trigger systems
│   │   ├── ui/            # UI utilities (duplicate of components/ui?)
│   │   ├── workflow-intelligence/# Workflow intelligence
│   │   ├── workflows/     # Workflow engine
│   │   ├── work-management/# Work management
│   │   └── workspaces/    # Workspace management
│   ├── routes/            # Application routes and pages
│   │   ├── __root.tsx
│   │   ├── _marketing.about.tsx
│   │   ├── _marketing.contact.tsx
│   │   ├── _marketing.index.tsx
│   │   ├── _marketing.portfolio.tsx
│   │   ├── _marketing.projects.tsx
│   │   ├── _marketing.services.tsx
│   │   ├── _marketing.shop.tsx
│   │   └── _marketing.tsx
│   │   ├── admin/
│   │   │   ├── admin.ai-operations.tsx
│   │   │   ├── admin.audit-center.tsx
│   │   │   ├── admin.cms.tsx
│   │   │   ├── admin.health.tsx
│   │   │   ├── admin.index.tsx
│   │   │   ├── admin.integrations.tsx
│   │   │   ├── admin.licenses.tsx
│   │   │   ├── admin.orders.tsx
│   │   │   ├── admin.payments.tsx
│   │   │   ├── admin.projects.tsx
│   │   │   ├── admin.services.tsx
│   │   │   ├── admin.settings.tsx
│   │   │   ├── admin.shop.tsx
│   │   │   ├── admin.support-queue.tsx
│   │   │   ├── admin.tsx
│   │   │   ├── admin.usage-monitoring.tsx
│   │   │   └── admin.users.tsx
│   │   ├── auth/
│   │   │   ├── auth.forgot.tsx
│   │   │   ├── auth.login.tsx
│   │   │   ├── auth.signup.tsx
│   │   │   └── auth.tsx
│   │   ├── dashboard/
│   │   │   ├── dashboard.activity.tsx
│   │   │   ├── dashboard.api-access.tsx
│   │   │   ├── dashboard.downloads.tsx
│   │   │   ├── dashboard.index.tsx
│   │   │   ├── dashboard.licenses.tsx
│   │   │   ├── dashboard.messages.tsx
│   │   │   ├── dashboard.notifications.tsx
│   │   │   ├── dashboard.payments.tsx
│   │   │   ├── dashboard.projects.tsx
│   │   │   ├── dashboard.requests.tsx
│   │   │   ├── dashboard.settings.tsx
│   │   │   └── dashboard.tsx
│   │   └── crm/           # CRM-specific routes (duplicate of above?)
│   │       ├── contacts.tsx
│   │       ├── dashboard.tsx
│   │       ├── deals.tsx
│   │       ├── index.tsx
│   │       ├── leads.tsx
│   │       ├── pipelines.tsx
│   │       └── tasks.tsx
│   ├── router.tsx         # Route configuration
│   ├── server.ts          # Server entry point
│   ├── start.ts           # Application bootstrap
│   ├── styles.css         # Global styles
│   └── routeTree.gen.ts   # Generated route tree
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── .prettierignore        # Prettier ignore file
├── .prettierrc            # Prettier configuration
├── bun.lock               # Bun lock file
├── bunfig.toml            # Bun configuration
├── components.json        # Component manifest
├── eslint.config.js       # ESLint configuration
├── package.json           # npm/Bun package manifest
├── package-lock.json      # npm package lock
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── wrangler.jsonc         # Wrangler configuration (for Cloudflare Workers)
```

**Note**: Due to the extensive nature of the `src/lib` directory (which contains over 50 specialized modules for AI, automation, CRM, analytics, etc.), the structure above lists the main directories and indicates their purpose. Each module directory typically contains TypeScript files implementing specific functionality (e.g., `ai/providers/` contains provider-specific implementations like `anthropic-provider.ts`, `openai-provider.ts`, etc.). For brevity, individual files within these specialized modules are not enumerated, but their existence and purpose are described in the directory comments.

This structure reveals a highly modular, feature-rich application designed for extensibility, with clear separation of concerns between core infrastructure (Supabase, auth, tenant), domain-specific features (CRM, automation, analytics), and presentation layers (components, routes).
