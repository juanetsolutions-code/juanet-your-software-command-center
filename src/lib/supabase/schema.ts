/**
 * Supabase schema mapping definitions.
 *
 * This module is the single source of truth for how the dashboard's
 * TypeScript domain types map onto Postgres tables managed by Supabase.
 *
 * NOTHING IN HERE EXECUTES A QUERY. It only declares table names,
 * column names, primary/foreign keys, and the relations between
 * entities so that:
 *
 *   1. The API layer (`src/lib/dashboard/api.ts`) can build queries
 *      against stable string identifiers instead of magic strings.
 *   2. A future migration / SQL generator can produce DDL straight
 *      from these declarations.
 *   3. Reviewers can read one file to understand the entire backend
 *      shape before any Supabase project exists.
 *
 * Naming convention:
 *   - Table names use snake_case plurals (`service_requests`).
 *   - Column names use snake_case (`due_at`, `created_at`).
 *   - TypeScript domain types (camelCase) are translated at the
 *     adapter boundary — see `./mappers.ts`.
 */

// ---------- Table names ----------

export const TABLES = {
  profiles: "profiles",
  projects: "projects",
  serviceRequests: "service_requests",
  conversations: "conversations",
  conversationMembers: "conversation_members",
  messages: "messages",
  invoices: "invoices",
  payments: "payments",
  paymentMethods: "payment_methods",
  billingAddresses: "billing_addresses",
  activityLogs: "activity_logs",
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

// ---------- Column maps (domain ↔ database) ----------

/**
 * Each entry lists the canonical column names for that table.
 * Keep these in sync with `src/lib/dashboard/types.ts` and the
 * mock data in `src/lib/dashboard/mock.ts`.
 */
export const COLUMNS = {
  profiles: {
    id: "id", // FK -> auth.users.id
    fullName: "full_name",
    email: "email",
    role: "role", // 'client' | 'admin' | 'staff'
    avatarUrl: "avatar_url",
    createdAt: "created_at",
  },
  projects: {
    id: "id",
    name: "name",
    client: "client",
    category: "category",
    status: "status", // ProjectStatus
    progress: "progress",
    dueAt: "due_at",
    leadProfileId: "lead_profile_id", // FK -> profiles.id
    ownerProfileId: "owner_profile_id", // FK -> profiles.id (client)
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  serviceRequests: {
    id: "id",
    title: "title",
    description: "description",
    serviceSlug: "service_slug",
    budgetRange: "budget_range",
    timeline: "timeline",
    deadlineAt: "deadline_at",
    status: "status", // RequestStatus
    requestedByProfileId: "requested_by_profile_id", // FK -> profiles.id
    createdAt: "created_at",
  },
  conversations: {
    id: "id",
    name: "name",
    role: "role",
    projectId: "project_id", // FK -> projects.id (nullable)
    lastMessageAt: "last_message_at",
    createdAt: "created_at",
  },
  conversationMembers: {
    conversationId: "conversation_id", // FK -> conversations.id
    profileId: "profile_id", // FK -> profiles.id
    unreadCount: "unread_count",
    lastReadAt: "last_read_at",
  },
  messages: {
    id: "id",
    conversationId: "conversation_id", // FK -> conversations.id
    authorProfileId: "author_profile_id", // FK -> profiles.id
    text: "text",
    createdAt: "created_at",
  },
  invoices: {
    id: "id",
    projectId: "project_id", // FK -> projects.id
    projectName: "project_name", // denormalized for fast listing
    amount: "amount",
    currency: "currency",
    status: "status", // InvoiceStatus
    issuedAt: "issued_at",
    dueAt: "due_at",
    createdAt: "created_at",
  },
  payments: {
    id: "id",
    invoiceId: "invoice_id", // FK -> invoices.id
    paymentMethodId: "payment_method_id", // FK -> payment_methods.id
    amount: "amount",
    currency: "currency",
    status: "status", // 'succeeded' | 'pending' | 'failed'
    processor: "processor", // 'stripe' | 'mpesa' | 'manual'
    processorRef: "processor_ref",
    paidAt: "paid_at",
    createdAt: "created_at",
  },
  paymentMethods: {
    id: "id",
    ownerProfileId: "owner_profile_id", // FK -> profiles.id
    brand: "brand", // 'VISA' | 'MASTERCARD' | 'M-PESA' | ...
    last4: "last4",
    expiryLabel: "expiry_label",
    isPrimary: "is_primary",
    createdAt: "created_at",
  },
  billingAddresses: {
    id: "id",
    ownerProfileId: "owner_profile_id", // FK -> profiles.id
    name: "name",
    lines: "lines", // text[]
    createdAt: "created_at",
  },
  activityLogs: {
    id: "id",
    kind: "kind", // ActivityKind
    text: "text",
    actorProfileId: "actor_profile_id", // FK -> profiles.id (nullable)
    subjectTable: "subject_table",
    subjectId: "subject_id",
    createdAt: "created_at",
  },
} as const;

// ---------- Relations ----------

/**
 * Declarative description of foreign-key relationships. Used for
 * documentation today; later this can drive query-builder helpers
 * such as `select('*, lead:profiles!lead_profile_id(*)')`.
 */
export interface Relation {
  from: { table: TableName; column: string };
  to: { table: TableName; column: string };
  kind: "many-to-one" | "one-to-one" | "many-to-many";
}

export const RELATIONS: Relation[] = [
  {
    from: { table: TABLES.projects, column: COLUMNS.projects.leadProfileId },
    to: { table: TABLES.profiles, column: COLUMNS.profiles.id },
    kind: "many-to-one",
  },
  {
    from: { table: TABLES.projects, column: COLUMNS.projects.ownerProfileId },
    to: { table: TABLES.profiles, column: COLUMNS.profiles.id },
    kind: "many-to-one",
  },
  {
    from: {
      table: TABLES.serviceRequests,
      column: COLUMNS.serviceRequests.requestedByProfileId,
    },
    to: { table: TABLES.profiles, column: COLUMNS.profiles.id },
    kind: "many-to-one",
  },
  {
    from: { table: TABLES.conversations, column: COLUMNS.conversations.projectId },
    to: { table: TABLES.projects, column: COLUMNS.projects.id },
    kind: "many-to-one",
  },
  {
    from: {
      table: TABLES.conversationMembers,
      column: COLUMNS.conversationMembers.conversationId,
    },
    to: { table: TABLES.conversations, column: COLUMNS.conversations.id },
    kind: "many-to-one",
  },
  {
    from: {
      table: TABLES.conversationMembers,
      column: COLUMNS.conversationMembers.profileId,
    },
    to: { table: TABLES.profiles, column: COLUMNS.profiles.id },
    kind: "many-to-one",
  },
  {
    from: { table: TABLES.messages, column: COLUMNS.messages.conversationId },
    to: { table: TABLES.conversations, column: COLUMNS.conversations.id },
    kind: "many-to-one",
  },
  {
    from: { table: TABLES.messages, column: COLUMNS.messages.authorProfileId },
    to: { table: TABLES.profiles, column: COLUMNS.profiles.id },
    kind: "many-to-one",
  },
  {
    from: { table: TABLES.invoices, column: COLUMNS.invoices.projectId },
    to: { table: TABLES.projects, column: COLUMNS.projects.id },
    kind: "many-to-one",
  },
  {
    from: { table: TABLES.payments, column: COLUMNS.payments.invoiceId },
    to: { table: TABLES.invoices, column: COLUMNS.invoices.id },
    kind: "many-to-one",
  },
  {
    from: { table: TABLES.payments, column: COLUMNS.payments.paymentMethodId },
    to: { table: TABLES.paymentMethods, column: COLUMNS.paymentMethods.id },
    kind: "many-to-one",
  },
  {
    from: {
      table: TABLES.paymentMethods,
      column: COLUMNS.paymentMethods.ownerProfileId,
    },
    to: { table: TABLES.profiles, column: COLUMNS.profiles.id },
    kind: "many-to-one",
  },
  {
    from: {
      table: TABLES.billingAddresses,
      column: COLUMNS.billingAddresses.ownerProfileId,
    },
    to: { table: TABLES.profiles, column: COLUMNS.profiles.id },
    kind: "many-to-one",
  },
];

// ---------- Primary keys ----------

export const PRIMARY_KEYS: Record<TableName, string | string[]> = {
  [TABLES.profiles]: COLUMNS.profiles.id,
  [TABLES.projects]: COLUMNS.projects.id,
  [TABLES.serviceRequests]: COLUMNS.serviceRequests.id,
  [TABLES.conversations]: COLUMNS.conversations.id,
  [TABLES.conversationMembers]: [
    COLUMNS.conversationMembers.conversationId,
    COLUMNS.conversationMembers.profileId,
  ],
  [TABLES.messages]: COLUMNS.messages.id,
  [TABLES.invoices]: COLUMNS.invoices.id,
  [TABLES.payments]: COLUMNS.payments.id,
  [TABLES.paymentMethods]: COLUMNS.paymentMethods.id,
  [TABLES.billingAddresses]: COLUMNS.billingAddresses.id,
  [TABLES.activityLogs]: COLUMNS.activityLogs.id,
};
