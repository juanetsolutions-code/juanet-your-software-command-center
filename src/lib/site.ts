export const site = {
  name: "Juanet",
  tagline: "Building Software Infrastructure For Modern Businesses",
  description:
    "Juanet helps businesses design, build, deploy, and scale modern software systems through custom development, SaaS products, automation, and enterprise infrastructure.",
};

export const marketingNav = [
  { label: "Home", to: "/" as const },
  { label: "Services", to: "/services" as const },
  { label: "Projects", to: "/projects" as const },
  { label: "Portfolio", to: "/portfolio" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: string;
};

export const services: Service[] = [
  { slug: "custom-software", title: "Custom Software Development", description: "Bespoke systems engineered around your operations, from idea to deployment.", icon: "Code2" },
  { slug: "saas", title: "SaaS Development", description: "Multi-tenant SaaS platforms with billing, auth, and dashboards built-in.", icon: "Cloud" },
  { slug: "automation", title: "Automation Systems", description: "Replace manual workflows with reliable, observable automation pipelines.", icon: "Workflow" },
  { slug: "cloud", title: "Cloud Infrastructure", description: "Production-grade infra: Docker, CI/CD, scaling, observability, on any cloud.", icon: "Server" },
  { slug: "design", title: "UI/UX Design", description: "Design systems and product UX that convert and scale with your roadmap.", icon: "Palette" },
  { slug: "api", title: "API Integrations", description: "Connect Stripe, M-Pesa, ERPs and 3rd-party systems with bulletproof APIs.", icon: "PlugZap" },
  { slug: "ai", title: "AI Solutions", description: "LLM-powered features, RAG, agents and ML pipelines wired into your product.", icon: "Sparkles" },
  { slug: "enterprise", title: "Enterprise Systems", description: "ERPs, internal tools and mission-critical platforms built to last.", icon: "Building2" },
];

export type OngoingProject = {
  id: string;
  name: string;
  client: string;
  category: string;
  status: "Planning" | "In Progress" | "QA" | "Launching";
  progress: number;
  due: string;
};

export const ongoingProjects: OngoingProject[] = [
  { id: "p-01", name: "Atlas Banking Core", client: "Atlas Financial", category: "FinTech", status: "In Progress", progress: 64, due: "Q3 2025" },
  { id: "p-02", name: "MediTrack HMS", client: "Nairobi Health Group", category: "Healthcare", status: "QA", progress: 88, due: "Aug 2025" },
  { id: "p-03", name: "Harvest ERP", client: "Greenfields Co.", category: "Agritech", status: "Planning", progress: 22, due: "Q4 2025" },
  { id: "p-04", name: "Skyline LMS", client: "Skyline Academy", category: "Education", status: "Launching", progress: 96, due: "Jul 2025" },
  { id: "p-05", name: "RetailOps CRM", client: "Urban Retail", category: "Retail", status: "In Progress", progress: 48, due: "Sep 2025" },
  { id: "p-06", name: "Logix Fleet", client: "Logix Logistics", category: "Logistics", status: "In Progress", progress: 71, due: "Oct 2025" },
];

export type PortfolioItem = {
  id: string;
  title: string;
  category: "School" | "CRM" | "Inventory" | "LMS" | "Hospital" | "Finance";
  tagline: string;
};

export const portfolio: PortfolioItem[] = [
  { id: "f-01", title: "Scholaris — School Management System", category: "School", tagline: "End-to-end school operations: students, fees, exams, parents." },
  { id: "f-02", title: "Pulse CRM", category: "CRM", tagline: "Pipeline, contacts and revenue intelligence for B2B teams." },
  { id: "f-03", title: "StockGrid Inventory", category: "Inventory", tagline: "Multi-warehouse stock with barcoding and forecasting." },
  { id: "f-04", title: "Lumen LMS", category: "LMS", tagline: "Modern learning management with live classes and analytics." },
  { id: "f-05", title: "MediCore HMS", category: "Hospital", tagline: "Patient records, billing and pharmacy in one secure suite." },
  { id: "f-06", title: "Ledger Finance Suite", category: "Finance", tagline: "Books, invoicing and reconciliations for growing companies." },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  tagline: string;
};

export const products: Product[] = [
  { id: "m-01", name: "Scholaris SMS — Standard", category: "Education", price: 499, rating: 4.9, reviews: 132, tagline: "School management system, self-hosted license." },
  { id: "m-02", name: "Pulse CRM — Team", category: "CRM", price: 299, rating: 4.8, reviews: 98, tagline: "CRM with pipeline, contacts, automation." },
  { id: "m-03", name: "StockGrid Pro", category: "Inventory", price: 399, rating: 4.7, reviews: 64, tagline: "Inventory & POS with barcoding." },
  { id: "m-04", name: "Lumen LMS", category: "Education", price: 349, rating: 4.9, reviews: 77, tagline: "Modern LMS with live classes." },
  { id: "m-05", name: "MediCore HMS — Clinic", category: "Healthcare", price: 599, rating: 4.8, reviews: 41, tagline: "Hospital management for clinics." },
  { id: "m-06", name: "Ledger Suite", category: "Finance", price: 249, rating: 4.6, reviews: 53, tagline: "Accounting & invoicing platform." },
];

export const stats = [
  { label: "Systems Shipped", value: "120+" },
  { label: "Enterprise Clients", value: "45" },
  { label: "Countries Served", value: "12" },
  { label: "Uptime SLA", value: "99.99%" },
];

// ===== Client Dashboard demo data =====

export type ClientProject = {
  id: string;
  name: string;
  client: string;
  category: string;
  status: "pending" | "in progress" | "completed";
  progress: number;
  due: string;
  lead: string;
  updated: string;
};

export const clientProjects: ClientProject[] = [
  { id: "cp-01", name: "Atlas Banking Core", client: "Atlas Financial", category: "FinTech", status: "in progress", progress: 64, due: "Sep 12, 2025", lead: "Marcus Otieno", updated: "12m ago" },
  { id: "cp-02", name: "MediTrack HMS", client: "Nairobi Health", category: "Healthcare", status: "in progress", progress: 88, due: "Aug 02, 2025", lead: "Aisha Kamau", updated: "1h ago" },
  { id: "cp-03", name: "Harvest ERP", client: "Greenfields", category: "Agritech", status: "pending", progress: 12, due: "Nov 20, 2025", lead: "Brian Mwangi", updated: "Yesterday" },
  { id: "cp-04", name: "Skyline LMS v2", client: "Skyline Academy", category: "Education", status: "completed", progress: 100, due: "Jun 30, 2025", lead: "Joy Wanjiru", updated: "3 days ago" },
  { id: "cp-05", name: "RetailOps CRM", client: "Urban Retail", category: "Retail", status: "in progress", progress: 48, due: "Sep 28, 2025", lead: "Kelvin Njoroge", updated: "4h ago" },
  { id: "cp-06", name: "Logix Fleet", client: "Logix", category: "Logistics", status: "pending", progress: 8, due: "Dec 10, 2025", lead: "Marcus Otieno", updated: "2 days ago" },
];

export type Conversation = {
  id: string;
  name: string;
  role: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
};

export const conversations: Conversation[] = [
  { id: "c-01", name: "Marcus Otieno", role: "Tech Lead — Atlas", preview: "Pushed the new auth flow to staging — could you take a look?", time: "12m", unread: 2, online: true },
  { id: "c-02", name: "Aisha Kamau", role: "PM — MediTrack", preview: "QA round 2 looks clean. Targeting Friday release.", time: "1h", unread: 0, online: true },
  { id: "c-03", name: "Joy Wanjiru", role: "Designer", preview: "Updated the dashboard tokens in Figma.", time: "3h", unread: 1, online: false },
  { id: "c-04", name: "Brian Mwangi", role: "Backend — Harvest", preview: "Schema draft attached. Ready for review.", time: "Yesterday", unread: 0, online: false },
  { id: "c-05", name: "Kelvin Njoroge", role: "DevOps", preview: "CI pipeline migrated to the new runner.", time: "2d", unread: 0, online: true },
];

export type ThreadMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export const sampleThread: ThreadMessage[] = [
  { id: "m-1", from: "them", text: "Morning! Pushed the new auth flow to staging.", time: "09:12" },
  { id: "m-2", from: "them", text: "Includes magic-link + Google OAuth.", time: "09:12" },
  { id: "m-3", from: "me", text: "Awesome — testing now. Did you wire the audit log?", time: "09:24" },
  { id: "m-4", from: "them", text: "Yes, every sign-in event lands in `auth_events`.", time: "09:26" },
  { id: "m-5", from: "me", text: "Perfect. Let's demo this on Thursday's call.", time: "09:31" },
  { id: "m-6", from: "them", text: "Sounds good. I'll prep a short walkthrough deck.", time: "09:33" },
];

export type Invoice = {
  id: string;
  project: string;
  amount: number;
  currency: "USD" | "KES";
  status: "paid" | "due" | "overdue" | "draft";
  issued: string;
  due: string;
};

export const invoices: Invoice[] = [
  { id: "INV-1048", project: "Atlas Banking Core — Sprint 6", amount: 8400, currency: "USD", status: "due", issued: "May 02, 2026", due: "May 22, 2026" },
  { id: "INV-1047", project: "MediTrack HMS — QA Retainer", amount: 3200, currency: "USD", status: "paid", issued: "Apr 28, 2026", due: "May 10, 2026" },
  { id: "INV-1046", project: "Harvest ERP — Discovery", amount: 1800, currency: "USD", status: "paid", issued: "Apr 18, 2026", due: "Apr 28, 2026" },
  { id: "INV-1045", project: "Skyline LMS v2 — Final", amount: 12500, currency: "USD", status: "paid", issued: "Apr 02, 2026", due: "Apr 16, 2026" },
  { id: "INV-1044", project: "RetailOps CRM — Sprint 3", amount: 540000, currency: "KES", status: "overdue", issued: "Mar 22, 2026", due: "Apr 05, 2026" },
  { id: "INV-1043", project: "Logix Fleet — Kickoff", amount: 2200, currency: "USD", status: "draft", issued: "—", due: "—" },
];
