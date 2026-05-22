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
  {
    slug: "custom-software",
    title: "Custom Software Development",
    description: "Bespoke systems engineered around your operations, from idea to deployment.",
    icon: "Code2",
  },
  {
    slug: "saas",
    title: "SaaS Development",
    description: "Multi-tenant SaaS platforms with billing, auth, and dashboards built-in.",
    icon: "Cloud",
  },
  {
    slug: "automation",
    title: "Automation Systems",
    description: "Replace manual workflows with reliable, observable automation pipelines.",
    icon: "Workflow",
  },
  {
    slug: "cloud",
    title: "Cloud Infrastructure",
    description: "Production-grade infra: Docker, CI/CD, scaling, observability, on any cloud.",
    icon: "Server",
  },
  {
    slug: "design",
    title: "UI/UX Design",
    description: "Design systems and product UX that convert and scale with your roadmap.",
    icon: "Palette",
  },
  {
    slug: "api",
    title: "API Integrations",
    description: "Connect Stripe, M-Pesa, ERPs and 3rd-party systems with bulletproof APIs.",
    icon: "PlugZap",
  },
  {
    slug: "ai",
    title: "AI Solutions",
    description: "LLM-powered features, RAG, agents and ML pipelines wired into your product.",
    icon: "Sparkles",
  },
  {
    slug: "enterprise",
    title: "Enterprise Systems",
    description: "ERPs, internal tools and mission-critical platforms built to last.",
    icon: "Building2",
  },
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
  {
    id: "p-01",
    name: "Atlas Banking Core",
    client: "Atlas Financial",
    category: "FinTech",
    status: "In Progress",
    progress: 64,
    due: "Q3 2025",
  },
  {
    id: "p-02",
    name: "MediTrack HMS",
    client: "Nairobi Health Group",
    category: "Healthcare",
    status: "QA",
    progress: 88,
    due: "Aug 2025",
  },
  {
    id: "p-03",
    name: "Harvest ERP",
    client: "Greenfields Co.",
    category: "Agritech",
    status: "Planning",
    progress: 22,
    due: "Q4 2025",
  },
  {
    id: "p-04",
    name: "Skyline LMS",
    client: "Skyline Academy",
    category: "Education",
    status: "Launching",
    progress: 96,
    due: "Jul 2025",
  },
  {
    id: "p-05",
    name: "RetailOps CRM",
    client: "Urban Retail",
    category: "Retail",
    status: "In Progress",
    progress: 48,
    due: "Sep 2025",
  },
  {
    id: "p-06",
    name: "Logix Fleet",
    client: "Logix Logistics",
    category: "Logistics",
    status: "In Progress",
    progress: 71,
    due: "Oct 2025",
  },
];

export type PortfolioItem = {
  id: string;
  title: string;
  category: "School" | "CRM" | "Inventory" | "LMS" | "Hospital" | "Finance";
  tagline: string;
};

export const portfolio: PortfolioItem[] = [
  {
    id: "f-01",
    title: "Scholaris — School Management System",
    category: "School",
    tagline: "End-to-end school operations: students, fees, exams, parents.",
  },
  {
    id: "f-02",
    title: "Pulse CRM",
    category: "CRM",
    tagline: "Pipeline, contacts and revenue intelligence for B2B teams.",
  },
  {
    id: "f-03",
    title: "StockGrid Inventory",
    category: "Inventory",
    tagline: "Multi-warehouse stock with barcoding and forecasting.",
  },
  {
    id: "f-04",
    title: "Lumen LMS",
    category: "LMS",
    tagline: "Modern learning management with live classes and analytics.",
  },
  {
    id: "f-05",
    title: "MediCore HMS",
    category: "Hospital",
    tagline: "Patient records, billing and pharmacy in one secure suite.",
  },
  {
    id: "f-06",
    title: "Ledger Finance Suite",
    category: "Finance",
    tagline: "Books, invoicing and reconciliations for growing companies.",
  },
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
  {
    id: "m-01",
    name: "Scholaris SMS — Standard",
    category: "Education",
    price: 499,
    rating: 4.9,
    reviews: 132,
    tagline: "School management system, self-hosted license.",
  },
  {
    id: "m-02",
    name: "Pulse CRM — Team",
    category: "CRM",
    price: 299,
    rating: 4.8,
    reviews: 98,
    tagline: "CRM with pipeline, contacts, automation.",
  },
  {
    id: "m-03",
    name: "StockGrid Pro",
    category: "Inventory",
    price: 399,
    rating: 4.7,
    reviews: 64,
    tagline: "Inventory & POS with barcoding.",
  },
  {
    id: "m-04",
    name: "Lumen LMS",
    category: "Education",
    price: 349,
    rating: 4.9,
    reviews: 77,
    tagline: "Modern LMS with live classes.",
  },
  {
    id: "m-05",
    name: "MediCore HMS — Clinic",
    category: "Healthcare",
    price: 599,
    rating: 4.8,
    reviews: 41,
    tagline: "Hospital management for clinics.",
  },
  {
    id: "m-06",
    name: "Ledger Suite",
    category: "Finance",
    price: 249,
    rating: 4.6,
    reviews: 53,
    tagline: "Accounting & invoicing platform.",
  },
];

export const stats = [
  { label: "Systems Shipped", value: "120+" },
  { label: "Enterprise Clients", value: "45" },
  { label: "Countries Served", value: "12" },
  { label: "Uptime SLA", value: "99.99%" },
];

// Client dashboard types, mocks, and the swappable data-access layer
// live in `@/lib/dashboard`. Importing dashboard data from this file is
// no longer supported.
