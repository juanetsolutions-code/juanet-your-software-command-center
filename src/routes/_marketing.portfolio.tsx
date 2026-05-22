import { createFileRoute } from "@tanstack/react-router";
import { PortfolioGrid } from "@/components/marketing/PortfolioGrid";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { CTA } from "@/components/marketing/CTA";

export const Route = createFileRoute("/_marketing/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Juanet" },
      {
        name: "description",
        content:
          "Systems Juanet has shipped: school, CRM, inventory, LMS, hospital and finance platforms.",
      },
      { property: "og:title", content: "Juanet Portfolio" },
      {
        property: "og:description",
        content: "A snapshot of platforms powering schools, hospitals, agencies and finance teams.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40 pb-0">
        <SectionHeader
          eyebrow="Portfolio"
          title="A selection of systems we've shipped"
          description="Filter by category to explore platforms across schools, healthcare, retail, finance and more."
        />
      </Section>
      <PortfolioGrid compact />
      <CTA />
    </>
  );
}
