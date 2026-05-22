import { createFileRoute } from "@tanstack/react-router";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { CTA } from "@/components/marketing/CTA";
import { Section, SectionHeader } from "@/components/marketing/Section";

export const Route = createFileRoute("/_marketing/services")({
  head: () => ({
    meta: [
      { title: "Services — Juanet" },
      {
        name: "description",
        content:
          "Custom software, SaaS, automation, cloud, UI/UX, API, AI and enterprise systems by Juanet.",
      },
      { property: "og:title", content: "Juanet Services" },
      {
        property: "og:description",
        content: "End-to-end software engineering for modern businesses.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40 pb-0">
        <SectionHeader
          eyebrow="What we do"
          title="Engineering modern software, end-to-end"
          description="We design, build and operate systems that businesses run on — from product UI to production infrastructure."
        />
      </Section>
      <ServicesGrid />
      <CTA />
    </>
  );
}
