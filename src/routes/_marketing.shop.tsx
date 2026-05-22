import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePreview } from "@/components/marketing/MarketplacePreview";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { CTA } from "@/components/marketing/CTA";

export const Route = createFileRoute("/_marketing/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Juanet Marketplace" },
      {
        name: "description",
        content: "License production-ready software platforms from Juanet's marketplace.",
      },
      { property: "og:title", content: "Juanet Marketplace" },
      {
        property: "og:description",
        content: "Battle-tested systems with self-hosted licenses and source delivery.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40 pb-0">
        <SectionHeader
          eyebrow="Marketplace"
          title="License production-ready systems"
          description="Buy and self-host platforms with source delivery, license keys and ongoing updates."
        />
      </Section>
      <MarketplacePreview full />
      <CTA />
    </>
  );
}
