import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/marketing/Hero";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { OngoingProjects } from "@/components/marketing/OngoingProjects";
import { PortfolioGrid } from "@/components/marketing/PortfolioGrid";
import { MarketplacePreview } from "@/components/marketing/MarketplacePreview";
import { CTA } from "@/components/marketing/CTA";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    meta: [
      { title: "Juanet — Building Software Infrastructure For Modern Businesses" },
      {
        name: "description",
        content:
          "Juanet designs, builds, deploys and scales modern software systems — custom development, SaaS products, automation and enterprise infrastructure.",
      },
      { property: "og:title", content: "Juanet — Software Infrastructure for Modern Businesses" },
      {
        property: "og:description",
        content:
          "Custom software, SaaS, automation, cloud infrastructure and AI — one accountable team.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <OngoingProjects />
      <PortfolioGrid />
      <MarketplacePreview />
      <CTA />
    </>
  );
}
