import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/marketing/Section";
import { CTA } from "@/components/marketing/CTA";
import { stats } from "@/lib/site";

export const Route = createFileRoute("/_marketing/about")({
  head: () => ({
    meta: [
      { title: "About — Juanet" },
      { name: "description", content: "Juanet is a software infrastructure company helping modern businesses ship and scale." },
      { property: "og:title", content: "About Juanet" },
      { property: "og:description", content: "We build software infrastructure for modern businesses." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeader
          eyebrow="About"
          title="A software infrastructure company"
          description="Juanet is a multidisciplinary team of engineers, designers and operators building the systems modern businesses run on."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-semibold text-gradient-brand">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { t: "Engineering-led", d: "Senior engineers own outcomes end-to-end — no handoffs, no ticket-shuffling." },
            { t: "Product-minded", d: "We design for adoption and revenue, not just shipping features." },
            { t: "Infrastructure-grade", d: "Every system we deliver runs in production with observability and SLAs." },
          ].map((b) => (
            <div key={b.t} className="glass rounded-2xl p-6">
              <h3 className="font-semibold tracking-tight">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </Section>
      <CTA />
    </>
  );
}
